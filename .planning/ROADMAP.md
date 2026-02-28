# Roadmap: ContentKit AI

## Overview

ContentKit AI ships as a five-phase project: build the digital product first (before any code), stand up the infrastructure and payment pipeline, wire the email automations, construct every page, then verify the full purchase-to-delivery chain before driving paid traffic. Each phase delivers one complete, independently verifiable capability. Nothing from a later phase is needed to verify an earlier one.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Product Assets** - Create and finalize all deliverable product files before any code is written ✓ (2026-02-25)
- [x] **Phase 2: Infrastructure** - Deploy pipeline, Lemon Squeezy checkout links, and GitHub Pages hosting live and verified ✓ (2026-02-25)
- [x] **Phase 3: Email Automation** - Kit capture forms, lead magnet delivery, nurture sequence, and buyer tagging wired end-to-end ✓ (2026-02-26)
- [x] **Phase 4: Front-End Build** - All pages (index, sales, thank-you, legal) built, styled, and connected to live services ✓ (2026-02-27)
- [x] **Phase 5: Launch Readiness** - Analytics configured, Plausible goals + Stripe redirects live, pre-launch action items documented ✓ (2026-02-28)

## Phase Details

### Phase 1: Product Assets

**Goal**: All deliverable product files exist, are ready to send to buyers, and the lead magnet is designed to pre-sell the paid product
**Depends on**: Nothing (first phase)
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06, PROD-07, PROD-08
**Success Criteria** (what must be TRUE):
  1. A PDF prompt pack exists with 500+ prompts organized into the 8 named categories, each prompt having context, variables, and expected output — ready to attach to an email or host as a download link
  2. A separate Starter tier subset exists with 200+ prompts that matches the $27 price point description (PROD-07)
  3. Three Notion templates exist as duplicatable Notion pages: 30-day content calendar, 90-day content calendar, brand strategy workspace, and campaign planner — all tested with a fresh Notion account to confirm duplication works
  4. The lead magnet PDF ("5 AI Prompts That Replace a $5K Copywriter") exists with real example outputs, stops short of full implementation, and ends with a clear gap pointing to the paid product
  5. All product asset URLs/file paths are documented and ready to embed in Kit automation emails
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Write Full Kit (500+ prompts) and Starter tier (200 prompts) content files
- [ ] 01-02-PLAN.md — Build four Notion templates (spec + human build + duplication verification)
- [ ] 01-03-PLAN.md — Write lead magnet PDF content and asset manifest for Phase 3
- [ ] 01-04-PLAN.md — Convert content .md files to styled PDFs using md-to-pdf; update asset manifest

---

### Phase 2: Infrastructure

**Goal**: The technical foundation is live — Cloudflare Pages deploys on git push, Stripe Payment Links exist with correct redirect URLs, and the local build toolchain works
**Depends on**: Phase 1 (Stripe Payment Link success URL needs thank-you page URL; product tier definitions finalized)
**Requirements**: INFRA-01, INFRA-02, INFRA-04, INFRA-05, PAY-01
**Success Criteria** (what must be TRUE):
  1. Pushing a commit to GitHub automatically deploys the site to Cloudflare Pages (the deploy URL is live and accessible)
  2. Two Stripe Payment Links exist in the Stripe Dashboard ($27 Starter, $47 Full Kit), each configured to redirect to the thank-you page URL after purchase
  3. Tailwind CSS v4 CLI compiles a stylesheet locally without a Node project or npm install
  4. Alpine.js v3 loads from CDN in the project's HTML and the FAQ accordion interactive example works in a browser
  5. The Cloudflare Pages deployment URL resolves and serves the site without errors
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Download Tailwind v4 CLI, compile output.css, update index.html (swap CDN → compiled CSS + Alpine.js), create thank-you.html stub
- [ ] 02-02-PLAN.md — Create GitHub repository, connect Cloudflare Pages, verify push-to-deploy pipeline
- [ ] 02-03-PLAN.md — Create two Stripe Payment Links ($27 Starter, $47 Full Kit) with redirect to thank-you.html

---

### Phase 3: Email Automation

**Goal**: The full email funnel runs without manual intervention — opt-in delivers lead magnet instantly, nurture sequence runs over 9 days, and buyer tagging fires independently of whether the buyer's browser completes the Lemon Squeezy redirect
**Depends on**: Phase 1 (lead magnet PDF URL), Phase 2 (GitHub Pages URL for form target, Lemon Squeezy checkout URLs)
**Requirements**: MAIL-01, MAIL-02, MAIL-03, MAIL-04, MAIL-05, PAY-03, PAY-05
**Success Criteria** (what must be TRUE):
  1. Submitting the Kit opt-in form triggers an automated email delivering the lead magnet PDF within 60 seconds
  2. The 5-email nurture sequence is configured in Kit for the lead segment: Day 0 (PDF delivery), Day 2 (value/credibility), Day 4 (product intro), Day 6 (social proof), Day 9 (urgency/final offer)
  3. After a Lemon Squeezy purchase, the buyer receives an order confirmation email with download links — delivered via Lemon Squeezy automatically
  4. Lemon Squeezy buyers are automatically tagged with the "buyer" tag in Kit
  5. The lead segment and buyer segment are two distinct, non-overlapping sequences in Kit
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md — Kit account setup, form + tags + automation, write nurture email copy, embed form on landing page
- [ ] 03-02-PLAN.md — Configure 5-email nurture sequence in Kit and verify with test subscriber
- [ ] 03-03-PLAN.md — Build and deploy Netlify Function webhook for Lemon Squeezy → Kit buyer tagging

---

### Phase 4: Front-End Build

**Goal**: Every page of the funnel exists as finished HTML — the lead magnet landing page, the sales page, the thank-you/download page, and the legal pages — all connected to live Kit forms and Stripe Payment Links, mobile-responsive, and loading under 2 seconds on 3G
**Depends on**: Phase 2 (real Stripe Payment Link URLs to embed), Phase 3 (Kit form embed code), Phase 1 (product assets for "What's Inside" content, sample prompt, testimonials ready)
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08, PAGE-09, PAGE-10, PAGE-11, PAGE-12, PAGE-13, PAGE-14, PAY-02, PAY-04
**Success Criteria** (what must be TRUE):
  1. The landing page (`index.html`) loads with hero, Before/After section, product showcase, sample prompt preview, testimonials, pricing, FAQ, "Who this is NOT for" section, final CTA, sticky nav, and footer — all visible on mobile and desktop without horizontal scroll
  2. The sales page pricing section displays both tiers ($27 Starter, $47 Full Kit) with crossed-out anchor price and "Most Popular" badge, and each "Buy Now" button is a live Stripe Payment Link
  3. The thank-you page (`thank-you.html`) displays download instructions and directs the buyer to check their email for product links — accessible via the Stripe redirect URL
  4. Legal pages (Privacy Policy, Terms of Service, Refund Policy) exist and are linked from the footer
  5. Google PageSpeed Insights (mobile) reports the page loads in under 2 seconds on a 3G simulation, and all Open Graph and SEO meta tags are present and correct when tested with a social preview tool
**Plans**: 4 plans

Plans:
- [ ] 04-01-PLAN.md — Complete index.html: add sample prompt preview + "Who This Is NOT For" sections, wire Stripe Payment Links, add OG/SEO meta tags, fix render-blocking fonts, update footer links
- [ ] 04-02-PLAN.md — Build complete thank-you.html with purchase confirmation, download instructions, and consistent branding
- [ ] 04-03-PLAN.md — Create three legal pages (privacy-policy.html, terms-of-service.html, refund-policy.html)
- [ ] 04-04-PLAN.md — Recompile Tailwind CSS, create OG image, verify complete front-end, configure Stripe redirects

---

### Phase 5: Launch Readiness

**Goal**: The full purchase-to-delivery funnel is verified with real conditions (real charge, physical mobile device, fresh Notion account), analytics are tracking conversion events, and the site is cleared for paid traffic
**Depends on**: Phase 4 (all pages live), Phase 3 (automations live)
**Requirements**: INFRA-03
**Success Criteria** (what must be TRUE):
  1. A real Stripe charge (using a real card, not test mode) completes and the buyer receives the order confirmation email with download links — verified end-to-end before any paid traffic is sent
  2. The entire mobile purchase flow (landing page → opt-in → email → sales page → Stripe checkout → thank-you page) completes without errors on a physical iOS or Android device
  3. Plausible Analytics is active, page views are recording, and conversion events (opt-in, purchase) are visible in the dashboard
  4. All page links, navigation buttons, and Stripe Payment Link URLs are verified as working on the live GitHub Pages production domain (not localhost)
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md — Analytics configuration and pre-launch setup: ad tracking ID decision, Plausible goal creation, Stripe redirect configuration with ?tier= parameters
- [ ] 05-02-PLAN.md — End-to-end verification checklist: real charge test, mobile device flow, email deliverability, link audit, go/no-go decision

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Product Assets | 4/4 | ✓ Complete | 2026-02-25 |
| 2. Infrastructure | 3/3 | ✓ Complete | 2026-02-25 |
| 3. Email Automation | 3/3 | ✓ Complete | 2026-02-26 |
| 4. Front-End Build | 4/4 | ✓ Complete | 2026-02-27 |
| 5. Launch Readiness | 2/2 | ✓ Complete | 2026-02-28 |
