# Project Research Summary

**Project:** ContentKit AI — faceless digital product business
**Domain:** Static landing page + email capture funnel + Stripe Payment Links + digital delivery (AI prompt packs + Notion templates)
**Researched:** 2026-02-24
**Confidence:** HIGH (stack and architecture verified via official docs; features and pitfalls corroborated across multiple practitioner sources)

## Executive Summary

ContentKit AI is a zero-backend digital product funnel selling two-tier AI prompt packs and Notion templates ($27/$47) to solopreneurs, freelancers, and agency owners. The established expert approach for this product type is a composition of external services — static HTML hosted on a CDN, Stripe Payment Links for checkout, Kit (ConvertKit) for email capture and delivery, and no custom backend code of any kind. This is not a simplification; it is the correct architecture for the problem. Any engineering complexity beyond this scope (authentication, custom checkout, user accounts, server-side APIs) is scope creep that adds cost and risk without improving conversion outcomes.

The recommended approach is to build everything in the correct dependency order: define the product positioning and collect beta testimonials before writing landing page copy, configure Stripe and Kit automations before driving any traffic, and test the full purchase-to-delivery flow end-to-end with a real charge before public launch. The single most dangerous technical assumption to avoid is treating the Stripe Payment Link success redirect as the fulfillment mechanism — it is not. Product delivery must be driven by a Stripe webhook or a third-party automation (Zapier/Make) that fires independently of whether the buyer's browser completes the redirect.

The primary business risk is commoditization: the AI prompt market is flooded with free alternatives, and a generic "100 marketing prompts" pack will not convert at premium prices. The positioning must be locked around a specific buyer, specific outcome, and documented results before any landing page copy is written. Everything else in this project — the stack, the features, the architecture — is well-documented, low-risk, and executes quickly once the product is correctly positioned.

---

## Key Findings

### Recommended Stack

The stack is deliberately minimal. Vanilla HTML5, Tailwind CSS v4 (CLI standalone, no Node project required), and Alpine.js v3 for micro-interactions constitute the front end. Cloudflare Pages (free tier, unlimited bandwidth, commercial use permitted) replaces Netlify as the clear hosting choice after Netlify's September 2025 pricing shift to credit-based billing. Kit free plan handles email capture and automation up to 10,000 subscribers. Stripe Payment Links require zero backend and handle PCI compliance, Apple Pay/Google Pay, and post-purchase redirects natively.

The project should have no npm dependencies in production. The Tailwind CLI binary compiles CSS; Alpine.js loads via CDN script tag. The entire product delivery chain — from opt-in to email to download — runs through third-party services that own their own infrastructure.

**Core technologies:**
- HTML5 + Tailwind CSS v4: page structure and styling — zero framework overhead for a 2-page static site
- Alpine.js v3: micro-interactions (modals, FAQ accordions, mobile menu) — 15 kB, no build step
- Cloudflare Pages (free): static hosting + global CDN — unlimited bandwidth, commercial use, 500 builds/month
- Kit (ConvertKit) free: email list, lead magnet delivery, nurture sequences — 10K subscriber free tier
- Stripe Payment Links: hosted checkout for $27/$47 tiers — no backend, no SDK, PCI compliant out of the box

**Avoid:** Vercel (prohibits commercial use on free tier), Netlify (30 GB effective free bandwidth after 2025 pricing change), Next.js/React (40-130 kB JS overhead for a static page), MailerLite free (capped at 500 subscribers as of September 2025), Google Drive for PDF delivery (rate limits and broken public share links).

### Expected Features

The full feature set is documented in `.planning/research/FEATURES.md`. The prioritization is clear: every P1 feature has HIGH user value and LOW-MEDIUM implementation cost. The differentiators are not technical — they are copywriting and positioning decisions.

**Must have for launch (P1):**
- Benefit-led hero headline + subheadline + CTA — first 3 seconds determine bounce
- Product mockup visual — makes the intangible feel real; directly impacts perceived value
- "What's Inside" deliverable breakdown — buyers must know what they're purchasing before pricing
- "Who this is for / who this is not for" section — specificity converts the right buyer and disqualifies the wrong one
- 3–5 specific, outcome-based testimonials — minimum social proof for cold traffic; faceless brand has no personal credibility as substitute
- Two-tier pricing section with Stripe Payment Links — the conversion event; must work on mobile
- Money-back guarantee badge + linked refund policy page — removes final objection at checkout
- FAQ section (5–7 questions) — objection removal at the decision point
- Lead magnet opt-in form (name + email only) — primary funnel entry; additional fields reduce opt-in rate
- Automated lead magnet delivery email — instant delivery on opt-in; any delay breaks trust
- Privacy Policy, Terms of Service, Refund Policy pages — legal prerequisite before collecting emails or displaying guarantee
- Mobile-responsive, fast-loading layout — majority of cold traffic is mobile

**Should have after validation (P2):**
- 5-email welcome sequence — converts leads who didn't buy immediately; 2-3x lift over single follow-up
- Authentic urgency framing — date-anchored launch pricing, not a resetting countdown timer
- Social proof counter — only when buyer/subscriber count is real (50+)
- One free sample prompt visible on page — removes the "is this AI slop?" objection

**Defer to v2+:**
- Affiliate/referral program — requires tracking infrastructure; premature before product-market fit
- Blog/SEO content — high time investment; bandwidth better spent on funnel until initial validation
- User accounts/login portal — entire product delivery is via email; accounts add backend complexity with no benefit
- Video testimonials/VSL — high production effort for a faceless brand

### Architecture Approach

The architecture is a composition of four independently operated external services stitched together with URLs and JavaScript embeds. There is no shared backend, no server, and no database. The landing page (`index.html`) drives email opt-ins through a Kit embed. The sales page (`sales.html`) links directly to two Stripe Payment Link URLs. Stripe redirects buyers to `thank-you.html?session_id={CHECKOUT_SESSION_ID}` after checkout. Product delivery should go through Kit email (not the thank-you page HTML) to ensure delivery is independent of whether the buyer's browser completes the redirect.

**Major components:**
1. `index.html` — lead magnet landing page; Kit form embed; primary funnel entry point
2. `sales.html` — product sales page; two Stripe Payment Link buttons; both pricing tiers with visual comparison
3. `thank-you.html` — post-purchase confirmation; download access OR directs buyer to check email; Kit upsell opt-in
4. Kit automations — lead magnet delivery sequence (5 emails) + separate buyer post-purchase sequence; must be two distinct segments
5. Stripe Payment Links — two separate links ($27, $47); both redirect to `thank-you.html` with `{CHECKOUT_SESSION_ID}`
6. Stripe webhook + Zapier/Make — fires `checkout.session.completed` to trigger email delivery independent of redirect; critical gap to fill

**Build order mandated by architecture dependencies:**
Tailwind setup → index.html + Kit embed → Kit automations (test delivery) → sales.html → Stripe products + payment links → thank-you.html → Cloudflare Pages deploy + custom domain → end-to-end test with real charge.

### Critical Pitfalls

1. **Generic product positioning** — a "100 marketing prompts" pack is indistinguishable from free alternatives. Every prompt pack must name a specific buyer, specific outcome, and documented time/money result. Fix in the product definition phase, before any copy is written.

2. **Fulfillment via Stripe redirect only** — Stripe explicitly warns against using the success redirect as the fulfillment mechanism. Buyers who close the tab, experience network errors, or use delayed payment methods (EU bank debits) receive nothing. Always configure a server-side webhook or Zapier automation as the authoritative delivery trigger.

3. **No social proof at launch** — a faceless brand has no personal credibility as a trust substitute. Testimonials must be collected from 10–20 beta users before public traffic is sent to the page. A launch with empty or vague testimonials ("great product!") will convert at sub-1% on cold traffic.

4. **Lead magnet that doesn't pre-sell the paid product** — a free PDF that fully resolves the reader's curiosity removes purchase urgency. The lead magnet must demonstrate the methodology, stop short of full implementation, and make the gap to the paid product obvious and painful.

5. **Weak pricing architecture** — two tiers presented without anchoring or urgency default to "I'll think about it." Add a visible anchor (crossed-out price, or $97 agency tier as a decoy) and a real date-anchored urgency mechanism (launch pricing window).

---

## Implications for Roadmap

Based on the combined research, five phases are suggested in the following order:

### Phase 1: Product Definition and Beta Validation

**Rationale:** The biggest risk in this project is not technical — it is positioning. Generic prompt packs fail to convert regardless of how good the landing page is. This phase locks the product before any copy, code, or automations are built. It also collects the social proof that is a hard dependency for launch (PITFALLS.md: Pitfalls 1, 2, 4).

**Delivers:**
- Specific product positioning: one buyer persona, one specific outcome, one price point anchor
- Lead magnet designed to pre-sell the paid product (not just attract subscribers)
- 5–10 specific, outcome-based beta testimonials
- Finalized product assets: prompt pack (with sample outputs) + Notion template ready to deliver

**Addresses:** Table stakes features that require finished assets (product mockup, "What's Inside", testimonials, product preview prompt on page)

**Avoids:** Pitfall 1 (generic positioning), Pitfall 2 (lead magnet mismatch), Pitfall 4 (zero social proof at launch)

---

### Phase 2: Technical Infrastructure

**Rationale:** Stripe and Kit must be configured and end-to-end tested before the sales page is finalized. Stripe Payment Link URLs must be real to embed in HTML. Kit automations must be verified before driving traffic. The webhook/Zapier delivery layer must be built and tested with a real charge before public launch (PITFALLS.md: Pitfall 3; ARCHITECTURE.md: Build Order).

**Delivers:**
- Cloudflare Pages deployment pipeline (Git push-to-deploy)
- Two Stripe Payment Links ($27, $47) with post-purchase redirect configured
- Stripe webhook or Zapier automation: `checkout.session.completed` → Kit email delivery
- Kit account: lead magnet form, lead magnet delivery automation, two separate sequences (Leads vs. Buyers)
- Email domain authenticated (SPF, DKIM, DMARC) and deliverability verified
- End-to-end test: opt-in → lead magnet delivery + full purchase → delivery email (both tiers)

**Uses:** Cloudflare Pages (STACK.md), Stripe Payment Links (STACK.md), Kit free plan (STACK.md)

**Avoids:** Pitfall 3 (fulfillment via redirect only), PITFALLS.md email deliverability trap

**Research flag:** Stripe webhook configuration in a static site context — particularly the Zapier/Make automation pattern for `checkout.session.completed` → Kit email delivery. Standard pattern but verify current Zapier template availability for this specific trigger/action pair.

---

### Phase 3: Landing Page and Sales Page Build

**Rationale:** The front-end build happens after product assets and infrastructure are ready. Stripe links are already real (embedded directly), testimonials are already collected (required for the social proof section), and the product preview prompt is already chosen. This phase has no creative unknowns — it is execution (ARCHITECTURE.md: Build Order steps 1-6; FEATURES.md: P1 feature list).

**Delivers:**
- `index.html`: lead magnet landing page with Kit form embed, benefit-led hero, social proof, FAQ
- `sales.html`: sales page with both pricing tiers, Stripe Payment Link buttons, "What's Inside" breakdown, pricing anchoring, urgency framing, guarantee badge
- `thank-you.html`: post-purchase confirmation page; instructs buyer to check email for delivery
- Legal pages: Privacy Policy, Terms of Service, Refund Policy
- Compiled Tailwind CSS (CLI standalone), Alpine.js for modals/FAQ, mobile-first responsive layout
- Page load time validated under 3 seconds on mobile

**Implements:** URL-stitched third-party composition pattern (ARCHITECTURE.md), Kit form embed pattern, two separate Stripe Payment Links per tier

**Avoids:** Navigation menu on landing page (removes purchase momentum), multiple competing CTAs, price reveal before problem agitation (PAS/AIDA structure), long-form copy for sub-$50 product (under 1,200 words)

**Research flag:** Standard patterns throughout — no deeper research needed. Tailwind v4 CLI and Alpine.js v3 are well-documented. Stripe Payment Link embed is a hyperlink.

---

### Phase 4: Copy, Positioning, and Conversion Optimization

**Rationale:** Conversion copywriting requires separate attention from the structural build. After the page structure exists, copy can be evaluated, stress-tested, and iterated independently. This phase applies the "Before/After" framing, pricing anchoring, and objection removal systematically across the full page (FEATURES.md: differentiators; PITFALLS.md: Pitfall 5, UX pitfalls).

**Delivers:**
- Headline A/B variants ready for testing (minimum 2 hero headline treatments)
- Pricing section reviewed against anchoring checklist: anchor price or $97 decoy tier added
- Authentic urgency framing: launch pricing window with real end date
- "Before/After" outcome framing applied throughout (not just hero)
- Commoditization objection addressed: sample output and documented time/result saving on page
- Each testimonial passes the "so what?" specificity test

**Avoids:** Pitfall 5 (weak pricing architecture), Pitfall 1 (generic copy / commodity positioning), "Looks Done But Isn't" checklist items

---

### Phase 5: Launch Readiness and Post-Launch Iteration

**Rationale:** A final verification phase before driving paid or organic traffic prevents recoverable mistakes from becoming expensive ones. Post-launch, the 5-email welcome sequence and social proof counter are added as conversion rates confirm product-market fit (PITFALLS.md: "Looks Done But Isn't" checklist; FEATURES.md: v1.x features).

**Delivers:**
- Full "Looks Done But Isn't" checklist verified: real charge end-to-end test, mobile purchase flow on physical device, deliverability to Gmail Primary and Outlook, Notion template duplication tested, analytics events confirmed, all links validated after deployment
- GA4 (or equivalent) configured with `purchase` and `lead_magnet_download` events
- 5-email welcome sequence built in Kit (lead segment): Day 0 PDF delivery → Day 2 engagement → Day 4 social proof → Day 6 soft pitch → Day 9 hard pitch with urgency
- Social proof counter added when subscriber/buyer count reaches 50+ (real number only)
- Paid traffic budget allocated: minimum 200 visits to validate headline conversion before broader spend

**Avoids:** Stripe test mode in production, broken delivery on launch day, GDPR compliance gaps for EU traffic

---

### Phase Ordering Rationale

- **Product definition before code:** Pitfalls 1, 2, and 4 are all pre-code failures. Starting with the landing page before the product is positioned and testimonials are collected is the most common failure mode for this product type.
- **Infrastructure before HTML:** Stripe Payment Link URLs must be real to embed in `sales.html`. Kit automations must be tested before traffic arrives. Building HTML with placeholder payment links creates a false sense of completion.
- **Structure before copy:** The page's wireframe and component structure can be built with placeholder copy, but the conversion-critical copy (headline, pricing, objection handling) requires deliberate iteration on top of a working structure.
- **Verification before traffic:** Every unverified assumption costs money when paid traffic runs. The "Looks Done But Isn't" checklist items are specifically the ones that feel complete but aren't — they must be verified with real conditions (real charge, physical mobile device, fresh Notion account).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Technical Infrastructure):** The Zapier/Make automation pattern for Stripe `checkout.session.completed` → Kit email delivery — verify current template availability and exact field mapping. Low complexity but should be confirmed before committing to this approach over a Cloudflare Worker-based solution.
- **Phase 2 (Technical Infrastructure):** EU VAT compliance — if EU customer volume is material, Stripe Payment Links do not handle EU VAT/GST automatically. Lemon Squeezy as merchant of record is the alternative. This decision should be made before the first sale.

Phases with standard patterns (skip deeper research):
- **Phase 3 (Front-End Build):** Tailwind CSS v4 CLI, Alpine.js v3, and Cloudflare Pages are all well-documented with official docs verified HIGH confidence. No research needed during planning.
- **Phase 1 (Product Definition):** No technical research needed. This is a copywriting and product strategy exercise.
- **Phase 4 (Copy):** Standard conversion copywriting patterns (PAS, AIDA, anchoring) are well-documented. No research needed.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core technologies verified against official docs (Tailwind v4, Stripe Payment Links, Cloudflare Pages, Kit pricing). Version compatibility confirmed. The one caveat: Kit's 10K free subscriber limit was sourced from a third-party review site, not Kit's own pricing page — verify at kit.com/pricing before committing. |
| Features | MEDIUM-HIGH | P1 feature list is well-corroborated across multiple conversion optimization sources. Specific conversion lift numbers (34% from testimonials, 12% from guarantee) are directional, not precise — do not treat them as benchmarks. |
| Architecture | HIGH | Architecture patterns verified against official Stripe and Kit documentation. The critical gap (Stripe → Kit buyer tagging requires Zapier/Make) is confirmed by the absence of native integration. Build order is verified as the correct dependency sequence. |
| Pitfalls | MEDIUM | Critical pitfalls 1–3 are HIGH confidence (commoditization risk is market-observable; Stripe fulfillment warning is from official Stripe docs; social proof requirement is universal for faceless brands). Pitfalls 4–5 are MEDIUM confidence (practitioner sources, conversion statistics are directional). |

**Overall confidence:** HIGH — sufficient to begin roadmap planning without additional research. The two flags in Phase 2 (Zapier pattern verification, EU VAT decision) should be resolved during Phase 2 planning, not before roadmap creation.

### Gaps to Address

- **Kit subscriber limit:** Verify current free plan limit at kit.com/pricing before first email. The researched figure (10,000) is from a third-party review; Kit may have adjusted terms.
- **EU VAT decision:** Make an explicit decision before the first sale — Stripe Payment Links (manual VAT handling) or Lemon Squeezy (merchant of record). This cannot be deferred after revenue begins flowing.
- **Zapier vs. Cloudflare Worker for webhook delivery:** Both are viable. Zapier is simpler but adds a third-party dependency; a Cloudflare Worker is in the existing infrastructure. Decide during Phase 2 planning based on current Zapier template availability.
- **Notion template hosting:** Test "Duplicate to Notion" link from a fresh account before finalizing delivery mechanism. Some Notion share configurations require the recipient to have a Notion account — verify this does not create a barrier for buyers.

---

## Sources

### Primary (HIGH confidence)
- Tailwind CSS v4 official release blog: https://tailwindcss.com/blog/tailwindcss-v4
- Stripe Payment Links post-payment docs: https://docs.stripe.com/payment-links/post-payment
- Stripe webhook fulfillment warning: https://docs.stripe.com/webhooks/handling-payment-events
- Stripe Payment Links URL parameters: https://docs.stripe.com/payment-links/url-parameters
- Cloudflare Pages limits and pricing: https://developers.cloudflare.com/pages/platform/limits/
- Kit form embedding docs: https://help.kit.com/en/articles/4009572-form-embedding-basics
- MailerLite free plan update (500 subscriber cap): https://www.mailerlite.com/help/free-plan-update-faq
- Netlify credit-based pricing (September 2025): https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- Alpine.js official site: https://alpinejs.dev/

### Secondary (MEDIUM confidence)
- Kit pricing (via emailtooltester.com, 2026): https://www.emailtooltester.com/en/reviews/convertkit/pricing/ — 10K free subscriber limit (verify directly)
- Branded Agency — anatomy of high-converting landing page (2026): https://www.brandedagency.com/blog/the-anatomy-of-a-high-converting-landing-page-14-powerful-elements-you-must-use-in-2026
- WiserNotify — social proof tactics: https://wisernotify.com/blog/social-proof-marketing/
- GlockApps — lead magnet email sequence: https://glockapps.com/blog/how-to-build-a-lead-magnet-email-sequence-that-converts-strategies-and-examples/
- Shopify — psychological pricing and anchoring: https://www.shopify.com/blog/psychological-pricing
- Azura Magazine — faceless marketing trust signals: https://azuramagazine.com/articles/faceless-marketing-how-to-build-trust-with-branding
- PathPages — Notion template delivery patterns: https://pathpages.com/blog/sell-notion-templates
- Reply.io — email deliverability (SPF/DKIM/DMARC): https://reply.io/email-deliverability-best-practices-and-mistakes/

### Tertiary (LOW confidence)
- Medium / The Wounded Tiger — selling AI prompt packs in 2025 (access blocked): https://medium.com/@takudzwarukanda/i-tried-selling-ai-prompt-packs-in-2025 — finding: specificity beats generic packs; needs independent validation

---
*Research completed: 2026-02-24*
*Ready for roadmap: yes*
