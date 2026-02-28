# Stack Research

**Domain:** v1.1 Growth & Revenue — Post-purchase emails, win-back sequences, advanced segmentation, Google Ads, Meta Ads, dedicated ad landing pages
**Researched:** 2026-02-28
**Confidence:** HIGH for email/tracking (verified against Kit docs, Google Ads official docs, Meta official docs); MEDIUM for campaign structure (industry practice, not platform-mandated)

---

## Scope: Additions Only

The v1.0 stack is locked and working. This document covers **only what is new or changed** for v1.1 features. Do not re-litigate the core: static HTML + Tailwind CSS v4 + Alpine.js v3 + GitHub Pages + Stripe Payment Links + Netlify Function webhook.

---

## What Already Exists (Do Not Re-Research or Re-Build)

| Component | Status | Where |
|-----------|--------|-------|
| Google Ads gtag snippet | In all 8 HTML files with `AW-XXXXXXXXXX` placeholder | `<head>` of `index.html`, `thank-you.html`, 5 blog articles, `blog/index.html` |
| Meta Pixel base code | In all 8 HTML files with `PIXEL_ID_HERE` placeholder | `<head>` of same files |
| `begin_checkout` + `InitiateCheckout` events | Implemented inline in buy button click handlers | `index.html` line 480–516 |
| `generate_lead` + `Lead` events | Implemented on Kit form submit | `index.html` line 510–516 |
| `Purchase` event (fbq) | In `thank-you.html` | `thank-you.html` line 160–163 |
| Google Ads `conversion` event | In `thank-you.html` | `thank-you.html` line 149–155 |
| Stripe → Kit webhook | Deployed Netlify Function | `webhook/netlify/functions/ls-webhook.js` |
| Buyer tagging (Starter tag, Full Kit tag, generic buyer tag) | Working in webhook | Tags buyer in Kit via v3 API on `checkout.session.completed` |

**Conclusion for tracking:** The implementation is complete architecturally. The only task is replacing `AW-XXXXXXXXXX` and `PIXEL_ID_HERE` with real IDs from live ad accounts. No new code or libraries needed.

---

## Recommended Stack: New Additions

### Email Automation (Kit)

| Feature | Plan Required | How to Configure | Notes |
|---------|--------------|-----------------|-------|
| Post-purchase onboarding sequence | **Free plan (but see limit below)** | Visual Automations: trigger on tag `purchased-starter` or `purchased-full-kit` → start sequence | 5-email onboarding sequence; webhook already tags buyers |
| Win-back sequence | **Creator plan ($39/month) OR workaround** | Visual Automations: trigger on `time since opt-in > 7 days AND no purchase tag` → start win-back | Free plan allows only 1 visual automation total — see constraint below |
| Interest/industry segmentation | **Free plan** | Tags applied via opt-in form fields or link clicks in emails; Segments built from tag combinations | No library needed; Kit UI only |
| Behavior segmentation (link clicks) | **Free plan** | In Kit, use Rules: "When subscriber clicks link in email → add tag [interest-X]" | Tags applied automatically; segment builds itself |
| Subscriber scoring | **Creator Pro ($79+/month)** | Built-in feature | Overkill for v1.1; skip |

**Critical constraint — Kit free plan automation limit:**
Kit's free (Newsletter) plan allows exactly **1 visual automation** and **1 email sequence**. A second automation (win-back) requires upgrading to the Creator plan at $39/month for up to 1,000 subscribers.

**Recommended path:**
- Phase 1: Build post-purchase onboarding sequence on free plan (consumes the 1 automation + 1 sequence slot). Verify it works and reduces refund requests.
- Phase 2: When win-back sequence is ready to build, upgrade to Creator plan ($39/month). At $147–$499 per sale, a single converted win-back lead pays for months of Creator plan.
- Do not upgrade preemptively — validate the onboarding sequence first.

**Kit API version note:**
The existing webhook uses Kit API v3 (`api.convertkit.com/v3/`). V3 is not deprecated and has no announced shutdown date. Migration to v4 (`api.kit.com/v4/`) is future work — do not refactor the webhook for v1.1. The tagging endpoint behavior is identical for the current use case.

### Google Ads — Live Campaign Setup

No new libraries or code. The implementation is already done. Setup is entirely in Google Ads dashboard + replacing placeholder IDs.

**What "going live" means for Google Ads:**

| Step | Where | What |
|------|-------|------|
| Create Google Ads account | ads.google.com | Business account, billing method, conversion tracking |
| Get Conversion ID | Google Ads > Goals > Conversions | Generates real `AW-XXXXXXXXXX` and conversion label |
| Replace placeholder in HTML | All 8 files: `index.html`, `thank-you.html`, 5 blog pages, `blog/index.html` | Find/replace `AW-XXXXXXXXXX` with real ID |
| Create conversion action in Google Ads | Goals > Conversions > New conversion action > Website | Category: Purchase, Optimization: Primary, Count: One, Lookback: 30 days |
| Verify conversion fires | Google Tag Assistant chrome extension | Load `thank-you.html` — confirm conversion event fires |
| Build Search campaign | Campaigns > New campaign > Search | Goal: Sales, Conversion: Purchase |
| Campaign structure (see below) | — | — |

**Google Ads campaign structure for ContentKit AI:**

```
Account
├── Campaign 1: Brand (exact match — "contentkit", "content kit ai")
│   Budget: $5–10/day. Protect brand terms. Max CPC bidding initially.
│
└── Campaign 2: Non-brand intent (phrase/broad match)
    Budget: $20–50/day. Smart Bidding (Target CPA or Maximize Conversions with target).
    Ad Groups:
    ├── AI prompt pack (ai prompt pack, ai marketing prompts, chatgpt prompts for marketing)
    ├── Competitor keywords (gumroad prompt packs, jasper alternative, copy.ai alternative)
    └── Job-to-be-done (ai marketing copy, ai content creation for small business)
```

Use separate campaigns for brand vs. non-brand — mixing them causes Smart Bidding to optimize away brand terms since they're cheap, inflating non-brand spend.

**Bidding:** Start with Maximize Conversions (no target) for the first 2–4 weeks to let Google learn. After 30+ conversions, switch to Target CPA.

**No new code or libraries needed.** Google Ads conversion tracking is already implemented in HTML via gtag — only the real IDs are missing.

### Meta Ads — Live Campaign Setup

No new libraries or code for basic pixel tracking. CAPI (Conversions API) is optionally addable via the existing Netlify Function pattern.

**What "going live" means for Meta Ads:**

| Step | Where | What |
|------|-------|------|
| Create Meta Business Manager | business.facebook.com | Business account + ad account |
| Create Meta Pixel | Events Manager > Connect Data Source > Web | Generates real Pixel ID |
| Replace placeholder in HTML | All 8 files: find/replace `PIXEL_ID_HERE` | One find/replace across 8 files |
| Verify pixel fires | Meta Pixel Helper chrome extension | Load site, confirm PageView + events fire |
| Configure standard events | Events Manager verifies `Purchase`, `Lead`, `InitiateCheckout` | Already implemented in HTML — just need real Pixel ID |
| Build campaign | Ads Manager > Create campaign | Objective: Sales |

**Meta Ads campaign structure for ContentKit AI (2026 approach):**

```
Campaign: ContentKit AI — Sales
Objective: Sales
Budget: $30–50/day campaign budget (CBO — Campaign Budget Optimization)

Ad Set 1: Broad (test)
  Targeting: US, 25–54, no interest filters
  Creative: 3–5 variations (hook-first video/image)

Ad Set 2: Interest-based (validate)
  Targeting: digital marketing, entrepreneurship, online business, solopreneurs
  Creative: same 3–5 variations
```

In 2026, Meta's algorithm performs best with broad targeting and CBO (Campaign Budget Optimization enabled at campaign level). Interest stacking underperforms broad in most cases — let Meta's AI find buyers using your `Purchase` pixel events as the optimization signal.

**Meta Conversions API (CAPI) — Optional for v1.1:**

CAPI sends purchase data server-side, bypassing iOS ad blockers. Expected uplift: +20% on reported Purchase conversions. It is not required to launch — the pixel alone is sufficient to get campaigns running.

To add CAPI: extend the existing Netlify Function (`ls-webhook.js`) to send a `Purchase` event to Meta's Graph API (`https://graph.facebook.com/v21.0/{pixel-id}/events`) alongside the Kit tagging call. Include `event_id` (same UUID sent from the pixel) for deduplication.

**Recommend deferring CAPI to v1.2** — launch with pixel only, verify conversion signal quality, add CAPI if Meta reports "Event Match Quality" as Poor or Limited. Adding CAPI adds complexity (Meta access token, event_id threading from client to server) without blocking launch.

### Dedicated Ad Landing Pages

No new frameworks or tools needed. These are additional `.html` files in the existing repo using the same static HTML + Tailwind v4 + Alpine.js v3 stack.

**What "dedicated landing page" means in practice:**

| Attribute | Main `index.html` | Ad Landing Page |
|-----------|------------------|----------------|
| Navigation | Full nav bar | Removed (no escape routes) |
| Footer | Full footer with links | Minimal — legal links only |
| Message match | Generic headline | Mirror exact ad headline/hook |
| CTA focus | Multiple (email + buy) | Single CTA (buy only, or buy + email) |
| Social proof | Full section | Most relevant testimonials only |
| Length | Long-form (full sales page) | Shorter (message match first, then key proof) |
| URL | `getcontentkit.com/` | `getcontentkit.com/lp/google-search.html` etc. |

**Naming convention for ad pages:**
- `/lp/google-search.html` — Google Search traffic
- `/lp/meta-solopreneur.html` — Meta ad set targeting solopreneurs
- `/lp/meta-freelancer.html` — Meta ad set targeting freelancers

Keep pages in `/lp/` subdirectory. Same `output.css` (already compiled). Same Tailwind CLI to rebuild after adding new classes.

**Key technical note:** Ad landing pages must include the same `AW-XXXXXXXXXX` and `PIXEL_ID_HERE` snippets (after replacing with real IDs). The conversion events on `thank-you.html` already fire for all traffic sources — no per-page conversion code needed on the landing pages themselves.

---

## Installation

No new npm packages. No new CDN dependencies. All additions are:

1. **Kit:** UI configuration in kit.com dashboard — visual automation builder, sequence editor, segment builder, rules
2. **Google Ads:** Dashboard configuration at ads.google.com — replace 2 placeholder strings in 8 HTML files
3. **Meta Ads:** Dashboard configuration at business.facebook.com — replace 1 placeholder string in 8 HTML files
4. **Landing pages:** New `.html` files in `/lp/` — same build toolchain as existing pages

```bash
# No new packages to install.
# After adding new Tailwind classes to /lp/ landing pages, rebuild CSS:
./tailwindcss -i src/input.css -o output.css --minify
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| Kit Visual Automations (in-platform) | Zapier/Make.com for email automation | Adds $20–49/month cost when Kit's native automations already do this; over-engineered for 1-2 automation sequences |
| Kit Creator plan upgrade for win-back | Stay on free plan with only onboarding sequence | Win-back is the highest ROI email sequence for digital products — worth the $39/month cost once onboarding sequence is validated |
| Direct gtag implementation for Google Ads | Google Tag Manager (GTM) | GTM adds a 2nd JavaScript container to manage, increases page complexity. The existing gtag implementation is already working and correct. GTM would only be warranted at 10+ tracking tags. |
| Meta Pixel only for v1.1 launch | Meta Pixel + CAPI from day 1 | CAPI requires threading event_id from browser to server, a non-trivial integration. Pixel alone is sufficient to build initial audience signal and optimize campaigns. Add CAPI in v1.2 if match quality is poor. |
| Static HTML in `/lp/` directory for ad pages | Unbounce / Instapage landing page builders | $99–199/month for hosted builder when the existing static HTML stack handles dedicated pages with zero cost. No A/B testing needed until ad spend justifies it (>$5K/month). |
| Broad targeting on Meta (2026 algorithm) | Detailed interest stacking | Industry data shows broad targeting outperforms interest stacking with Meta's 2025–2026 AI optimization changes. Interest stacks are fine as a second ad set for testing. |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Google Tag Manager (GTM) | Adds complexity for no benefit when gtag is already correctly implemented. GTM makes sense at 10+ tags. You have 2. | Existing inline gtag in HTML |
| Meta Conversions API (v1.1) | Non-trivial implementation (event_id threading, Meta access token management). Pixel alone is sufficient to launch and learn. | Pixel only for v1.1; CAPI in v1.2 |
| Kit Creator Pro ($79/month) | Subscriber scoring, advanced reporting, Facebook custom audiences — none needed at this list size or this stage | Kit Creator ($39/month) is the correct upgrade when win-back sequence is ready |
| Segment.com / analytics middleware | Overkill for 2 ad platforms with native pixels. Segment is useful at 5+ data destinations. | Native Google Ads gtag + Meta Pixel |
| VWO / Optimizely for A/B testing | No A/B testing needed until ad spend exceeds $5K/month and you have statistical power to run tests. At $30–50/day these tools will not reach significance. | Manual URL split testing (run `/lp/variant-a.html` on one ad set, `/lp/variant-b.html` on another) |
| Zapier / Make.com for automation | Adds $20–49/month cost for work Kit's native automations handle natively for free | Kit Visual Automations + Sequences |
| New email service provider | Kit is fully capable of all v1.1 email features. Migration would cost time and deliverability warmup. | Kit (upgrade to Creator when ready) |
| Facebook SDK (fbq loaded via JS module) | The inline Pixel base code is already the correct implementation. SDK-based loading adds complexity with no benefit. | Existing inline fbq snippet |

---

## Stack Patterns by Feature

**If building the post-purchase onboarding sequence (free plan):**
- Kit dashboard: Create sequence "Post-Purchase Onboarding" (5 emails, 1 per day or 1 every other day)
- Kit dashboard: Create visual automation → Trigger: "Tag added: purchased-starter" OR "Tag added: purchased-full-kit" → Action: Add to sequence "Post-Purchase Onboarding"
- The existing Netlify webhook already applies these tags on purchase — no code changes needed
- Consumes the free plan's 1 automation slot and 1 sequence slot

**If building the win-back sequence (requires Creator plan):**
- Upgrade Kit to Creator ($39/month)
- Create sequence "Win-Back: Non-Buyers" (3–5 emails over 14 days)
- Create visual automation → Trigger: "Subscriber created 7+ days ago" → Condition: "Does NOT have tag: buyer" → Action: Add to sequence "Win-Back: Non-Buyers"
- Segment in Kit: filter = subscribed via form AND no purchase tags AND subscribed more than 7 days ago

**If adding interest/industry segmentation:**
- Kit tags: Add `interest-social-media`, `interest-email`, `interest-ads`, `interest-content` tags via Rules triggered by link clicks in nurture emails
- Segments: Create segments per interest tag (e.g., segment "Social Media Focused" = has tag `interest-social-media`)
- No code changes needed — entirely Kit UI

**If going live on Google Ads:**
- Replace `AW-XXXXXXXXXX` in 8 files — this is a find/replace operation
- Get real Conversion ID + Label from Google Ads dashboard
- Update `'send_to': 'AW-XXXXXXXXXX/CONVERSION_LABEL'` in `thank-you.html` with both values
- Verify with Tag Assistant before spending budget

**If going live on Meta Ads:**
- Replace `PIXEL_ID_HERE` in 8 files — single find/replace
- Get real Pixel ID from Meta Events Manager
- Verify with Meta Pixel Helper before spending budget

**If building `/lp/` dedicated landing pages:**
- Copy `index.html` as base, remove nav, simplify footer, adjust headline to match ad copy
- Place in `/lp/` directory
- Same `output.css` reference path needs updating: use `../output.css` from `/lp/` subdirectory
- Run `./tailwindcss -i src/input.css -o output.css --minify` if new Tailwind classes are added

---

## Version Compatibility

| Component | Version | Compatible With | Notes |
|-----------|---------|----------------|-------|
| Kit API v3 (existing webhook) | v3 | Current — not deprecated | No migration needed for v1.1; v4 migration is future work |
| Kit API v4 (if migrating) | v4 | api.kit.com (new base URL) | URL changes from `api.convertkit.com/v3/` to `api.kit.com/v4/`; endpoint paths also change |
| gtag.js (Google Ads) | Current (loaded async from Google CDN) | All modern browsers | Already in all 8 files; no version pinning needed |
| Meta Pixel (fbevents.js) | 2.0 (set in code) | All modern browsers | Already in all 8 files; version 2.0 is current |
| Tailwind CSS v4 | v4.x | Standalone CLI (existing) | No changes needed for landing pages — they reuse same `output.css` |
| Alpine.js | v3.x (CDN) | All modern browsers | Landing pages can include or omit; no interactive JS needed on bare landing pages |

---

## Sources

- Kit free plan automation limits (multiple sources corroborate 1 automation + 1 sequence): [emailtooltester.com/en/reviews/convertkit/pricing](https://www.emailtooltester.com/en/reviews/convertkit/pricing/) (MEDIUM confidence — verify at kit.com/pricing before building)
- Kit Creator plan pricing ($39/month for 1,000 subscribers): [emailtooltester.com](https://www.emailtooltester.com/en/reviews/convertkit/pricing/) + [sender.net/reviews/kit/pricing](https://www.sender.net/reviews/kit/pricing/) (MEDIUM — verify at kit.com/pricing)
- Kit API v3 deprecation status ("not in active development, no shutdown date"): [developers.kit.com/v3](https://developers.kit.com/v3) (HIGH confidence — official Kit developer docs)
- Kit API v4 URL change to api.kit.com/v4: [developers.kit.com/v4](https://developers.kit.com/v4) (HIGH confidence — official docs)
- Kit tag subscriber v4 endpoint: [developers.kit.com/api-reference/tags/tag-a-subscriber](https://developers.kit.com/api-reference/tags/tag-a-subscriber) (HIGH confidence — official API reference)
- Google Ads gtag implementation for static HTML: [support.google.com/google-ads/answer/12216424](https://support.google.com/google-ads/answer/12216424) (HIGH confidence — official Google Ads help)
- Google Ads conversion tracking setup guide: [stape.io/blog/google-ads-conversion-tracking](https://stape.io/blog/google-ads-conversion-tracking) (MEDIUM — third-party guide corroborating official docs)
- Meta Pixel + CAPI: both needed in 2026 for full signal: [blog.funnelfox.com/meta-pixel-and-conversions-api](https://blog.funnelfox.com/meta-pixel-and-conversions-api/) (MEDIUM confidence — industry source)
- Meta CAPI event deduplication via event_id: [adsuploader.com/blog/meta-conversions-api](https://adsuploader.com/blog/meta-conversions-api) (MEDIUM confidence)
- Meta broad targeting outperforms interest stacking in 2026: [metalla.digital/meta-ads-strategy-2026-blueprint](https://metalla.digital/meta-ads-strategy-2026-blueprint/) + [anchour.com/articles/meta-ads-2026-playbook](https://www.anchour.com/articles/meta-ads-2026-playbook/) (MEDIUM — industry consensus, not Meta official doc)
- Existing webhook code verified: `/Users/wilfredshammah/Desktop/dp/webhook/netlify/functions/ls-webhook.js` (HIGH — read directly from codebase)
- Existing tracking placeholders verified: `index.html` lines 28–50, `thank-you.html` lines 14–34 (HIGH — read directly from codebase)

---

*Stack research for: ContentKit AI v1.1 — Growth & Revenue (email sequences, segmentation, Google Ads, Meta Ads, ad landing pages)*
*Researched: 2026-02-28*
*Scope: Additions only — v1.0 stack unchanged*
