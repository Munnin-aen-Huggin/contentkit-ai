# Requirements: ContentKit AI

**Defined:** 2026-02-24
**Core Value:** A single landing page that converts visitors into buyers of a high-value digital marketing toolkit — with zero ongoing costs and maximum profit margins.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Product

- [ ] **PROD-01**: 500+ AI marketing prompts organized by category (ads, emails, social, landing pages, SEO, brand strategy, product launch, video scripts)
- [ ] **PROD-02**: Each prompt includes context, variables to customize, and expected output description
- [ ] **PROD-03**: Prompts formatted as professional PDF document with table of contents and category sections
- [ ] **PROD-04**: Notion template pack with content calendar (30-day and 90-day)
- [ ] **PROD-05**: Notion template pack with brand strategy workspace
- [ ] **PROD-06**: Notion template pack with campaign planner
- [ ] **PROD-07**: Two product tiers: Starter (200+ prompts, $27) and Full Kit (500+ prompts + all Notion templates, $47)
- [ ] **PROD-08**: Lead magnet PDF: "5 AI Prompts That Replace a $5K Copywriter" with real example outputs

### Landing Page

- [ ] **PAGE-01**: Hero section with compelling headline, subheadline, primary CTA, and social proof counter
- [ ] **PAGE-02**: "Sound Familiar?" Before/After comparison section showing pain vs. solution
- [ ] **PAGE-03**: "What's Inside" product showcase with 9 category cards showing what's included
- [ ] **PAGE-04**: Sample prompt preview section showing a real prompt from the kit
- [ ] **PAGE-05**: Testimonials section with minimum 3 customer testimonials with names, roles, and star ratings
- [ ] **PAGE-06**: Two-tier pricing section with anchoring (crossed-out original price), "Most Popular" badge on Full Kit
- [ ] **PAGE-07**: FAQ accordion section with 5+ common questions
- [ ] **PAGE-08**: "Who this is NOT for" section to build trust and filter buyers
- [ ] **PAGE-09**: Final CTA section with urgency and guarantee messaging
- [ ] **PAGE-10**: Sticky nav with logo and CTA button
- [ ] **PAGE-11**: Footer with copyright, terms, privacy, contact links
- [ ] **PAGE-12**: Mobile-responsive design that works on all screen sizes
- [ ] **PAGE-13**: Page loads in under 2 seconds on 3G connection
- [ ] **PAGE-14**: SEO meta tags (title, description) and Open Graph tags for social sharing

### Email Funnel

- [ ] **MAIL-01**: Email capture form embedded on landing page via Kit JavaScript embed
- [ ] **MAIL-02**: Lead magnet PDF delivered instantly via Kit automation after opt-in
- [ ] **MAIL-03**: 5-email welcome/nurture sequence in Kit that leads to purchase
- [ ] **MAIL-04**: Email sequence includes: (1) lead magnet delivery, (2) value/credibility, (3) product introduction, (4) social proof/case study, (5) urgency/final offer
- [ ] **MAIL-05**: Stripe buyer automatically tagged in Kit via Zapier automation (checkout.session.completed → Kit add subscriber with "buyer" tag)

### Checkout & Delivery

- [ ] **PAY-01**: Two Stripe Payment Links created in Stripe Dashboard ($27 Starter, $47 Full Kit)
- [ ] **PAY-02**: Post-purchase redirect to thank-you/download page
- [ ] **PAY-03**: Webhook-based delivery: Zapier listens for Stripe charge → Kit sends download email with product links
- [ ] **PAY-04**: Thank-you page displays download instructions and links
- [ ] **PAY-05**: Order confirmation email sent via Kit with download links

### Infrastructure

- [ ] **INFRA-01**: Site hosted on Cloudflare Pages (free tier, unlimited bandwidth)
- [ ] **INFRA-02**: Git-based deploy pipeline (push to GitHub → auto-deploy to Cloudflare Pages)
- [ ] **INFRA-03**: Simple analytics tracking (Cloudflare Web Analytics or Plausible free)
- [ ] **INFRA-04**: Tailwind CSS v4 via standalone CLI for styling
- [ ] **INFRA-05**: Alpine.js v3 for interactive components (FAQ accordion, mobile menu)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Conversion Optimization

- **CONV-01**: A/B testing on headline and CTA copy
- **CONV-02**: Exit-intent popup with discount offer
- **CONV-03**: Live chat widget for pre-sale questions
- **CONV-04**: Video sales letter (VSL) on landing page

### Product Expansion

- **EXPN-01**: Industry-specific prompt packs (real estate, SaaS, e-commerce)
- **EXPN-02**: Monthly new prompt drops for existing customers
- **EXPN-03**: Affiliate program for customers to earn commissions
- **EXPN-04**: Bundle deals with other digital creators

### Email Advanced

- **EMLA-01**: Post-purchase onboarding email sequence (5 emails)
- **EMLA-02**: Win-back sequence for leads who didn't buy
- **EMLA-03**: Segmentation by interest/industry

### Compliance

- **COMP-01**: EU VAT handling via merchant of record service
- **COMP-02**: GDPR cookie consent banner
- **COMP-03**: Terms of service and privacy policy pages

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom checkout/payment page | Stripe Payment Links handle this; no code needed |
| User accounts/login portal | Massive scope creep for a digital download product |
| Backend server/database | Static site + external services is the architecture |
| Mobile app | Web-only, static landing page |
| Real-time chat | Unnecessary complexity for v1 |
| Subscription model | One-time payment model for v1 |
| Auto-play video | Broken on mobile, production-heavy for faceless brand |
| Fake countdown timers | Destroys trust when detected; only use real deadlines |
| Blog/content marketing | Focus on paid traffic and direct sales first |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PROD-01 | Phase 1 — Product Assets | Pending |
| PROD-02 | Phase 1 — Product Assets | Pending |
| PROD-03 | Phase 1 — Product Assets | Pending |
| PROD-04 | Phase 1 — Product Assets | Pending |
| PROD-05 | Phase 1 — Product Assets | Pending |
| PROD-06 | Phase 1 — Product Assets | Pending |
| PROD-07 | Phase 1 — Product Assets | Pending |
| PROD-08 | Phase 1 — Product Assets | Pending |
| INFRA-01 | Phase 2 — Infrastructure | Pending |
| INFRA-02 | Phase 2 — Infrastructure | Pending |
| INFRA-04 | Phase 2 — Infrastructure | Pending |
| INFRA-05 | Phase 2 — Infrastructure | Pending |
| PAY-01 | Phase 2 — Infrastructure | Pending |
| MAIL-01 | Phase 3 — Email Automation | Pending |
| MAIL-02 | Phase 3 — Email Automation | Pending |
| MAIL-03 | Phase 3 — Email Automation | Pending |
| MAIL-04 | Phase 3 — Email Automation | Pending |
| MAIL-05 | Phase 3 — Email Automation | Pending |
| PAY-03 | Phase 3 — Email Automation | Pending |
| PAY-05 | Phase 3 — Email Automation | Pending |
| PAGE-01 | Phase 4 — Front-End Build | Pending |
| PAGE-02 | Phase 4 — Front-End Build | Pending |
| PAGE-03 | Phase 4 — Front-End Build | Pending |
| PAGE-04 | Phase 4 — Front-End Build | Pending |
| PAGE-05 | Phase 4 — Front-End Build | Pending |
| PAGE-06 | Phase 4 — Front-End Build | Pending |
| PAGE-07 | Phase 4 — Front-End Build | Pending |
| PAGE-08 | Phase 4 — Front-End Build | Pending |
| PAGE-09 | Phase 4 — Front-End Build | Pending |
| PAGE-10 | Phase 4 — Front-End Build | Pending |
| PAGE-11 | Phase 4 — Front-End Build | Pending |
| PAGE-12 | Phase 4 — Front-End Build | Pending |
| PAGE-13 | Phase 4 — Front-End Build | Pending |
| PAGE-14 | Phase 4 — Front-End Build | Pending |
| PAY-02 | Phase 4 — Front-End Build | Pending |
| PAY-04 | Phase 4 — Front-End Build | Pending |
| INFRA-03 | Phase 5 — Launch Readiness | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after roadmap creation*
