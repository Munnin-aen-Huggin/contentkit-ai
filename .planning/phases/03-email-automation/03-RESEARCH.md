# Phase 3: Email Automation - Research

**Researched:** 2026-02-26
**Domain:** Kit (ConvertKit) email automation, Lemon Squeezy webhooks, serverless webhook receivers
**Confidence:** MEDIUM-HIGH (Kit and Lemon Squeezy APIs verified; Kit free-plan limits confirmed across multiple sources; webhook patterns verified from official docs)

---

## Summary

Phase 3 connects three systems: Kit for email opt-in and nurture, Lemon Squeezy for purchase-triggered buyer tagging, and a serverless function to bridge the webhook gap. The Kit JavaScript embed code on the landing page handles opt-in collection. A Kit visual automation (triggered by form subscription) adds the subscriber to the lead-magnet delivery sequence. Lemon Squeezy's `order_created` webhook fires on every purchase — regardless of whether the buyer's browser completes the redirect — making it the reliable signal for buyer tagging.

**Critical constraint discovered:** The Kit free Newsletter plan is limited to **1 visual automation and 1 email sequence**. The phase as described requires 3 sequences (lead-magnet-delivery, post-purchase-starter, post-purchase-full-kit) and at minimum 2 automations (one for opt-in, one for buyer tagging). This constraint means the free plan cannot support this phase's full requirements without structural changes. The planner must address this head-on: either (a) restructure into a single sequence + single automation using direct API calls for buyers, (b) upgrade to Kit Creator plan ($33/month), or (c) use the Kit API directly (bypassing the visual automation UI) for sequences — but this still counts against the 1-sequence limit in the UI.

The Lemon Squeezy native ConvertKit integration only syncs the buyer's email to a selected form — it does not tag, does not add to a specific sequence, and does not distinguish between Starter vs Full Kit buyers. For the buyer tagging requirement (MAIL-05 / success criterion 4), a custom webhook receiver is required. GitHub Pages cannot host server-side functions, so a separate serverless host (Netlify Functions, Cloudflare Workers, or Zapier) must receive the `order_created` webhook and call the Kit API to apply the correct buyer tag.

**Primary recommendation:** Upgrade Kit to Creator plan ($33/mo) to unlock unlimited sequences and automations. Then use: (1) Kit visual automation triggered by form opt-in → lead-magnet-delivery sequence; (2) Lemon Squeezy webhook → Netlify Function → Kit API `POST /v3/tags/{id}/subscribe` for buyer tagging; (3) buyer tag triggers second automation → post-purchase sequence. This is the lowest-complexity implementation that satisfies all success criteria.

---

## Critical Finding: Kit Free Plan Limits

**Confirmed across official Kit pricing page and multiple third-party reviews (HIGH confidence):**

| Feature | Free Newsletter Plan | Creator Plan ($33/mo) |
|---------|---------------------|----------------------|
| Sequences | **1** | Unlimited |
| Visual Automations | **1 basic** | Unlimited |
| Automation Rules | NOT confirmed available | YES (paid) |
| Direct app integrations | NOT included | 100+ apps |
| Subscribers | 10,000 | Scales with price |
| Forms & landing pages | Unlimited | Unlimited |
| Email sends | Unlimited | Unlimited |
| Kit branding on forms | Required | Optional |

The phase plan states "Kit (ConvertKit) for email — 10K subscriber free tier" but the free tier's automation limits make the full phase impossible without either upgrading or using the API directly (which cannot bypass UI limits for sequences).

**Planner decision needed:** Confirm budget for Kit Creator plan OR redesign to fit within 1 sequence + 1 automation. The redesign path is complex: a single sequence could deliver all 5 lead-magnet emails (Day 0-9), and buyer tagging could be done purely via API without a Kit automation, but then the buyer segment cannot have a separate post-purchase sequence on the free tier.

---

## Standard Stack

### Core Services (No npm installs — all SaaS/API)

| Service | Version/Plan | Purpose | Why Standard |
|---------|-------------|---------|--------------|
| Kit (ConvertKit) | Free (1 seq) or Creator ($33/mo) | Email capture, sequences, automations, tagging | Prior decision; 10K free tier |
| Lemon Squeezy | Existing store | Purchase webhooks, product delivery | Prior decision; merchant of record |
| Netlify Functions | Free tier (125K invocations/mo) | Webhook receiver for LS → Kit buyer tagging | GitHub Pages cannot serve server-side code |

### Supporting (Webhook Receiver Alternatives)

| Option | Free Tier | Complexity | Notes |
|--------|-----------|------------|-------|
| **Netlify Functions** | 125,000 invocations/month | Low | Standalone site; just a function file in `/netlify/functions/`; no existing site needed |
| **Cloudflare Workers** | 100,000 req/day | Low | Slightly more setup; excellent for high-volume |
| **Zapier** | 100 tasks/month | Very low (no-code) | Pre-built LS→Kit zap templates exist; 100 tasks likely sufficient at launch volume |
| **Make (Integromat)** | 1,000 operations/month | Low (no-code) | More generous free tier than Zapier; supports webhooks on free plan |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Netlify Functions | Vercel Edge Functions | Vercel requires a Next.js/framework project; Netlify works standalone |
| Custom webhook receiver | LS native ConvertKit integration | Native integration only adds to a form; cannot tag buyers or distinguish products |
| Kit Creator plan | Free plan + API-only | API can add to sequences but UI limits still apply; branding on forms; no automation rules |

### Installation

No npm packages required at the project level. The Netlify Function uses Node.js built-ins (`node:crypto`) only. If using a separate Netlify repo, no additional dependencies needed.

---

## Architecture Patterns

### Recommended Project Structure

```
netlify/
└── functions/
    └── ls-webhook.js     # Lemon Squeezy → Kit buyer tag handler

# Environment variables needed:
# LEMONSQUEEZY_WEBHOOK_SECRET  (from LS dashboard webhook settings)
# KIT_API_SECRET               (from Kit Developer Settings)
# KIT_TAG_ID_PURCHASED_STARTER (tag ID from Kit)
# KIT_TAG_ID_PURCHASED_FULL_KIT (tag ID from Kit)
# LS_PRODUCT_ID_STARTER        (from Lemon Squeezy product ID)
# LS_PRODUCT_ID_FULL_KIT       (from Lemon Squeezy product ID)
```

### Pattern 1: Kit Opt-In Flow (Form → Sequence)

**What:** Landing page embeds Kit form via JavaScript. On submit, Kit fires the connected visual automation, which adds the subscriber to the lead-magnet-delivery sequence. The first sequence email (Day 0) fires within ~1 minute.

**When to use:** This is the primary lead capture path.

**Kit form JS embed pattern (from Kit form builder → Embed button):**
```html
<!-- Inline embed — paste in landing page HTML -->
<script src="https://f.convertkit.com/ckjs/ck.5.js"></script>
<form action="https://app.convertkit.com/forms/{FORM_ID}/subscriptions"
      method="post"
      data-sv-form="{FORM_ID}"
      data-uid="{UID}"
      data-options='{"settings":{"after_subscribe":{"action":"redirect","success_redirect_url":""}}}'
      data-format="inline">
  <input name="email_address" type="email" placeholder="Your email" required />
  <input name="fields[first_name]" type="text" placeholder="First name" />
  <button type="submit">Get the Free Guide</button>
</form>
```

**Alternative: plain HTML form (no JS, works on static sites):**
```html
<!-- Source: https://sayzlim.net/plain-html-form-convertkit/ -->
<form action="https://app.convertkit.com/forms/{FORM_ID}/subscriptions" method="post">
  <input name="email_address" type="email" required />
  <input name="fields[first_name]" type="text" />
  <button type="submit">Subscribe</button>
</form>
```

The plain HTML form submits to Kit's form endpoint directly. No JavaScript required. This is appropriate for the GitHub Pages landing page.

### Pattern 2: Lemon Squeezy Webhook → Buyer Tag

**What:** LS fires `order_created` on every completed purchase. A Netlify Function receives it, verifies the HMAC-SHA256 signature, extracts the buyer's email and product_id, then calls the Kit API to apply the correct buyer tag.

**When to use:** Every purchase event — this is the reliable path that works even when the buyer's browser does not complete the Stripe/LS redirect.

**Netlify Function handler pattern:**
```javascript
// netlify/functions/ls-webhook.js
// Source: https://docs.lemonsqueezy.com/guides/tutorials/webhooks-nextjs (adapted)
const crypto = require("node:crypto");

exports.handler = async function(event) {
  // 1. Verify signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const rawBody = event.body;
  const signature = Buffer.from(
    event.headers["x-signature"] ?? "", "hex"
  );
  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"), "hex"
  );

  if (!crypto.timingSafeEqual(hmac, signature)) {
    return { statusCode: 401, body: "Invalid signature" };
  }

  // 2. Parse event
  const data = JSON.parse(rawBody);
  const eventName = data.meta.event_name;

  if (eventName !== "order_created") {
    return { statusCode: 200, body: "Ignored" };
  }

  // 3. Identify buyer and product
  const attributes = data.data.attributes;
  const buyerEmail = attributes.user_email;
  const productId = attributes.first_order_item.product_id;

  // 4. Map product to Kit tag
  const tagMap = {
    [process.env.LS_PRODUCT_ID_STARTER]: process.env.KIT_TAG_ID_PURCHASED_STARTER,
    [process.env.LS_PRODUCT_ID_FULL_KIT]: process.env.KIT_TAG_ID_PURCHASED_FULL_KIT,
  };
  const kitTagId = tagMap[String(productId)];

  if (!kitTagId) {
    return { statusCode: 200, body: "Unknown product" };
  }

  // 5. Tag buyer in Kit
  const kitRes = await fetch(
    `https://api.convertkit.com/v3/tags/${kitTagId}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_secret: process.env.KIT_API_SECRET,
        email: buyerEmail,
      }),
    }
  );

  if (!kitRes.ok) {
    return { statusCode: 500, body: "Kit API error" };
  }

  return { statusCode: 200, body: "OK" };
};
```

### Pattern 3: Kit Sequence Configuration

**What:** Sequences are chains of emails with relative delays. Day 0 = send immediately. Day 2 = 2 days after previous. Day 4 = 2 days after previous (4 total). Day 6 = 2 days after previous (6 total). Day 9 = 3 days after previous (9 total).

**Configuration in Kit UI (Sequences editor):**
```
Email 1: Day 0  → Send: immediately (0 days after subscription)
Email 2: Day 2  → Send: 2 days after Email 1
Email 3: Day 4  → Send: 2 days after Email 2
Email 4: Day 6  → Send: 2 days after Email 3
Email 5: Day 9  → Send: 3 days after Email 4
```

Note: "0 days" for the first email sends immediately upon subscription. Only the first email can use "0 days/hours."

### Pattern 4: Sequence vs Tag Subscribe API

**Adding subscriber to a sequence (requires `api_key`):**
```shell
# Source: https://developers.kit.com/api-reference/v3/sequences
curl -X POST https://api.convertkit.com/v3/sequences/{sequence_id}/subscribe \
     -H "Content-Type: application/json" \
     -d '{"api_key": "<your_public_api_key>", "email": "buyer@example.com"}'
```

**Adding tag to a subscriber (requires `api_secret`):**
```shell
# Source: https://developers.kit.com/api-reference/v3/tags
curl -X POST https://api.convertkit.com/v3/tags/{tag_id}/subscribe \
     -H "Content-Type: application/json" \
     -d '{"api_secret": "<your_secret_api_key>", "email": "buyer@example.com"}'
```

Note: tag operations require `api_secret` (not the public `api_key`). Both are found in Kit Developer Settings.

### Anti-Patterns to Avoid

- **Using the LS native ConvertKit integration for buyer tagging:** It only subscribes buyers to a form, does not distinguish products, and cannot apply tags. It is appropriate only as a fallback form subscription, not for segmentation.
- **Relying on browser redirect to capture purchase:** Lemon Squeezy's `order_created` webhook fires server-side. Do not use client-side redirect params as the primary purchase signal.
- **Embedding raw HTML Kit form without the form ID:** Kit needs the form subscription to trigger automations. Using only a direct API call to the sequence endpoint bypasses the automation trigger.
- **Not verifying webhook signatures:** Process LS webhooks without signature verification in production is a security risk. Always `timingSafeEqual` compare.
- **Hardcoding Kit/LS IDs in function code:** Use environment variables. Netlify supports env vars in the dashboard and in `netlify.toml`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery & scheduling | Custom SMTP timing logic | Kit sequences with day delays | Edge cases: timezones, re-subscription, unsubscribe handling |
| Webhook signature verification | Custom hash comparison | `crypto.timingSafeEqual` (built-in Node.js) | Timing attacks; always use constant-time comparison |
| Buyer-to-Kit sync (no-code path) | Custom API integration | Zapier pre-built LS→Kit tag template | Pre-built Zapier template "Add tags to Kit subscribers for new Lemon Squeezy orders" exists |
| Lemon Squeezy order file delivery | Custom email with PDF | LS receipt email (auto) | LS already sends receipt with download links — PAY-03/PAY-05 already satisfied |

**Key insight:** The hardest part of this phase is the automation limit on Kit's free plan, not the technical implementation. The webhook receiver itself is ~30 lines of code. The decision about Kit plan upgrade dominates the architecture.

---

## Common Pitfalls

### Pitfall 1: Kit Free Plan Blocks Multiple Sequences

**What goes wrong:** User sets up Kit on free plan expecting to create 3 sequences (lead-magnet-delivery, post-purchase-starter, post-purchase-full-kit). Kit UI allows creation of only 1 sequence. Subsequent sequences cannot be activated or are blocked.

**Why it happens:** The free Newsletter plan hard-limits to 1 sequence and 1 basic visual automation. This changed when ConvertKit rebranded to Kit and introduced the Newsletter plan in 2024.

**How to avoid:** Confirm plan before building. Either upgrade to Creator ($33/mo) or consolidate into a single sequence with tag-based filtering if technically feasible.

**Warning signs:** Kit UI shows "Upgrade to unlock sequences" or grays out sequence creation after the first one.

### Pitfall 2: LS Native ConvertKit Integration Insufficient

**What goes wrong:** Developer enables the LS native ConvertKit integration (Settings > Integrations > ConvertKit), selects a form, and expects buyers to be tagged. Buyers get added to the form subscriber list, but no buyer tag is applied and no product distinction is made.

**Why it happens:** The native integration is documented as only syncing email + first name to a selected form. It has no tagging, no sequence assignment, and no product differentiation.

**How to avoid:** Do not use the native LS integration for buyer tagging. Use webhook → serverless function → Kit tag API instead.

**Warning signs:** Buyers appear in Kit as form subscribers with no tags applied.

### Pitfall 3: Webhook Endpoint Not Reachable (GitHub Pages)

**What goes wrong:** Developer tries to create a webhook endpoint file in the GitHub Pages repo expecting it to receive POST requests. GitHub Pages serves only static files — there is no server-side execution. POST requests return 405 or are ignored.

**Why it happens:** GitHub Pages is a static host by design. It serves HTML, CSS, JS, and other static assets but has no runtime for executing functions.

**How to avoid:** Use a separate serverless host (Netlify Functions at minimum). The webhook function does not need to be on the same domain as the landing page.

**Warning signs:** LS webhook deliveries fail with 405 Method Not Allowed or 404.

### Pitfall 4: Webhook Raw Body vs Parsed Body

**What goes wrong:** Developer parses the webhook body as JSON before signature verification. The HMAC signature is computed over the raw request body string, not the parsed/serialized JSON. Re-serializing parsed JSON can produce a different byte sequence.

**Why it happens:** Common pattern of `JSON.parse(event.body)` before any processing corrupts the input for signature verification if re-serialized.

**How to avoid:** Compute HMAC over `event.body` (the raw string) first. Parse JSON only after signature is verified.

**Warning signs:** `crypto.timingSafeEqual` returns false for valid requests.

### Pitfall 5: Sequence "Not Sending" Despite Configuration

**What goes wrong:** Subscriber is added to a sequence but no emails arrive. Kit shows subscriber is enrolled but emails are in "Inactive" state.

**Why it happens:** Each sequence email must be individually **Published** (not just saved as draft). The sequence itself must also be **Activated**. Both are required; it's a two-step publish requirement.

**How to avoid:** In the Kit sequence editor: (a) click Publish on each individual email, then (b) click Activate on the overall sequence.

**Warning signs:** Kit shows sequence "inactive" badge; emails are in Draft state.

### Pitfall 6: Tag Subscribe vs Form Subscribe — Automation Trigger Difference

**What goes wrong:** Developer adds buyer to a sequence directly via API (`POST /v3/sequences/{id}/subscribe`) but the buyer does not exit the sequence when it completes, and new emails added later unexpectedly reach the buyer.

**Why it happens:** Subscribers added to sequences via automation rules or direct API are not automatically removed when they complete the sequence — they remain enrolled as "active." Visual automation enrollment handles the exit automatically.

**How to avoid:** For buyers who should not receive future nurture emails added to the lead sequence, use tag-based segmentation to filter buyers out of the lead sequence, or enroll them in a separate post-purchase sequence that replaces the lead sequence.

---

## Code Examples

### Verified Patterns from Official Sources

#### Kit: Subscribe to Sequence (API v3)
```shell
# Source: https://developers.kit.com/api-reference/v3/sequences
curl -X POST https://api.convertkit.com/v3/sequences/{SEQUENCE_ID}/subscribe \
     -H "Content-Type: application/json; charset=utf-8" \
     -d '{
           "api_key": "<your_public_api_key>",
           "email": "subscriber@example.com",
           "first_name": "Jane"
         }'
# Response: {"subscription": {"id": 2, "state": "inactive", "subscribable_type": "course", ...}}
```

#### Kit: Tag a Subscriber (API v3)
```shell
# Source: https://developers.kit.com/api-reference/v3/tags
curl -X POST https://api.convertkit.com/v3/tags/{TAG_ID}/subscribe \
     -H "Content-Type: application/json; charset=utf-8" \
     -d '{
           "api_secret": "<your_secret_api_key>",
           "email": "buyer@example.com"
         }'
# Response: {"subscription": {"id": 3, "state": "active", ...}}
```

#### Kit: List All Tags (to find tag IDs)
```shell
# Source: https://developers.kit.com/api-reference/v3/tags
curl -X GET "https://api.convertkit.com/v3/tags?api_key=<your_public_api_key>"
# Response: {"tags": [{"id": 123, "name": "purchased-starter", "created_at": "..."}, ...]}
```

#### Lemon Squeezy: Webhook Signature Verification (Node.js)
```javascript
// Source: https://docs.lemonsqueezy.com/guides/tutorials/webhooks-nextjs
const crypto = require("node:crypto");

function verifySignature(rawBody, signatureHeader, secret) {
  const signature = Buffer.from(signatureHeader ?? "", "hex");
  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "hex"
  );
  return crypto.timingSafeEqual(hmac, signature);
}
```

#### Lemon Squeezy: order_created Payload Structure
```javascript
// Source: https://docs.lemonsqueezy.com/help/webhooks/example-payloads
// Key fields for buyer identification:
{
  "meta": { "event_name": "order_created" },
  "data": {
    "attributes": {
      "user_email": "buyer@example.com",   // buyer email
      "user_name": "Jane Doe",             // buyer name
      "status": "paid",                    // order status
      "first_order_item": {
        "product_id": 12345,               // LS product ID — use to route tags
        "variant_id": 67890,               // LS variant ID
        "product_name": "ContentKit Starter",
        "variant_name": "Default"
      }
    }
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ConvertKit (full name) | Kit (rebranded) | 2024 | API endpoints still use `api.convertkit.com`; documentation at `developers.kit.com` |
| ConvertKit free plan (unlimited automations, 1K subscribers) | Kit Newsletter plan (1 sequence, 1 automation, 10K subscribers) | 2024 | Major change: free plan now allows more subscribers but restricts automations |
| Direct sequence subscribe to trigger emails | Visual automation triggered by form/tag | ~2022+ | Visual automations provide cleaner exit handling and conditional logic |
| Stripe for payments | Lemon Squeezy (prior decision) | — | LS is merchant of record; handles VAT; receipt with download links auto-sent |

**Deprecated/outdated:**
- ConvertKit "Courses" API parameter: The API previously used `courses` terminology; now called `sequences`. Official docs still use `courses` in the type field (`"subscribable_type": "course"`) but the endpoint is `/v3/sequences/`.
- API v4: Kit has a v4 API in development/limited access. Stick with v3 for this phase — v3 is stable, well-documented, and sufficient for all required operations.

---

## Open Questions

1. **Kit free plan: are Automation Rules available?**
   - What we know: The pricing page lists Rules as a paid-plan feature. One source says "free plan lacks integrations." Another source says Rules are "not confirmed available" on free.
   - What's unclear: Whether the Kit Automation Rules feature (simple if/then, not visual automations) is available on the free Newsletter plan.
   - Recommendation: Assume Rules require paid plan. Test in Kit dashboard after account creation. If Rules are available free, they could handle the buyer tag → sequence assignment without the visual automation counting against the limit.

2. **Single automation: can the 1 automation handle both opt-in AND buyer paths?**
   - What we know: Free plan allows 1 basic visual automation. Visual automations can have multiple entry points (form opt-in OR tag added).
   - What's unclear: Whether a single automation with branching (tag = purchased → different sequence branch) would satisfy both lead nurture and buyer post-purchase paths within the free tier's "1 automation" limit.
   - Recommendation: Architect toward paying for Kit Creator. The $33/mo cost is reasonable given the business generates $27-$47 per sale. Two sales cover the monthly cost.

3. **Netlify account creation — credit-based pricing change**
   - What we know: Netlify moved to credit-based pricing for new accounts created after September 4, 2025.
   - What's unclear: What the credit-based free tier allows for function invocations. Legacy accounts had 125K invocations/month free.
   - Recommendation: Verify current Netlify free tier at signup. Cloudflare Workers (100K req/day free, no credit card) is the fallback if Netlify's new pricing is restrictive.

4. **Lemon Squeezy product IDs for Starter and Full Kit**
   - What we know: Checkout URLs are known. Product IDs are embedded in the LS dashboard.
   - What's unclear: The numeric product_id values (needed for the webhook router).
   - Recommendation: Record these IDs from the LS dashboard during implementation as environment variables. They appear in `first_order_item.product_id` in the webhook payload.

---

## Sources

### Primary (HIGH confidence)
- `https://developers.kit.com/api-reference/v3/sequences` — Sequences API: subscribe endpoint, parameters, response format
- `https://developers.kit.com/api-reference/v3/tags` — Tags API: create tag, subscribe tag, list tags; confirmed `api_secret` required for tag subscribe
- `https://developers.kit.com/api-reference/v3/forms` — Forms API: subscribe endpoint parameters
- `https://kit.com/pricing` — Confirmed: free plan = 1 sequence + 1 basic automation; Creator plan = unlimited
- `https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan` — Official: "1 basic visual automation with 1 email sequence"
- `https://help.kit.com/en/articles/2502629-creating-and-sending-a-sequence-in-kit` — Sequence delays, Day 0 sends immediately, publish + activate required
- `https://docs.lemonsqueezy.com/help/integrations/convertkit` — Native LS-ConvertKit integration: adds to form only, no tagging, no sequences
- `https://docs.lemonsqueezy.com/help/webhooks/event-types` — order_created is the correct event for one-time purchases
- `https://docs.lemonsqueezy.com/help/webhooks/example-payloads` — Payload: `user_email`, `first_order_item.product_id`
- `https://docs.lemonsqueezy.com/guides/tutorials/webhooks-nextjs` — HMAC-SHA256 signature verification pattern in Node.js

### Secondary (MEDIUM confidence)
- `https://help.kit.com/en/articles/2502537-visual-automations-actions` — 6 action types including email sequence and add/remove tag
- `https://help.kit.com/en/articles/4009572-form-embedding-basics` — JavaScript embed recommended over raw HTML; changes to form reflected automatically
- `https://sayzlim.net/plain-html-form-convertkit/` — Plain HTML form: action URL format, required fields
- `https://zapier.com/apps/kit/integrations/lemon-squeezy/1220941/add-tags-to-kit-subscribers-for-new-lemon-squeezy-orders` — Pre-built Zapier template for LS → Kit tag (verified by Zapier search results)
- `https://www.netlify.com/pricing/` — Netlify free tier: 125K function invocations/month (legacy accounts; verify for new)
- `https://developers.cloudflare.com/workers/platform/pricing/` — Cloudflare Workers free: 100K requests/day

### Tertiary (LOW confidence — needs validation)
- Multiple third-party Kit reviews (2025) confirming 1 seq / 1 automation on free plan — consistent across 6+ sources, HIGH confidence by aggregation
- Whether Kit Automation Rules are available on the free plan — conflicting signals, not definitively confirmed by official docs

---

## Metadata

**Confidence breakdown:**
- Kit API patterns (subscribe sequence, tag): HIGH — verified against official API docs at developers.kit.com
- Kit free plan limits (1 seq, 1 automation): HIGH — confirmed on official pricing page + help article
- LS webhook payload structure and signature verification: HIGH — confirmed against official LS docs
- Netlify Functions as webhook host: MEDIUM — confirmed as capable; free tier limits need verification for new accounts
- Whether Automation Rules work free: LOW — not definitively confirmed from official source

**Research date:** 2026-02-26
**Valid until:** 2026-03-28 (Kit pricing and plan features can change; re-verify before implementation)
