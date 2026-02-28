# Project Research Summary

**Project:** ContentKit AI v1.1 — Growth & Revenue
**Domain:** Digital product growth infrastructure — post-purchase lifecycle email, advanced segmentation, paid acquisition (Google Ads + Meta Ads), dedicated ad landing pages
**Researched:** 2026-02-28
**Confidence:** MEDIUM-HIGH

## Executive Summary

ContentKit AI v1.1 adds growth and revenue infrastructure to an already-shipped v1.0 product. The core architecture (static HTML + GitHub Pages + Kit + Stripe Payment Links + Netlify webhook) is locked and working. Every v1.1 feature is an addition or modification — not a rebuild. The recommended approach treats the existing Netlify webhook and Kit tag system as the integration backbone: the webhook is extended to set custom fields and call Meta CAPI, while Kit tag additions trigger all new email automations. No new frameworks, services, or hosting changes are required. All new code lands in three places: the existing `ls-webhook.js`, new static HTML landing pages in the root directory, and Kit's visual automation builder.

The critical build order is: (1) external ad account setup with real tracking IDs, (2) inject those IDs into HTML, (3) build dedicated ad landing pages, (4) extend the Netlify webhook, (5) configure Kit automations, (6) launch campaigns. Steps 1-4 must complete before any ad spend because running campaigns with placeholder tracking IDs (`AW-XXXXXXXXXX`, `PIXEL_ID_HERE`) means zero optimization signal. The email automation work can run in parallel once the webhook custom field additions are deployed.

The primary risks are operational, not technical. The cross-domain tracking gap at Stripe checkout can corrupt ROAS data if deduplication is not implemented. Meta Ads accounts are aggressively restricted for new advertisers — business verification and policy-compliant ad copy must be confirmed before any campaign launches. Google Ads Smart Bidding requires 30+ conversions/month to function; new accounts should start on Manual CPC to avoid a perpetual learning-phase stall. Email automation has one hard prerequisite: buyer suppression from the nurture sequence must be configured before the post-purchase onboarding sequence is activated, or buyers will receive both flows simultaneously.

---

## Key Findings

### Recommended Stack

The v1.1 stack adds zero new dependencies. All additions are configuration changes to existing services plus new HTML files using the existing build toolchain. See `.planning/research/STACK.md` for full detail.

**Core technologies:**
- **Kit (free plan → Creator $39/month):** Email automation backbone. Post-purchase onboarding sequence runs on the free plan's single automation slot. Win-back sequence requires upgrading to Creator plan — do not upgrade preemptively; validate onboarding first, then upgrade when win-back sequence is ready to build.
- **Kit API v3 (existing webhook):** Remains current — not deprecated, no shutdown date. Extend the existing webhook to set `product_tier` and `purchase_value` custom fields via `PATCH /v3/subscribers/:id`. Do not migrate to v4 for v1.1.
- **Meta Conversions API (CAPI):** Server-side Purchase event fired from the existing `ls-webhook.js` to `graph.facebook.com/v21.0/{PIXEL_ID}/events`. Requires `META_CAPI_ACCESS_TOKEN` in Netlify env vars. Provides approximately +20% lift in attributed conversions by bypassing iOS ad blockers.
- **Google Ads gtag (existing):** Already implemented in all 8 HTML files. Only task is replacing the `AW-XXXXXXXXXX` placeholder with a real Conversion ID and Conversion Label from the Google Ads dashboard.
- **Meta Pixel (existing):** Already implemented in all 8 HTML files. Only task is replacing `PIXEL_ID_HERE` with a real Pixel ID from Meta Events Manager.
- **Static HTML landing pages (`lp-google.html`, `lp-meta.html`):** New files in the root directory using the existing Tailwind CSS v4 + Alpine.js v3 stack. Same `output.css`. No nav, no footer links, single CTA, message-matched headline.

**What not to add:** Google Tag Manager (over-engineered for 2 tracking tags), Segment.com (overkill for 2 ad platforms), Zapier/Make.com (Kit native automations handle this for free), Unbounce/Instapage (static HTML handles dedicated pages at zero cost), Kit Creator Pro at $79/month (subscriber scoring is premature), full ESP migration (Kit handles all v1.1 requirements).

### Expected Features

See `.planning/research/FEATURES.md` for full detail, dependency graph, sequence structure, and competitor analysis.

**Must have (P1 — table stakes, required before any ad spend):**
- Buyer removal from nurture sequence — prevents simultaneous nurture + onboarding email delivery; prerequisite to all other email work
- Post-purchase onboarding sequence (Starter tier, $147) — Day 0/3/7/14; confirms purchase, quick win, upsell to Full Kit on Day 7, testimonial ask on Day 14
- Post-purchase onboarding sequence (Full Kit tier, $499) — Day 0/3/7/14; confirms premium purchase, advanced tips, testimonial ask
- Real Google Ads Conversion ID injected — replaces `AW-XXXXXXXXXX` in 8 HTML files; required before any Google Ads budget
- Real Meta Pixel ID injected — replaces `PIXEL_ID_HERE` in 8 HTML files; required before any Meta Ads budget
- Dedicated ad landing pages (`lp-google.html`, `lp-meta.html`) — no nav, single CTA, message-matched to ad copy; must exist before campaigns launch

**Should have (P2 — competitive, ship within 30 days of first ad revenue):**
- Engagement-based segmentation — tag subscribers `engaged` on open/click; creates win-back trigger foundation
- Win-back sequence (3 emails, Day 21/25/30 from opt-in) — value-first approach, not discount-first; requires Kit Creator plan upgrade to $39/month
- UTM-tagged landing page variants — separate URL per traffic source for clean Plausible attribution
- Google Ads Search campaign (brand campaign + non-brand intent campaign, separate) — high-intent keyword capture
- Meta Ads cold traffic campaign (Sales objective, CBO, broad targeting + interest-based ad sets) — awareness and demand generation

**Defer to v1.2+ (P3):**
- Sunset automation — list deliverability hygiene; not urgent until list exceeds 2,000 subscribers
- Retargeting campaigns — defer until 1,000+ unique ad visitors are pixeled; pixel builds audience passively
- Engagement scoring (3-point custom field: active/warm/cold) — worth building when list exceeds 1,000 active subscribers
- Meta CAPI — adds attribution lift but requires event_id threading; pixel alone is sufficient to launch
- Affiliate/referral program — defer until LTV and conversion rate are validated

### Architecture Approach

The architecture is an additive extension of the existing system. The Netlify webhook (`ls-webhook.js`) is the central integration point: it already tags Kit subscribers on purchase and is extended to also set custom fields (`product_tier`, `purchase_value`) and call Meta CAPI. Kit tag additions drive all email automation triggers — the `buyer` tag triggers the post-purchase onboarding visual automation; the `cold-subscriber` tag (applied via bulk action on the Kit Subscribers page) triggers the win-back automation. Segments in Kit are filter-only constructs for broadcasts and exclusions — they cannot trigger automations. Tags are the correct trigger mechanism. See `.planning/research/ARCHITECTURE.md` for full data flow diagrams and the 10-step build order.

**Major components:**
1. **`ls-webhook.js` (modified)** — Stripe to Kit tagging (existing) + Kit custom field updates (new) + Meta CAPI Purchase event (new); all additions are soft-fail so Stripe always receives a 200 response
2. **Kit Visual Automations (new)** — Post-purchase onboarding automation (trigger: `buyer` tag added, conditional branch for `purchased-starter` vs `purchased-full-kit`); Win-back automation (trigger: `cold-subscriber` tag added, 2-email re-engagement)
3. **Kit Segmentation (new)** — 5 segments: Buyers-All, Buyers-Starter, Buyers-Full-Kit, Leads-Only, Cold-Subscribers; used for broadcasts and exclusion filters only
4. **Ad landing pages (`lp-google.html`, `lp-meta.html`)** — Static HTML, no nav, single CTA, message-matched; same Tailwind/Alpine stack; real tracking IDs injected
5. **`thank-you.html` (modified)** — Real Conversion ID + real Pixel ID; dynamic `value` based on `?tier=` param (already implemented, IDs only); `event_id` added to `fbq()` Purchase call for CAPI deduplication; `sessionStorage` guard prevents duplicate conversion events on refresh
6. **Google Ads account (external setup)** — Brand campaign (exact match) + Non-brand intent campaign (phrase/broad match, 3 ad groups); Manual CPC bidding until 30+ conversions recorded
7. **Meta Ads account (external setup)** — Sales objective, CBO, broad targeting ad set + interest-based ad set; business verification required before campaign creation

**Build order dependency chain (10 steps):**
External ad account setup → inject real IDs into HTML → build ad landing pages → add Netlify env vars → extend webhook → build Kit segments + custom fields → build Kit automations → end-to-end test each feature → launch campaigns.

### Critical Pitfalls

See `.planning/research/PITFALLS.md` for full detail, recovery strategies, and the "Looks Done But Isn't" checklist.

1. **Buyers receive nurture and onboarding emails simultaneously** — Configure Kit automation rule before post-purchase sequence is activated: `purchased-starter` or `purchased-full-kit` tag applied triggers unsubscribe from lead-magnet-nurture sequence. Test end-to-end with a test subscriber before activating. This is a non-optional prerequisite.

2. **Duplicate conversion events on thank-you page refresh** — Implement `sessionStorage` deduplication guard before firing `gtag()` and `fbq()` events; pass Stripe `session_id` as `transaction_id` to Google Ads; set Google Ads conversion count to "One" not "Every." Verify by completing a test purchase and refreshing 3 times.

3. **Cross-domain tracking gap at Stripe checkout** — `gclid` and `fbclid` cookies are not shared across the `buy.stripe.com` domain boundary. Pass click IDs dynamically via URL parameters appended to the Stripe Payment Link URL. Server-side CAPI via Netlify webhook provides attribution fallback for blocked cookies.

4. **Google Ads Smart Bidding data starvation on new account** — Smart Bidding requires 30+ conversions/month. At $147–$499 per conversion, this is a high threshold. Start with Manual CPC or Maximize Clicks (no CPA target) for the first 4–6 weeks; switch to Smart Bidding only after 30+ conversions are recorded.

5. **Meta Ads account restricted at launch** — Complete Meta Business Verification before creating any campaign. Audit all ad copy: replace earnings or income claims with outcome descriptions ("Save 8 hours a week" not "Replace a $5K copywriter"). Start at $5–10/day for 3–5 days to establish account trust before scaling budget.

6. **Win-back fires on warm prospects immediately after nurture sequence ends** — The 5-email nurture ends on Day 9. A 14-day inactive trigger fires on almost everyone who did not buy. Set win-back trigger to 60+ days inactive AND subscriber age > 30 days AND no buyer tags.

---

## Implications for Roadmap

Based on combined research, four phases are suggested in the following order:

### Phase 1: Tracking Infrastructure and Ad Landing Pages

**Rationale:** Nothing in v1.1 can be validated without real conversion tracking. Placeholder IDs in 8 HTML files mean zero optimization signal from any ad spend. This phase is the prerequisite gate for all paid acquisition work. It also requires the Netlify webhook extension (Meta CAPI) and the deduplication logic on the thank-you page before any campaigns launch.
**Delivers:** Real Google Ads Conversion ID and Meta Pixel ID injected into all HTML files; `sessionStorage` deduplication on thank-you page; Meta CAPI call added to `ls-webhook.js`; `lp-google.html` and `lp-meta.html` built and deployed; Netlify env vars (`META_CAPI_ACCESS_TOKEN`, `META_PIXEL_ID`) set
**Addresses:** Tracking ID wiring (P1), dedicated landing pages (P1)
**Avoids:** Duplicate conversion pitfall (Pitfall 2), cross-domain tracking gap (Pitfall 5), Plausible-only Smart Bidding blindness (Pitfall 3), hard-coded conversion value (ARCHITECTURE.md anti-pattern 4)

### Phase 2: Email Automation — Post-Purchase Onboarding

**Rationale:** Buyer lifecycle management must be in place before campaigns drive purchase volume. Buyers entering the system without onboarding emails and without nurture sequence suppression will receive mixed messaging. This phase protects list health and LTV before ad spend begins. It can run in parallel with Phase 1's external ad account setup but the webhook custom field additions (from Phase 1) should be deployed before testing the onboarding sequence end-to-end.
**Delivers:** Buyer suppression automation rule (purchased-starter/full-kit tag → unsubscribe from nurture); Kit custom fields `product_tier` and `purchase_value` set by webhook; Kit Starter onboarding sequence (4 emails, Day 0/3/7/14); Kit Full Kit onboarding sequence (4 emails, Day 0/3/7/14); 5 Kit segments built; end-to-end verified via test purchase
**Addresses:** Post-purchase onboarding — both tiers (P1), buyer removal from nurture (P1 prerequisite)
**Avoids:** Buyers-in-nurture pitfall (Pitfall 1), post-purchase sequence referencing lead magnet that cold ad traffic buyers never received (PITFALLS.md UX pitfall), segments-as-automation-triggers anti-pattern (ARCHITECTURE.md anti-pattern 3)

### Phase 3: Ad Campaign Launch — Google Ads and Meta Ads

**Rationale:** Phases 1 and 2 must be complete before any ad spend. Phase 1 ensures conversion tracking fires correctly and dedicated landing pages exist. Phase 2 ensures buyers have a working post-purchase experience. This phase is the revenue generation phase. The bidding strategy decision (Manual CPC, not Smart Bidding) must be locked before campaign creation.
**Delivers:** Google Ads account + Search campaign (brand campaign + non-brand intent campaign, separate); Meta Business Manager + Pixel verified + initial Sales campaign (broad ad set + interest ad set, CBO); verified conversion tracking end-to-end (click → purchase → conversion credited); bidding strategy set to Manual CPC; campaigns sending to `lp-google.html` and `lp-meta.html` respectively
**Addresses:** Google Ads Search campaign (P2), Meta Ads cold traffic campaign (P2)
**Avoids:** Meta account restriction at launch (Pitfall 6), Smart Bidding data starvation (Pitfall 4), ad traffic sent to homepage rather than dedicated landing pages (PITFALLS.md technical debt table), broad match keywords on new account (PITFALLS.md performance traps)

### Phase 4: Segmentation and Win-Back

**Rationale:** Win-back requires engagement segmentation infrastructure to exist first. The win-back sequence trigger depends on a segment definition in Kit ("non-buyer + 60+ days inactive + subscriber age > 30 days"). This phase also unlocks clean broadcast targeting. Requires Kit Creator plan upgrade ($39/month) to support a second visual automation alongside the onboarding automation. Best timed after first paid acquisition conversions are confirmed — the Creator plan upgrade is more defensible once revenue is validated.
**Delivers:** Engagement-based tagging (open/click events trigger `engaged` tag via Kit automation rule); win-back sequence (3 emails, Day 21/25/30, value-first not discount-first); Kit Creator plan upgrade; UTM-tagged landing page variants for clean Plausible attribution
**Addresses:** Engagement-based segmentation (P2), win-back sequence (P2), UTM-tagged landing page variants (P2)
**Avoids:** Win-back fires on warm prospects (Pitfall 7 — 60-day trigger + age > 30 days condition), broadcasts sent to buyers (PITFALLS.md integration gotchas), discount-led win-back (FEATURES.md anti-features)

### Phase Ordering Rationale

- Phase 1 before Phase 3 is non-negotiable: launching campaigns with placeholder tracking IDs wastes every dollar spent and leaves algorithms with zero optimization signal.
- Phase 2 before Phase 3 is strongly recommended: cold ad traffic buyers who land in a broken email experience (simultaneous nurture + onboarding) will unsubscribe at elevated rates, destroying the list quality that paid acquisition is meant to build.
- Phase 4 after Phase 3 because: win-back requires actual list members who have been non-converting for 60+ days; the Kit Creator plan upgrade ($39/month) is more defensible once first paid acquisition conversions are confirmed; and engagement segmentation is more meaningful when there is a sufficient list to segment.
- The feature dependency chain from FEATURES.md is fully respected: buyer removal from nurture (Phase 2) must precede onboarding (Phase 2); segmentation (Phase 4) must precede win-back (Phase 4); pixel tracking (Phase 1) must precede retargeting (deferred); all campaigns (Phase 3) require landing pages (Phase 1).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Ad Campaign Launch):** Campaign structure is documented (keyword ad groups, bidding strategy, budget ranges), but keyword lists, ad copy variants, and creative briefs for Meta require production work not covered in this research. Google Ads Quality Score behavior for a new account in the AI tools category needs verification via Google Ads Keyword Planner during Phase 3 planning.
- **Phase 4 (Win-Back):** Kit's built-in "cold subscriber" filter is reportedly fixed at 90 days (not configurable via the UI). If confirmed, the desired 60-day win-back window requires a manual workaround (bulk-tag subscribers filtered by 60 days no open on the Kit Subscribers page). Verify in the live Kit dashboard before designing the Phase 4 automation.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Tracking Infrastructure):** Google Ads gtag and Meta Pixel implementations are fully documented in official sources and the code patterns are already in the codebase — only real IDs are missing. CAPI webhook extension pattern is well-established. `sessionStorage` deduplication is a standard pattern.
- **Phase 2 (Email Automation):** Kit visual automations and automation rules are verified against official Kit help center (HIGH confidence). The tag-trigger pattern is confirmed. Sequence content (emails) is a writing task, not a research task.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official Kit API docs, Google Ads docs, Meta Ads docs, and live codebase inspection. Zero new dependencies — minimal unknown surface area. The one caveat: Kit free plan automation limit (1 visual automation, 1 sequence) sourced from third-party review sites, not Kit's own pricing page — verify at kit.com/pricing before building Phase 2 on this assumption. |
| Features | MEDIUM-HIGH | Table stakes features (P1) are multi-source confirmed. Win-back timing benchmarks (60-day trigger) are industry consensus from practitioner sources (MEDIUM). The value-first vs. discount-first win-back recommendation is well-reasoned but lacks a controlled study for this specific product type. Tier-specific onboarding sequences are industry best practice, not a novel claim. |
| Architecture | HIGH | Kit automation trigger patterns verified against official Kit help center. Stripe redirect behavior verified against official Stripe docs. Meta CAPI deduplication via event_id is confirmed in Meta official documentation (via web search, pattern well-established). Cross-domain tracking gap is documented by Stripe itself. |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls (duplicate conversions, Smart Bidding data starvation, Meta account restrictions, buyers-in-nurture) are HIGH confidence verified against official sources. Win-back timing pitfall is MEDIUM confidence from industry practitioners but directionally consistent across multiple sources. |

**Overall confidence:** MEDIUM-HIGH — sufficient to proceed to roadmap creation without additional research. The gaps below should be resolved during phase planning, not before roadmap creation.

### Gaps to Address

- **Kit free plan automation limit:** Reported as 1 visual automation + 1 email sequence by third-party sources. Must be verified at `kit.com/pricing` before committing Phase 2 to the free plan assumption. If the limit has changed or is stricter, Phase 2 may require the Creator plan upgrade earlier than planned.
- **Kit "cold subscriber" 90-day threshold:** Research indicates Kit's built-in cold subscriber filter is fixed at 90 days and non-configurable. If the desired win-back window is 60 days, a manual tag-based workaround is needed. Verify in the live Kit dashboard before designing Phase 4 automation — this could affect trigger logic significantly.
- **Meta CAPI event_id deduplication with mismatched IDs:** The ARCHITECTURE.md documents that the browser Pixel call will use a timestamp-based event_id while the CAPI server-side call uses the Stripe session ID — these will not match exactly. Meta uses fuzzy deduplication (user data hash + timing) when event_ids differ. Acceptable for v1.1 but should be monitored in Meta Events Manager after Phase 3 launch for unexpected duplicate counts.
- **Google Ads Conversion Label format:** The codebase placeholder is `AW-XXXXXXXXXX`; the actual Google Ads conversion call requires both a Conversion ID (`AW-XXXXXXXXXX`) and a Conversion Label (a separate alphanumeric string). Both values must be sourced from the Google Ads dashboard and the `send_to` field in `thank-you.html` updated with the format `AW-REAL_ID/REAL_LABEL`. Verify this is correctly structured during Phase 1 implementation.

---

## Sources

### Primary (HIGH confidence)
- Kit Visual Automations — triggers and actions: https://help.kit.com/en/articles/2502537-visual-automations-actions
- Kit Automations — how to use visual automations: https://help.kit.com/en/articles/2502666-how-to-use-kit-visual-automations
- Kit Automation Rules (tag-based triggers): https://help.kit.com/en/articles/6611507-how-to-create-and-manage-automation-rules-in-kit
- Kit tags vs. segments (segments cannot trigger automations): https://help.kit.com/en/articles/4257108-tags-and-segments-in-kit-and-when-to-use-which
- Kit list cleaning / cold subscriber template: https://help.kit.com/en/articles/5268661-cleaning-and-managing-your-list
- Kit API v3 deprecation status: https://developers.kit.com/v3
- Kit API v4 URL and endpoints: https://developers.kit.com/v4
- Stripe Payment Links post-payment redirect: https://docs.stripe.com/payment-links/post-payment
- Stripe Payment Links URL parameters: https://docs.stripe.com/payment-links/url-parameters
- Google Ads conversion deduplication via transaction ID: https://support.google.com/google-ads/answer/6386790
- Google Ads Smart Bidding learning phase minimum conversions: https://support.google.com/google-ads/answer/13020501
- Google Ads landing page best practices (message match, single CTA): https://support.google.com/google-ads/answer/6238826
- Plausible Analytics — confirmed cannot import into Google Ads: https://plausible.io/blog/google-ads-tracking
- Existing codebase (`ls-webhook.js`, `index.html`, `thank-you.html`) — verified directly

### Secondary (MEDIUM confidence)
- Kit free plan limits (1 automation, 1 sequence): emailtooltester.com + sender.net — verify at kit.com/pricing
- Kit Creator plan pricing ($39/month for up to 1,000 subscribers): same sources — verify at kit.com/pricing
- Meta broad targeting outperforms interest stacking in 2026: metalla.digital + anchour.com (industry consensus)
- Meta CAPI event_id deduplication behavior with mismatched IDs: multiple practitioner sources, pattern consistent
- Google Ads Smart Bidding data starvation behavior: HawkSEM + Adventure PPC
- Win-back timing benchmarks (60-day trigger, 3-email maximum, value-first): Flowium + ActiveCampaign blog
- Meta Ads account suspension rates and UBP policy triggers for digital products: StubGroup + Blackscale Media
- Stripe cross-domain tracking gap and gclid/fbclid passthrough workaround: ConversionTracking.io + Tracklution
- Meta Pixel + CAPI combined approach for 2026: blog.funnelfox.com + adsuploader.com

---
*Research completed: 2026-02-28*
*Ready for roadmap: yes*
