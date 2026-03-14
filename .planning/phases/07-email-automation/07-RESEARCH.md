# Phase 7: Email Automation - Research

**Researched:** 2026-03-14
**Domain:** Kit (ConvertKit) email automation — sequences, automations, segments, custom fields, API v4
**Confidence:** HIGH (core Kit capabilities verified via official docs; win-back workaround is MEDIUM)

## Summary

Phase 7 builds a complete post-purchase email system on top of the existing Netlify → Kit webhook. The phase has three distinct work streams: (1) extending the Netlify webhook to write three custom fields on purchase, (2) building two onboarding automations in Kit that trigger off existing buyer tags and simultaneously suppress the nurture sequence, and (3) building five subscriber segments plus a win-back automation for cold leads.

The single most important constraint is plan tier. The Kit free plan allows exactly one Visual Automation and one Sequence. Phase 7 requires at minimum three Visual Automations (Starter onboarding, Full Kit onboarding, win-back) and three Sequences (Starter, Full Kit, win-back). The Creator plan ($39/mo monthly, $33/mo annually) must be activated before any Kit automation work begins. This was already planned as a prerequisite for Phase 7 in prior decisions.

The 60-day win-back trigger requirement has no native Kit equivalent. Kit's "cold subscriber" status is fixed at 90 days and is not configurable. The 60-day threshold requires a tag-based workaround: segment non-buyers inactive for 60+ days via `GET /v4/subscribers?filter_by_engagement` or a manual segment broadcast, tag them with a trigger tag (e.g., `win-back-candidate`), and use that tag as the Visual Automation entry point. The webhook custom field work is straightforward: the existing v3 API call needs to be extended with a second `PUT /v4/subscribers/{id}` call after tagging.

**Primary recommendation:** Upgrade to Kit Creator plan first, then implement in this order: (1) custom fields in webhook, (2) buyer suppression automation rule, (3) onboarding sequences and automations, (4) segments, (5) win-back.

## Standard Stack

### Core

| Component | Version/Plan | Purpose | Why Standard |
|-----------|-------------|---------|--------------|
| Kit (ConvertKit) | Creator plan ($39/mo) | Email sequences, automations, segments | Required for unlimited automations/sequences — free plan caps at 1 of each |
| Kit API v4 | `api.kit.com/v4` | Programmatic subscriber updates | Current stable API; v3 still works but is legacy |
| Netlify Functions | Existing (Node.js) | Webhook handler for Stripe → Kit | Already deployed and HMAC-verified |

### Supporting

| Component | Purpose | When to Use |
|-----------|---------|-------------|
| Kit Automation Rules | Simple trigger → action pairs | Buyer suppression (tag added → unsubscribe from sequence) |
| Kit Visual Automations | Multi-step flows with conditions | Onboarding sequences, win-back |
| Kit Segments | Dynamic subscriber filters | Audience reporting and targeted broadcasts |
| Kit Custom Fields | Per-subscriber metadata | `product_tier`, `purchase_value`, `purchase_date` |

### No Additional npm Packages Required

The Netlify function already uses Node.js built-in `crypto` and `fetch`. No new dependencies are needed for the webhook extension.

## Architecture Patterns

### Kit Automation Hierarchy

```
Automation Rules      → Simple "if trigger, then action" pairs (no UI builder)
Visual Automations    → Multi-step flows with sequences, delays, conditions
Sequences             → Sets of timed emails (added to via Automations or API)
Segments              → Dynamic read-only filters (cannot trigger automations)
```

### Pattern 1: Buyer Suppression via Automation Rule

**What:** A Kit Automation Rule fires when a tag is applied and immediately removes the subscriber from the nurture sequence.

**When to use:** For every purchase event. Kit applies `purchased-starter` or `purchased-full-kit` tags via the existing webhook. The rule intercepts this and removes the nurture sequence before any onboarding automation adds its own sequence.

**How to configure in Kit UI:**
```
Trigger: Tag added → "purchased-starter" (create one rule per tag)
Action:  Unsubscribe from sequence → [Nurture Sequence Name]

Trigger: Tag added → "purchased-full-kit"
Action:  Unsubscribe from sequence → [Nurture Sequence Name]
```

**Important:** Automation Rules fire in addition to Visual Automations. Both can respond to the same tag-added event simultaneously. Set up the Rule first, then build the Visual Automation.

### Pattern 2: Post-Purchase Onboarding via Visual Automation

**What:** A Visual Automation triggered by tag addition that enrolls the buyer in their product-specific onboarding sequence.

**When to use:** For both Starter and Full Kit buyers (two separate automations).

**Entry trigger available:** "Subscriber is added to a Tag" — confirmed as a valid Visual Automation entry point (verified: help.kit.com visual automations docs).

**Structure:**
```
Entry: Tag added → "purchased-starter"
  └── Action: Add to Sequence → [Starter Onboarding Sequence]
       └── (Sequence handles 5 emails over 14 days with delays)

Entry: Tag added → "purchased-full-kit"
  └── Action: Add to Sequence → [Full Kit Onboarding Sequence]
       └── (Sequence handles 5 emails over 14 days with delays)
```

**Sequence timing options verified:** First email can be immediate; subsequent emails support day-level and hour-level delays; specific weekday restrictions are available per email.

### Pattern 3: Win-Back via Tag-Based Trigger (60-day workaround)

**What:** Kit's built-in cold subscriber status is fixed at 90 days and cannot be changed. To trigger win-back at 60 days, apply a tag to qualifying subscribers, then use that tag as the Visual Automation entry point.

**The constraint:** `GET /v4/subscribers/filter-by-engagement` endpoint exists but Kit's cold status definition cannot be customized. There is no native "inactive for N days" trigger.

**Workaround approach:**
1. Create a Kit Segment: subscribers who have tag `purchased-starter` = NO AND tag `purchased-full-kit` = NO AND cold subscriber status = YES (this captures 90+ day cold non-buyers, which covers the 60-day intent as a conservative approximation)
2. Alternatively: use the Kit UI segment broadcast to select inactive non-buyers and manually tag them `win-back-candidate` on a periodic basis (monthly manual operation)
3. Visual Automation entry: Tag added → `win-back-candidate`

**Re-engagement template:** Kit provides a pre-built "ad hoc list cleaning" Visual Automation template that implements a re-engagement flow with a link-click trigger for reactivation and automatic unsubscribe for non-responders. Use this as the starting point for the win-back automation.

**Structure for 3-email win-back:**
```
Entry: Tag added → "win-back-candidate"
  └── Action: Add to Sequence → [Win-Back Sequence]
       Email 1: Day 0 — re-engagement offer
       Email 2: Day 4 — value reminder
       Email 3: Day 8 — last chance / unsubscribe option
  └── (After sequence: remove win-back-candidate tag, optionally unsubscribe non-openers)
```

### Pattern 4: Webhook Custom Fields Extension

**What:** After the existing tag operations, make an additional API call to `PUT /v4/subscribers/{id}` to set `product_tier`, `purchase_value`, and `purchase_date` on the subscriber record.

**Challenge:** The existing webhook uses the v3 API (`api.convertkit.com/v3`) with `api_secret` in the request body. The v4 API uses `api.kit.com/v4` with `X-Kit-Api-Key` header. The two can coexist — keep the v3 tag call as-is, add a separate v4 call for custom fields, or migrate everything to v4.

**Recommended approach:** Extend with v4 for the new custom field call. Use `GET /v4/subscribers?email_address={email}` to get the subscriber ID, then `PUT /v4/subscribers/{id}` to set fields. Add `KIT_API_KEY` as a new environment variable (v4 API key, not the same as v3 `api_secret`).

**API v4 subscriber lookup by email:**
```
GET https://api.kit.com/v4/subscribers?email_address=buyer@example.com
Headers: X-Kit-Api-Key: {api_key}
Response: { "subscribers": [{ "id": 12345, ... }] }
```

**API v4 subscriber update with custom fields:**
```
PUT https://api.kit.com/v4/subscribers/{id}
Headers: X-Kit-Api-Key: {api_key}, Content-Type: application/json
Body:
{
  "email_address": "buyer@example.com",
  "fields": {
    "product_tier": "starter",
    "purchase_value": "147.00",
    "purchase_date": "2026-03-14"
  }
}
Response 200: { "subscriber": { "id": 12345, "fields": { ... } } }
Response 202: Async processing (>10 custom fields — won't occur here)
```

**Critical:** Custom fields must be pre-created in Kit before the API will set them. Fields that don't exist in the account are silently ignored. Create all three fields in Kit UI before deploying the updated webhook.

### Pattern 5: Segment Configuration

**What:** Five static filter segments configured in Kit UI. Segments are dynamic (auto-update) and filter-only — they cannot trigger automations.

**Segment definitions:**
```
Buyers-All:        Has tag "purchased-starter" OR has tag "purchased-full-kit"
Buyers-Starter:    Has tag "purchased-starter"
Buyers-Full-Kit:   Has tag "purchased-full-kit"
Leads-Only:        Does NOT have tag "purchased-starter" AND NOT "purchased-full-kit"
Cold-Subscribers:  Status = Cold Subscriber (Kit's built-in 90-day definition)
```

**Segment filter capabilities confirmed:** Tags (has/does not have), forms, sequences. The "Cold Subscriber" filter is available in segment creation via the dropdown. Custom field value filtering was not confirmed as a segment filter option — use tag-based filtering for all five required segments.

### Anti-Patterns to Avoid

- **Using segments as automation triggers:** Segments are read-only filters. They cannot trigger automations. Always use tags as triggers.
- **Setting custom fields before they exist in Kit:** Silent failure — the API ignores unknown field names. Always create fields in the Kit UI first, verify they appear in account settings, then deploy the webhook changes.
- **Relying on Kit's cold subscriber status for the 60-day requirement:** It is fixed at 90 days. Do not attempt to configure it. Use a tag-based entry to the win-back automation.
- **Running both v3 and v4 API auth in parallel without isolation:** v4 API Keys are not the same as v3 `api_secret`. They require separate environment variables. Do not reuse `KIT_API_SECRET` as a v4 `X-Kit-Api-Key` header value.
- **Building onboarding sequences before upgrading the plan:** The free plan's single sequence slot is occupied by the existing nurture sequence. All Phase 7 sequence work blocks until Creator plan is active.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery and timing | Custom SMTP + scheduler | Kit sequences with delay steps | Deliverability, timezone handling, unsubscribe compliance |
| Subscriber suppression logic | Custom "don't email buyers" check | Kit automation rule (tag added → unsubscribe from sequence) | Native, real-time, no code required |
| Re-engagement flow | Custom drip with engagement tracking | Kit win-back template + Visual Automation | Pre-built, includes link-click reactivation and auto-unsubscribe |
| List segmentation queries | Custom subscriber database queries | Kit segments | Auto-updating, accessible in broadcast UI |
| HMAC webhook signature verification | Custom crypto implementation | Already implemented in ls-webhook.js | Do not replace — extend only |

**Key insight:** Kit handles all email delivery, compliance, and engagement tracking natively. Code only needs to bridge the gap between Stripe purchase events and Kit's subscriber data model.

## Common Pitfalls

### Pitfall 1: Free Plan Blocks All Phase 7 Kit Work

**What goes wrong:** Attempting to create a second sequence or second Visual Automation on the free plan fails with a plan gate. Work stops.

**Why it happens:** Kit free plan allows exactly 1 Visual Automation and 1 Sequence. The nurture sequence already occupies both slots.

**How to avoid:** Upgrade to Kit Creator plan as the first action of Plan 07-01. Verify by checking account settings → plan shows "Creator."

**Warning signs:** Kit UI shows "upgrade required" when creating a new automation or sequence.

### Pitfall 2: Custom Fields Silently Ignored

**What goes wrong:** The webhook deploys and fires successfully (200 response), but subscriber records show no custom field values.

**Why it happens:** If `product_tier`, `purchase_value`, or `purchase_date` don't exist as custom field definitions in the Kit account, the `PUT /v4/subscribers/{id}` call succeeds but ignores the `fields` object entries.

**How to avoid:** Create all three custom fields in Kit UI (Subscribers → Custom Fields or via a subscriber's profile) before deploying webhook changes. Use exact case-matching field names.

**Warning signs:** Webhook returns 200, subscriber ID is found, but fields are empty on subscriber profile.

### Pitfall 3: Automation Rule Doesn't Fire for Existing Subscribers

**What goes wrong:** Buyers who were already in the nurture sequence before the automation rule was created don't get removed from it.

**Why it happens:** Automation rules only fire going forward from when they're activated. They do not retroactively process existing tag assignments.

**How to avoid:** For any existing subscribers who already have buyer tags, manually remove them from the nurture sequence via Kit UI (Subscribers → filter by tag → Bulk Actions → Remove from Sequence).

**Warning signs:** Test with a fresh test subscriber; existing buyers remain in nurture.

### Pitfall 4: v3 vs v4 API Authentication Confusion

**What goes wrong:** Using `KIT_API_SECRET` (v3) as the `X-Kit-Api-Key` header (v4) returns 401 Unauthorized.

**Why it happens:** v4 uses API Keys, not the API Secret. These are different credentials in Kit account settings.

**How to avoid:** Add a separate `KIT_API_KEY` environment variable in Netlify. Get the v4 API key from Kit account settings → Developer. Keep `KIT_API_SECRET` for the existing v3 tag calls (or migrate those too — either is fine).

**Warning signs:** v4 calls return 401 while v3 calls continue to succeed.

### Pitfall 5: Win-Back Automation Enrolling Buyers

**What goes wrong:** A subscriber who purchased but opened no emails (or purchased recently) gets enrolled in the win-back sequence.

**Why it happens:** The win-back trigger tag (`win-back-candidate`) was applied to subscribers who have buyer tags.

**How to avoid:** When applying the win-back trigger tag (manually or via segment), always filter to exclude subscribers with `purchased-starter` OR `purchased-full-kit` tags. The "Leads-Only" segment exists exactly for this purpose.

**Warning signs:** Buyers receiving win-back emails complaining about irrelevant content.

### Pitfall 6: Cold Subscriber Segment Cannot Be Used for 60-Day Automation

**What goes wrong:** The requirements say 60 days of inactivity triggers win-back. Kit's cold subscriber status is fixed at 90 days. Building the segment with "Cold Subscriber" status does not meet the 60-day requirement.

**Why it happens:** Kit's cold subscriber criteria "cannot be modified at this time" — per official Kit help documentation.

**How to avoid:** Accept 90-day cold status as the approximation, or implement a manual monthly process to tag eligible non-buyers. Document the 60-day vs 90-day discrepancy in the plan. Confirm acceptance with the user during planning.

**Warning signs:** Phase 7 success criterion states "60+ days" but the segment uses Kit's 90-day cold definition.

## Code Examples

### Webhook Extension: Lookup Subscriber ID and Set Custom Fields

```javascript
// Source: https://developers.kit.com/api-reference/subscribers/list-subscribers
// Source: https://developers.kit.com/api-reference/subscribers/update-a-subscriber
// Called after the existing v3 tag operation succeeds

async function setKitCustomFields(buyerEmail, productTier, amountTotal, kitApiKey) {
  // Step 1: Find subscriber ID by email
  const lookupRes = await fetch(
    `https://api.kit.com/v4/subscribers?email_address=${encodeURIComponent(buyerEmail)}`,
    { headers: { "X-Kit-Api-Key": kitApiKey } }
  );
  if (!lookupRes.ok) {
    console.error(`[webhook] Kit v4 subscriber lookup failed: ${lookupRes.status}`);
    return; // Non-fatal: tag already applied, custom fields are best-effort
  }
  const lookupData = await lookupRes.json();
  const subscriber = lookupData.subscribers?.[0];
  if (!subscriber) {
    console.error(`[webhook] No Kit subscriber found for ${buyerEmail}`);
    return;
  }

  // Step 2: Update custom fields
  const purchaseDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const purchaseValue = (amountTotal / 100).toFixed(2); // cents → dollars string

  const updateRes = await fetch(
    `https://api.kit.com/v4/subscribers/${subscriber.id}`,
    {
      method: "PUT",
      headers: {
        "X-Kit-Api-Key": kitApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: buyerEmail,
        fields: {
          product_tier: productTier,       // "starter" or "full-kit"
          purchase_value: purchaseValue,   // "147.00" or "499.00"
          purchase_date: purchaseDate,     // "2026-03-14"
        },
      }),
    }
  );

  if (!updateRes.ok) {
    console.error(`[webhook] Kit custom field update failed: ${updateRes.status}`);
  } else {
    console.log(`[webhook] Custom fields set for ${buyerEmail}: tier=${productTier}`);
  }
}
```

**New environment variable required:** `KIT_API_KEY` (v4 API key from Kit account settings → Developer)

### Kit Automation Rule Configuration (UI, not code)

```
Rule 1 — Starter buyer suppression:
  Trigger: Tag added = "purchased-starter"
  Action:  Unsubscribe from sequence = [name of nurture sequence]

Rule 2 — Full Kit buyer suppression:
  Trigger: Tag added = "purchased-full-kit"
  Action:  Unsubscribe from sequence = [name of nurture sequence]
```

Source: https://help.kit.com/en/articles/6611507-how-to-create-and-manage-automation-rules-in-kit

### Sequence Timing Structure (5 emails over 14 days)

```
Email 1: Send immediately (delay = 0 days)
Email 2: Delay 2 days after previous
Email 3: Delay 3 days after previous (day 5)
Email 4: Delay 4 days after previous (day 9)
Email 5: Delay 5 days after previous (day 14)
```

Source: https://help.kit.com/en/articles/2502629-creating-and-sending-a-sequence-in-kit

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| ConvertKit v3 API (`api.convertkit.com/v3`) | Kit v4 API (`api.kit.com/v4`) | v3 still functional but legacy; v4 adds API keys vs secrets |
| v3 auth: `api_secret` in request body | v4 auth: `X-Kit-Api-Key` request header | More secure; credentials not in body |
| v3 tag subscribe: `POST /v3/tags/:id/subscribe` | v4 tag: `POST /v4/subscribers/{id}/tags` or `POST /v4/subscribers/tags` | Different URL pattern |
| Brand name: ConvertKit | Brand name: Kit | Same product, renamed ~2024 |

**Existing webhook uses v3.** The phase 7 webhook extension will add v4 calls alongside existing v3 calls. This is a valid mixed approach. Full v3 → v4 migration is out of scope for this phase.

## Open Questions

1. **60-day vs 90-day inactivity for win-back**
   - What we know: Kit's cold subscriber status is fixed at 90 days (confirmed, not configurable)
   - What's unclear: Whether the user accepts 90 days as the working approximation, or wants a manual monthly tagging process to implement 60-day targeting
   - Recommendation: Plan 07-03 should document both options and default to using Kit's native cold subscriber segment (90 days). Flag this tradeoff explicitly in the plan.

2. **Whether to migrate existing v3 webhook calls to v4**
   - What we know: v3 still works; v4 requires different credentials; mixed calls are valid
   - What's unclear: User preference on maintaining two API versions in the same function
   - Recommendation: Keep v3 tag calls as-is (lower risk), add v4 only for new custom field calls. Note that full migration is a future cleanup item.

3. **Exact nurture sequence name in Kit**
   - What we know: A 5-email nurture sequence exists in Kit
   - What's unclear: Its exact name in Kit (needed for the automation rule "unsubscribe from sequence" action)
   - Recommendation: Plan tasks should instruct the user to locate the sequence name in Kit UI before configuring automation rules.

4. **Creator plan upgrade timing relative to Phase 6 completion**
   - What we know: Prior decisions note "Kit Creator plan deferred until Phase 7" and Phase 7 depends on Phase 6
   - What's unclear: Whether Phase 6 is complete at time Phase 7 begins
   - Recommendation: Plan 07-01 first task should be Creator plan upgrade, with a verification check before proceeding.

5. **v4 API Key availability in Kit account**
   - What we know: v4 API keys are available in Kit account settings under Developer
   - What's unclear: Whether the current Kit account has generated a v4 API key yet
   - Recommendation: Plan 07-01 should include a setup step to generate and add `KIT_API_KEY` to Netlify environment variables.

## Sources

### Primary (HIGH confidence)

- https://help.kit.com/en/articles/9053626-visual-automations-on-the-newsletter-plan — Free plan: 1 automation, 1 sequence limit; entry points; action types
- https://help.kit.com/en/articles/6611507-how-to-create-and-manage-automation-rules-in-kit — All 7 trigger types; all 7 action types; "unsubscribe from sequence" confirmed
- https://developers.kit.com/api-reference/subscribers/update-a-subscriber — `PUT /v4/subscribers/{id}` with `fields` object; response 200/202
- https://developers.kit.com/api-reference/subscribers/list-subscribers — `GET /v4/subscribers?email_address=` for subscriber ID lookup
- https://developers.kit.com/api-reference/sequences/add-subscriber-to-sequence-by-email-address — `POST /v4/sequences/{id}/subscribers`
- https://developers.kit.com/api-reference/upgrading-to-v4 — v3 → v4 migration; auth changes; base URL change
- https://help.kit.com/en/articles/2502651-the-subscriber-profile-page-status — Cold subscriber = 90 days fixed, not configurable
- https://help.kit.com/en/articles/2502537-visual-automations-actions — 6 action types in visual automations
- https://help.kit.com/en/articles/2502665-visual-automations-conditions — 4 condition types: tags, custom fields, advanced filter, email opens
- https://help.kit.com/en/articles/5268661-cleaning-and-managing-your-list — Win-back template; ad hoc cold subscriber automation approach
- https://developers.kit.com/llms.txt — Complete API endpoint index
- https://help.kit.com/en/articles/2502504-how-to-add-custom-fields-to-subscribers — Custom fields: text only, max 140, ignored if not pre-created
- https://kit.com/pricing — Creator plan: $33/mo annual, $39/mo monthly; free plan: 1 basic automation

### Secondary (MEDIUM confidence)

- https://help.kit.com/en/articles/4257108-tags-and-segments-in-kit-and-when-to-use-which — Tags vs segments; segments can filter by tags; segments cannot trigger automations
- https://help.kit.com/en/articles/2577659-how-to-create-a-segment — Segment filters: forms, tags, sequences; no explicit limit on number of segments
- https://help.kit.com/en/articles/2502629-creating-and-sending-a-sequence-in-kit — Sequence timing: immediate, day, hour delays; weekday restrictions

### Tertiary (LOW confidence — needs validation in Kit UI)

- WebSearch results re: cold subscriber filter available in segment creation dropdown — verified via official subscriber profile docs, upgraded to HIGH

## Metadata

**Confidence breakdown:**
- Kit plan requirements: HIGH — confirmed from official pricing and feature comparison pages
- Automation rule capabilities (buyer suppression): HIGH — confirmed from official automation rules help doc
- Visual automation entry triggers and actions: HIGH — confirmed from official help docs
- API v4 custom field update pattern: HIGH — confirmed from official developer docs
- 60-day win-back workaround: MEDIUM — cold subscriber 90-day constraint is confirmed; workaround approach is reasonable but no official Kit doc specifically addresses this scenario
- Segment filter capabilities: MEDIUM — tag/form/sequence filters confirmed; cold subscriber in segment dropdown confirmed; custom field filtering in segments not confirmed

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (Kit platform is moderately stable; pricing and plan features may change)
