# Architecture Research

**Domain:** ContentKit AI — v1.1 Growth & Revenue: Email automations, advanced segmentation, paid ad tracking
**Researched:** 2026-02-28
**Confidence:** HIGH (Kit automation capabilities verified against official Kit help center; Stripe metadata/redirect behavior verified against official Stripe docs; ad tracking patterns verified against Google and Meta official documentation)

---

## What This Document Covers

This is a **milestone-scoped architecture update** for v1.1. The existing architecture (static HTML + GitHub Pages + Kit + Stripe Payment Links + Netlify webhook) is established. This document maps:

1. How new email automation features (post-purchase onboarding, win-back) integrate with the existing Kit + Stripe webhook
2. What advanced segmentation looks like in Kit's data model
3. The end-to-end data flow for ad conversion tracking from click to optimization signal
4. What is new vs. what is modified vs. what is unchanged
5. Build order with explicit dependency chain

---

## Existing Architecture (Established — Do Not Rebuild)

```
┌──────────────────────────────────────────────────────────────┐
│                    VISITOR ENTRY (organic)                    │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              STATIC HTML LAYER (GitHub Pages CDN)             │
│                                                               │
│  index.html      thank-you.html     blog/index.html          │
│  privacy.html    terms.html         5 blog posts              │
│  refund.html                                                  │
└──────────┬─────────────────┬────────────────────────────────┘
           │                 │
           ▼                 ▼
┌─────────────────┐  ┌──────────────────────────────────────┐
│  KIT (email)    │  │         STRIPE PAYMENT LINKS          │
│                 │  │                                        │
│  - Opt-in form  │  │  buy.stripe.com/... (Starter $147)    │
│  - Lead magnet  │  │  buy.stripe.com/... (Full Kit $499)   │
│    auto-delivery│  │                                        │
│  - 5-email      │  │  → redirects to thank-you.html        │
│    nurture seq  │  └───────────────┬──────────────────────┘
│  - Buyer tags   │                  │ checkout.session.completed
└─────────────────┘                  ▼
                          ┌──────────────────────────────┐
                          │   NETLIFY FUNCTION (webhook)  │
                          │   ls-webhook.js               │
                          │                               │
                          │   Stripe sig verify →         │
                          │   amount → tag ID map →       │
                          │   Kit API: tag subscriber     │
                          └──────────────────────────────┘
```

**Current Kit tag state after a purchase:**
- `purchased-starter` OR `purchased-full-kit` (product tag, set by webhook)
- `buyer` (generic buyer tag, set by webhook)
- Both tags trigger zero automations today — this is the gap v1.1 fills.

---

## v1.1 New System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                    PAID AD ENTRY (new traffic source)                 │
│   Google Ads / Meta Ads → UTM-tagged URLs → dedicated landing pages   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│              STATIC HTML LAYER — NEW FILES ADDED                      │
│                                                                       │
│  lp-google.html      lp-meta.html      (ad landing pages — new)      │
│  index.html          thank-you.html    (existing, modified)           │
└──────────┬──────────────────────┬─────────────────────────────────── ┘
           │                      │
           ▼                      ▼
┌─────────────────┐     ┌──────────────────────────────────────────┐
│  KIT (email)    │     │         STRIPE PAYMENT LINKS              │
│                 │     │  (unchanged — same two links)             │
│  EXISTING:      │     └─────────────────┬────────────────────────┘
│  - Opt-in form  │                       │ checkout.session.completed
│  - Lead magnet  │                       ▼
│  - 5-email seq  │     ┌──────────────────────────────────────────┐
│  - Buyer tags   │     │  NETLIFY FUNCTION (webhook) — MODIFIED   │
│                 │     │                                           │
│  NEW IN v1.1:   │     │  + Pass purchase_value custom field      │
│  - Onboarding   │     │  + Pass product_tier custom field        │
│    automation   │◄────┤  + Call Meta CAPI Purchase event (new)   │
│    (tag trigger)│     └──────────────────────────────────────────┘
│  - Win-back     │
│    automation   │◄────── [cold subscriber segment — manual tag]
│    (tag trigger)│
│  - Segments:    │
│    buyers /     │
│    starters /   │
│    full-kit /   │
│    leads-only   │
└─────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                  AD CONVERSION TRACKING (new)                         │
│                                                                       │
│  Click → UTM params → landing page → Stripe → thank-you.html         │
│                                           │                           │
│                          ┌────────────────┼─────────────────┐        │
│                          ▼                ▼                  ▼        │
│                    Google Ads       Meta Pixel          Plausible     │
│                    gtag Purchase    fbq Purchase         Purchase     │
│                    (real IDs)       (real IDs)           (existing)   │
│                          │                │                           │
│                          ▼                ▼                           │
│                    Google Ads        Meta CAPI                        │
│                    Conversion        (Netlify fn)                     │
│                    API (future)      server-side dedup                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### Existing Components (Unchanged Unless Noted)

| Component | Responsibility | Status |
|-----------|----------------|--------|
| `index.html` | Lead magnet opt-in, sales CTAs | Modified: real ad tracking IDs injected |
| `thank-you.html` | Purchase confirmation, download | Modified: real ad tracking IDs + tier param handling |
| `webhook/netlify/functions/ls-webhook.js` | Stripe → Kit tagging | Modified: add custom fields, add Meta CAPI call |
| Kit lead magnet automation | Deliver free guide, start nurture | Unchanged |
| Kit 5-email nurture sequence | Warm leads toward purchase | Unchanged |
| Stripe Payment Links (x2) | Hosted checkout | Unchanged |
| Plausible Analytics | Privacy-friendly page analytics | Unchanged |

### New Components

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `lp-google.html` | Google Ads-specific landing page (message-matched to ad copy) | New static HTML file |
| `lp-meta.html` | Meta Ads-specific landing page (message-matched to ad creative) | New static HTML file |
| Kit Onboarding Visual Automation | Send 3–5 post-purchase emails triggered by `buyer` tag | New Kit visual automation |
| Kit Win-Back Visual Automation | Re-engage cold subscribers (no open in 90 days) via tag trigger | New Kit visual automation |
| Kit segments (4 segments) | Group subscribers by purchase tier for targeted broadcasts | New Kit segments |
| Google Ads account + conversion action | Real campaign structure with verified conversion ID | External setup (no code) |
| Meta Business Manager + Pixel ID | Real pixel with Purchase event | External setup; real ID replaces placeholder |
| Meta CAPI call in webhook | Server-side Purchase event to Meta, with deduplication event_id | Netlify function modification |

---

## Kit Automation Architecture

### How Kit Tag-Triggered Automations Work

Kit supports two mechanisms for triggering automations from a tag addition. Both are verified against Kit's official help documentation (HIGH confidence):

**Visual Automations** — A flow-chart builder. Entry point options include: form subscription, tag added, or product purchase (Kit's native commerce). For this project, the correct entry point is **"tag added"** — specifically when the `buyer` tag is added by the Netlify webhook.

**Automation Rules** — Simpler if/then rules. Trigger: "Tag added: buyer" → Action: "Subscribe to sequence: Post-Purchase Onboarding."

Both work. Use **Visual Automations** for the onboarding sequence (allows delays, conditionals, multiple emails) and **Automation Rules** for the win-back trigger (simpler: tag cold → add to re-engagement sequence).

### Post-Purchase Onboarding Automation

```
ENTRY: Tag added = "buyer"
    │
    ▼
[Email 1 - Day 0] Welcome + how to use the kit
    │
    ▼
[Wait: 2 days]
    │
    ▼
[Email 2 - Day 2] Quick win tutorial (first prompt, first result)
    │
    ▼
[Wait: 3 days]
    │
    ▼
[Email 3 - Day 5] Advanced tips + full kit upsell (for starter buyers only)
    │  ← Condition: tag = "purchased-starter"? Show upsell to Full Kit
    │  ← Condition: tag = "purchased-full-kit"? Show "you have the best" message
    ▼
[Wait: 7 days]
    │
    ▼
[Email 4 - Day 12] Case study / results email + ask for testimonial
    │
    ▼
[Exit automation]
```

**Implementation path (verified HIGH confidence):**
1. In Kit → Automations → "New Automation" → Entry: "Subscriber is tagged" → select tag: `buyer`
2. Add Sequence action: attach the onboarding sequence
3. Within the sequence, add conditional logic using Kit's "Event" nodes (check for `purchased-starter` tag)
4. Set automation to Active

**Critical constraint:** Kit visual automations trigger once per subscriber per automation. If a subscriber already completed the automation and purchases again, they will not re-enter unless manually re-added. For this product (one-time purchase), this is not a concern.

### Win-Back (Cold Subscriber Re-engagement) Automation

```
TRIGGER: Tag added = "cold-subscriber"
    │   (tag added manually by you via bulk action on Subscribers page,
    │    or via scheduled Automation Rule if Kit plan supports it)
    ▼
[Email 1] "Still there? Here's something new..."
    │
    ▼
[Wait: 4 days]
    │
    ▼
[Email 2] "Last chance to stay on the list"
    │  Subscriber clicks link trigger → Remove "cold-subscriber" tag, continue on list
    │  Subscriber does NOT click → unsubscribe after this email
    ▼
[Conditional]
  → Clicked: Add tag "reactivated", exit automation
  → Did not click: Action = Unsubscribe
```

**Kit's built-in template:** Kit provides an "Ad Hoc List Cleaning" visual automation template that implements this exact pattern. Use it as the starting point.

**How to identify cold subscribers:** Kit Subscribers page → filter by subscriber status "Cold" (no open or click in 90 days) → select all → bulk action: "Add tag: cold-subscriber" → automation triggers.

**Limitation (LOW confidence gap):** Kit's definition of "cold" is fixed at 90 days and is not configurable via the UI. Verified from Kit help docs but could change — verify in Kit dashboard before building.

### Segmentation Data Model

Kit's tag vs. segment distinction matters for this implementation:

| Concept | What It Is | Can Trigger Automation? | Can Target Broadcast? |
|---------|-----------|------------------------|-----------------------|
| Tag | Persistent label on subscriber | YES (visual automations, automation rules) | YES |
| Segment | Dynamic filter query (recalculates membership) | NO | YES |
| Custom Field | Per-subscriber scalar value | NO (directly) | YES (filter by value) |

**Recommended tag taxonomy for v1.1:**

```
lead               — opted in for free guide, not yet purchased
buyer              — completed any Stripe purchase (set by webhook)
purchased-starter  — bought Starter Kit $147 (set by webhook)
purchased-full-kit — bought Full Kit $499 (set by webhook)
cold-subscriber    — added manually when re-engagement campaign runs
reactivated        — clicked re-engagement email (removed from cold)
```

**Recommended custom fields for v1.1:**

```
purchase_value   — numeric ($147 or $499), set by webhook, enables revenue segmentation
product_tier     — string ("starter" or "full-kit"), set by webhook, enables tier-specific emails
utm_source       — string (already captured on opt-in form via hidden field)
utm_campaign     — string (already captured on opt-in form via hidden field)
```

**Recommended segments (built in Kit after tags/fields exist):**

| Segment Name | Filter Logic | Use Case |
|---|---|---|
| Buyers - All | tag = buyer | Broadcast to all customers |
| Buyers - Starter | tag = purchased-starter | Upsell to Full Kit |
| Buyers - Full Kit | tag = purchased-full-kit | Announce updates, VIP broadcasts |
| Leads Only | NOT tag = buyer | Marketing broadcasts, sales content |
| Cold Subscribers | tag = cold-subscriber | Win-back campaign monitoring |

---

## Ad Conversion Tracking Data Flow

### The Challenge: Cross-Domain Tracking Gap

The fundamental issue for static HTML + Stripe Payment Links: when a user clicks "Buy" they leave your domain (`getcontentkit.com`) for Stripe's domain (`buy.stripe.com`). Cookies set on your domain are not shared. When Stripe redirects back to `thank-you.html`, the browser session looks like a fresh page view from Stripe's referrer — ad click attribution can be lost.

**How the current architecture already handles this (partially):**
- The `?tier=starter` or `?tier=full` URL parameter is appended manually to both Stripe Payment Link URLs (as the existing redirect URL in the Stripe dashboard)
- `thank-you.html` reads this parameter and fires `gtag('event', 'conversion', ...)` and `fbq('track', 'Purchase', ...)`
- This works for last-click attribution in the same browser session, but fails when ITP/iOS blocks cookies or when the browser session ends

**Why this is acceptable for v1.1 (not a blocker):** For small-scale paid campaigns starting out, the basic Pixel + gtag on the thank-you page recovers the majority of conversions. Server-side CAPI is an upgrade that provides 15–30% lift in attributed conversions. Add it in v1.1 via the existing Netlify webhook infrastructure.

### End-to-End Data Flow: Google Ads

```
[1] User clicks Google Ad
      ↓
      Google Ads appends gclid parameter to destination URL
      → lp-google.html?utm_source=google&utm_medium=cpc&utm_campaign=...&gclid=...

[2] User lands on lp-google.html
      ↓
      gtag('config', 'AW-REAL_ID') loads — reads gclid from URL, stores in _gcl_aw cookie
      Page fires: gtag('event', 'page_view')
      If user submits email form: gtag('event', 'generate_lead', ...)

[3] User clicks "Buy" → redirects to Stripe (buy.stripe.com/...)
      ↓
      *** Cookie/session gap here — gclid is stored in browser cookie, not passed to Stripe ***

[4] Stripe processes payment → redirects to thank-you.html?tier=full
      ↓
      thank-you.html loads — gtag fires:
        gtag('event', 'conversion', {
          send_to: 'AW-REAL_CONVERSION_ID/REAL_LABEL',
          value: 499,
          currency: 'USD',
          transaction_id: ''  ← leave empty (Stripe session not available client-side)
        })
      ↓
      Google Ads conversion action is credited if _gcl_aw cookie still present in browser
      (Works for most desktop users; fails for iOS with ITP and privacy browsers)

[5] Optimization signal reaches Google Ads campaign
      ↓
      Smart Bidding uses conversion data to optimize bids toward converting users
      (Requires 30+ conversions/month for Smart Bidding to function effectively)
```

**What to configure in Google Ads (setup, not code):**
- Create a Conversion Action: category = "Purchase", value = use different values per click (not static)
- Get the Conversion ID (AW-XXXXXXXX) and Conversion Label
- Replace `AW-XXXXXXXXXX` and `CONVERSION_LABEL` placeholders in `index.html`, `thank-you.html`, and new landing pages

### End-to-End Data Flow: Meta Ads

```
[1] User clicks Meta Ad
      ↓
      Meta appends fbclid parameter to destination URL
      → lp-meta.html?utm_source=meta&utm_medium=paid_social&fbclid=...

[2] User lands on lp-meta.html
      ↓
      fbq('init', 'REAL_PIXEL_ID') loads — reads fbclid, stores in _fbc cookie
      fbq('track', 'PageView') fires automatically
      If user submits email form: fbq('track', 'Lead', ...)

[3] User clicks "Buy" → Stripe → redirects to thank-you.html?tier=full
      ↓
      thank-you.html fires BROWSER-SIDE event:
        fbq('track', 'Purchase', {
          value: 499,
          currency: 'USD',
          content_name: 'Full Kit',
          content_ids: ['full'],
          content_type: 'product',
          event_id: 'purchase_[timestamp]'  ← add for deduplication with CAPI
        })

[4] SIMULTANEOUSLY — Netlify webhook fires SERVER-SIDE:
      Stripe checkout.session.completed →
        ls-webhook.js receives event →
        tags subscriber in Kit (existing) →
        NEW: calls Meta CAPI endpoint:
          POST https://graph.facebook.com/v21.0/{PIXEL_ID}/events
          {
            event_name: "Purchase",
            event_time: [unix timestamp from Stripe event],
            event_id: "purchase_[stripe_session_id]",  ← matches browser event_id for dedup
            user_data: {
              em: SHA256(buyer_email),   ← hashed, from checkout session
            },
            custom_data: {
              value: 499,
              currency: "USD"
            },
            action_source: "website"
          }

[5] Meta deduplicates browser Pixel event + CAPI event using event_id
      ↓
      Attribution credited even if browser Pixel was blocked
      ↓
      Meta Ads optimization signal improves ad delivery targeting
```

**CAPI deduplication requirement (HIGH confidence, Meta official docs):** When sending both browser Pixel and CAPI for the same event, you MUST pass a matching `event_id` in both calls. Without this, Meta double-counts conversions. The event_id format should be consistent and unique per purchase — using the Stripe session ID is ideal.

**Meta CAPI access token:** Generated in Meta Business Manager → Events Manager → your Pixel → Settings → "Generate access token." Store as `META_CAPI_ACCESS_TOKEN` in Netlify environment variables alongside existing `STRIPE_WEBHOOK_SECRET`, `KIT_API_SECRET`, `KIT_TAG_ID_*` variables.

### Webhook Modification: What ls-webhook.js Gets

The existing webhook must be extended (not replaced) to add:

```
EXISTING FLOW (keep):
  Verify Stripe signature
  Parse checkout.session.completed
  Extract buyer email + amount_total
  Map amount → Kit tag ID
  POST Kit API: tag subscriber (product tag)
  POST Kit API: tag subscriber (buyer tag)

NEW ADDITIONS:
  After buyer email extracted:
    → Set Kit custom field: product_tier = "starter" or "full-kit"
    → Set Kit custom field: purchase_value = "147" or "499"

  After Kit tagging succeeds:
    → POST Meta CAPI: Purchase event with hashed email + value
      (only if META_CAPI_ACCESS_TOKEN env var is present — soft-fail gracefully if missing)
```

**Kit custom field API call (v3 endpoint — what the existing webhook uses):**
```
POST https://api.convertkit.com/v3/subscribers/{subscriber_id}
  { api_secret: "...", fields: { product_tier: "full-kit", purchase_value: "499" } }
```
Note: The v3 endpoint requires a subscriber ID, which means two API calls — first find subscriber by email, then update fields. This is a moderate complexity addition. Alternative: use the v4 API which may have different endpoint shapes. Verify against `https://developers.kit.com/v4.html` before building.

### Stripe Payment Link Redirect: Tier Detection

The current `thank-you.html` reads `?tier=` from the URL and uses it to determine purchase value for conversion tracking. This works if both Stripe Payment Links are configured with the correct redirect URL:

```
Starter Link redirect URL: https://getcontentkit.com/thank-you.html?tier=starter
Full Kit Link redirect URL: https://getcontentkit.com/thank-you.html?tier=full
```

**Important:** Stripe Payment Links do NOT support custom parameters beyond UTM codes and `client_reference_id`. The `?tier=starter` parameter in the redirect URL is set statically by you in the Stripe dashboard's "After the payment" → Redirect URL field — it is not dynamically added by Stripe. This is the correct approach. Stripe does NOT strip or modify custom URL parameters in the redirect URL; it redirects exactly to the URL you configured, appending only the `{CHECKOUT_SESSION_ID}` if you include that template variable.

**Verification:** The existing `thank-you.html` already implements tier-based value detection using `URLSearchParams`. No change needed here for tracking logic — only the real ad tracking IDs need to be substituted.

---

## Ad Landing Pages: Structure

Dedicated landing pages for paid traffic require:

1. **Message match to ad copy** — headline must match or closely echo the ad's promise
2. **No nav or external links** — remove the site navigation to prevent "leak" off the page
3. **Single CTA** — one action: buy or opt-in (not both)
4. **UTM parameters pass through to Stripe** — via the Kit form hidden fields (already implemented on index.html for UTM capture to Kit; the Stripe link click inherits UTMs via browser session)

**File naming convention:**
```
lp-google.html     — Google Ads landing page (focused on search intent keywords)
lp-meta.html       — Meta Ads landing page (focused on awareness/pain-point creative)
```

**Recommended structure for each:**
```html
<!-- No nav menu — remove entirely -->
<!-- Hero with message-matched headline -->
<!-- 3 key benefits (concise) -->
<!-- Single pricing CTA — one tier only (highest AOV) -->
<!-- Objection handling (2-3 bullets) -->
<!-- CTA repeated -->
<!-- Minimal footer: privacy policy link only -->
```

The landing pages are static HTML — same Tailwind CSS stack, same Stripe Payment Link URLs, same Kit opt-in form if you want to offer the lead magnet. No new infrastructure required.

---

## Recommended Project Structure (v1.1 File Changes)

```
/
├── index.html              # MODIFIED: real Google/Meta tracking IDs
├── thank-you.html          # MODIFIED: real conversion IDs + event_id for CAPI dedup
├── lp-google.html          # NEW: Google Ads landing page
├── lp-meta.html            # NEW: Meta Ads landing page
├── blog/                   # Unchanged
├── webhook/
│   └── netlify/
│       └── functions/
│           └── ls-webhook.js  # MODIFIED: custom fields + Meta CAPI call
├── output.css              # Unchanged (Tailwind compiled output)
├── ...                     # All other files unchanged
```

**No new Netlify functions required.** The existing `ls-webhook.js` is extended in-place. The Meta CAPI call goes inside the same function. This keeps the webhook surface area small and testable.

---

## Data Flow Summary

### 1. Opt-in → Lead Nurture (Existing, Unchanged)

```
Visitor fills Kit form (index.html or lp-*.html)
  ↓
Kit captures: email, utm_source, utm_campaign, utm_medium (hidden fields)
  ↓
Kit visual automation: deliver lead magnet PDF
  ↓
Kit 5-email nurture sequence starts (existing)
```

### 2. Purchase → Onboarding (New in v1.1)

```
Visitor clicks Stripe Payment Link
  ↓
Stripe processes payment
  ↓
Stripe fires checkout.session.completed → Netlify webhook
  ↓
Webhook: verify sig → extract email + amount → map to Kit tags
  ↓
Kit API call 1: add tag "purchased-starter" OR "purchased-full-kit"
Kit API call 2: add tag "buyer"
Kit API call 3 (NEW): set custom_field product_tier = "starter"/"full-kit"
Kit API call 4 (NEW): set custom_field purchase_value = "147"/"499"
Meta CAPI call (NEW): POST Purchase event with hashed email
  ↓
Kit "buyer" tag addition triggers Onboarding Visual Automation
  ↓
Onboarding sequence emails send over 12 days
```

### 3. Purchase → Ad Conversion Signal (New in v1.1)

```
Stripe → thank-you.html?tier=full
  ↓
Browser-side (existing code, real IDs needed):
  gtag('event', 'conversion', { send_to: 'AW-REAL/LABEL', value: 499 })
  fbq('track', 'Purchase', { value: 499, event_id: 'purchase_[ts]' })
  plausible('Purchase', { revenue: { amount: 499 } })
  ↓
Server-side (new — via Netlify webhook):
  Meta CAPI Purchase event (event_id matches browser event_id for dedup)
```

### 4. Cold Subscriber → Win-Back (New in v1.1)

```
[Manual: you] Kit Subscribers page → filter "Cold" status
  ↓
Bulk action: Add tag "cold-subscriber"
  ↓
Kit Automation Rule or Visual Automation triggers:
  Entry: tag "cold-subscriber" added
  ↓
Re-engagement email 1 → Wait 4 days → Re-engagement email 2
  ↓
If subscriber clicks link trigger in either email:
  → Remove tag "cold-subscriber"
  → Add tag "reactivated"
  → Exit automation (stays subscribed)
If subscriber does NOT click within window:
  → Unsubscribe action fires
```

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Kit (email) | JavaScript embed (opt-in form) + v3 REST API (webhook) | Tag triggers drive all new automations — no additional embed changes needed |
| Stripe | Payment Links (hyperlinks) + Webhook `checkout.session.completed` | No changes to Payment Links; webhook extended to set custom fields |
| Meta CAPI | `POST graph.facebook.com/v21.0/{PIXEL_ID}/events` from Netlify function | Requires `META_CAPI_ACCESS_TOKEN` in Netlify env vars; requires `META_PIXEL_ID` env var |
| Google Ads | `gtag('event', 'conversion', {...})` on `thank-you.html` | No server-side integration needed for v1.1 — browser-only |
| Plausible | Existing `plausible('Purchase', ...)` on `thank-you.html` | Already implemented; no change |
| GitHub Pages | Static file host for HTML | Add new `lp-google.html`, `lp-meta.html` files — no config changes |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `thank-you.html` ↔ Google Ads | `gtag()` client-side call | Real AW-* IDs must replace placeholder before launch |
| `thank-you.html` ↔ Meta Pixel | `fbq()` client-side call with `event_id` | `event_id` must match the CAPI server-side call for deduplication |
| `ls-webhook.js` ↔ Meta CAPI | `fetch()` server-side POST | Add after Kit tagging; soft-fail (log error, return 200 to Stripe) |
| `ls-webhook.js` ↔ Kit custom fields | Kit v3 API `PATCH /v3/subscribers/:id` | Two-step: find subscriber by email, then update fields |
| Kit tag "buyer" ↔ Onboarding Automation | Kit internal — tag addition triggers automation | Automation must be Active in Kit dashboard for tag trigger to fire |
| Kit "cold-subscriber" tag ↔ Win-Back Automation | Kit internal — tag addition triggers automation | Manual trigger today; could automate monthly with Kit's scheduled broadcasts |

---

## Build Order (Dependency Chain)

```
1. External account setup (no code)
   ├── Google Ads account → create Conversion Action → get AW-XXXXXXXX/LABEL
   └── Meta Business Manager → create Pixel → get PIXEL_ID → generate CAPI access token
         ↓
2. Inject real tracking IDs into HTML files
   ├── Replace AW-XXXXXXXXXX in: index.html, thank-you.html, lp-google.html, lp-meta.html
   └── Replace PIXEL_ID_HERE in: same files
         ↓
3. Build ad landing pages (lp-google.html, lp-meta.html)
   └── Depends on: real tracking IDs from Step 1
         ↓
4. Add Netlify environment variables
   ├── META_CAPI_ACCESS_TOKEN
   └── META_PIXEL_ID
         ↓
5. Extend Netlify webhook (ls-webhook.js)
   ├── Add Kit custom field updates (product_tier, purchase_value)
   └── Add Meta CAPI Purchase event call
   └── Depends on: env vars from Step 4
         ↓
6. Build Kit segmentation infrastructure
   ├── Add custom fields: product_tier, purchase_value
   └── Build 4 segments: buyers-all, buyers-starter, buyers-full-kit, leads-only
   └── (Does not depend on any code changes — do this in Kit UI)
         ↓
7. Build Kit Onboarding Visual Automation
   ├── Entry: tag "buyer" added
   ├── Add to existing sequence OR create new onboarding sequence
   └── Activate automation
   └── Depends on: custom fields from Step 6 (for conditional tier-specific email)
         ↓
8. Build Kit Win-Back Automation
   ├── Entry: tag "cold-subscriber" added
   ├── 2-email re-engagement sequence
   └── Activate automation
         ↓
9. Test end-to-end (per feature)
   ├── Make test purchase → verify Kit tags set → verify onboarding email fires
   ├── Verify Google Ads conversion tag fires on thank-you.html
   ├── Verify Meta Pixel Purchase event fires on thank-you.html
   ├── Verify Meta CAPI event arrives in Events Manager (check dedup)
   └── Tag test subscriber "cold-subscriber" → verify win-back emails fire
         ↓
10. Launch Google Ads campaign (destination: lp-google.html)
    Launch Meta Ads campaign (destination: lp-meta.html)
```

**Critical dependencies:**
- Step 7 (onboarding automation) depends on Step 5 (webhook extended) because the webhook adds the `buyer` tag that triggers the automation. If the automation is active but the webhook doesn't set the tag, no one enters.
- Step 2 (real tracking IDs) must complete before Step 10 (launch campaigns) — launching with placeholder IDs means zero conversion data.
- Step 4 (env vars) must complete before Step 5 (webhook code) is deployed — the webhook will log CAPI errors silently if the env var is missing, but the code should be deployed with the env var ready.

---

## Anti-Patterns

### Anti-Pattern 1: Adding the Onboarding Sequence to Opt-In Automation Instead of Purchase Tag

**What people do:** Add the onboarding sequence as a step in the existing lead magnet automation so it fires when anyone opts in.

**Why it's wrong:** Onboarding emails are product-specific ("here's how to use your purchase"). Non-buyers who opted in for the free guide receive purchase onboarding emails, which is confusing and damages trust.

**Do this instead:** Trigger the onboarding automation exclusively from the `buyer` tag, which is set only by the Stripe webhook upon successful payment.

### Anti-Pattern 2: Sending Both Pixel and CAPI Without event_id Matching

**What people do:** Add the CAPI call to the webhook and add `fbq('track', 'Purchase', ...)` to `thank-you.html` independently, without setting a shared `event_id`.

**Why it's wrong:** Meta counts both as separate conversions. Purchase appears to happen twice. Ad reporting shows inflated ROAS. Meta may eventually penalize accounts for excessive duplicate events.

**Do this instead:** Set `event_id` in `thank-you.html`'s `fbq()` call using a deterministic value (e.g., a timestamp captured on page load and stored in `localStorage`). In the CAPI call, use the Stripe session ID as the `event_id` — this is unique per purchase. Document both values and why they may differ. Meta's deduplication window is 48 hours.

**Note:** Using Stripe session ID in CAPI vs. a timestamp in browser Pixel means the event_ids will NOT match exactly. Best practice is to use the same ID in both — but without a way to pass the Stripe session ID to the browser synchronously, this is architecturally difficult. Practically, Meta's deduplication uses fuzzy matching on user data (email hash) + event timing when event_ids differ. This is acceptable for v1.1.

### Anti-Pattern 3: Using Segments as Automation Triggers

**What people do:** Try to set "subscribers in the Buyers - All segment" as the entry point for a visual automation.

**Why it's wrong:** Kit segments cannot trigger visual automations or automation rules. Segments are for broadcasts and filters only. Tags are the correct mechanism for automation triggers (HIGH confidence, verified in Kit official docs).

**Do this instead:** Use tags as automation triggers. Use segments for: (a) sending broadcasts to the right group, and (b) filtering sequences by excluding certain groups.

### Anti-Pattern 4: Hard-Coding Conversion Value in Google Ads gtag Call

**What people do:** Set `value: 499` statically in the Google Ads conversion event call on `thank-you.html`, regardless of which product was purchased.

**Why it's wrong:** Anyone who bought the Starter Kit ($147) appears as a $499 conversion in Google Ads. Smart Bidding optimizes toward users who look like $499 converters, creating a bidding model trained on false data.

**Do this instead:** Use the `?tier=` URL parameter already present in `thank-you.html` to set the value dynamically:
```javascript
var tier = new URLSearchParams(window.location.search).get('tier') || 'full';
var value = tier === 'starter' ? 147 : 499;
gtag('event', 'conversion', { send_to: 'AW-.../...', value: value, currency: 'USD' });
```
This logic is already implemented in `thank-you.html` — do not break it when substituting real IDs.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–50 conversions/month | Current architecture works well. Google Smart Bidding requires 30+ conversions/month to exit "learning" — focus on reaching this threshold first. |
| 50–500 conversions/month | Consider upgrading to Kit's Creator Pro plan for advanced segmentation and reporting. Consider Google Ads Enhanced Conversions (hash email and pass via gtag) for improved attribution. |
| 500+ conversions/month | Meta CAPI and Google Enhanced Conversions become mandatory (not optional) for accurate ROAS. Consider switching from GitHub Pages to Netlify to unify hosting and functions. Add server-side conversion verification. |

### Scaling Priorities

1. **First bottleneck — Smart Bidding learning phase:** Google and Meta algorithms require minimum conversion volume to optimize. Under 30 conversions/month, manual bidding outperforms Smart Bidding. Don't switch to Target ROAS until data is sufficient.
2. **Second bottleneck — Kit API rate limits:** The Kit v3 API has rate limits (not published explicitly in docs). At high purchase volume, multiple API calls per webhook invocation (tag + tag + custom field update) could hit limits. Mitigation: batch API calls or upgrade to Kit Creator Pro which has higher limits.

---

## Sources

- Kit Visual Automations actions: https://help.kit.com/en/articles/2502537-visual-automations-actions — HIGH confidence
- Kit Visual Automations triggers and entry points: https://help.kit.com/en/articles/2502666-how-to-use-kit-visual-automations — HIGH confidence
- Kit Automation Rules (tag-based triggers): https://help.kit.com/en/articles/6611507-how-to-create-and-manage-automation-rules-in-kit — HIGH confidence
- Kit tags vs. segments (segments cannot trigger automations): https://help.kit.com/en/articles/4257108-tags-and-segments-in-kit-and-when-to-use-which — HIGH confidence
- Kit cold subscriber / win-back (Ad Hoc List Cleaning template): https://help.kit.com/en/articles/5268661-cleaning-and-managing-your-list — HIGH confidence
- Stripe Payment Links post-payment redirect: https://docs.stripe.com/payment-links/post-payment — HIGH confidence
- Stripe Payment Links URL parameters (only UTM + client_reference_id supported): https://docs.stripe.com/payment-links/url-parameters — HIGH confidence
- Stripe metadata on Payment Links flows to checkout.session.completed: https://docs.stripe.com/metadata — HIGH confidence (can use product metadata to differentiate via line items)
- Meta CAPI + Pixel deduplication with event_id: Meta Conversions API documentation (via web search, multiple sources agree) — MEDIUM confidence (pattern well-established; exact field behavior should be verified in Meta Events Manager)
- Meta CAPI via Netlify Functions (viable): https://answers.netlify.com/t/facebook-business-conversions-api-integration/140012 — MEDIUM confidence (community confirmation)
- Google Ads conversion tracking on static thank-you page: https://support.google.com/google-ads/answer/12676738 + https://conversiontracking.io/blog/stripe-payment-link-conversion-tracking — MEDIUM confidence (pattern confirmed across multiple sources)
- Google Ads landing page best practices (message match, single CTA, no nav): https://support.google.com/google-ads/answer/6238826 — HIGH confidence, official Google Ads docs

---

*Architecture research for: ContentKit AI v1.1 — email automations, segmentation, paid ad tracking*
*Researched: 2026-02-28*
