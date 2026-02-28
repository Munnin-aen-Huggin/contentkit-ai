# Requirements: ContentKit AI

**Defined:** 2026-02-28
**Core Value:** A single landing page that converts visitors into buyers of a high-value digital marketing toolkit — with zero ongoing costs and maximum profit margins.

## v1.1 Requirements

Requirements for Growth & Revenue milestone. Each maps to roadmap phases.

### Tracking Infrastructure

- [ ] **TRACK-01**: Real Google Ads Conversion ID replaces AW-XXXXXXXXXX placeholder across all 8 HTML files
- [ ] **TRACK-02**: Real Google Ads Conversion Label replaces CONVERSION_LABEL placeholder in thank-you.html
- [ ] **TRACK-03**: Real Meta Pixel ID replaces PIXEL_ID_HERE placeholder across all 8 HTML files
- [ ] **TRACK-04**: Thank-you page uses sessionStorage deduplication to prevent duplicate conversion events on page refresh
- [ ] **TRACK-05**: Privacy policy updated with real Google Ads and Meta Pixel tracking disclosures

### Ad Landing Pages

- [ ] **LP-01**: Dedicated Google Ads landing page (lp-google.html) with single CTA, no nav, message-matched to search intent
- [ ] **LP-02**: Dedicated Meta Ads landing page (lp-meta.html) with single CTA, no nav, message-matched to ad creative
- [ ] **LP-03**: Both landing pages include real Google Ads gtag and Meta Pixel tracking
- [ ] **LP-04**: Both landing pages are mobile-responsive and load under 2 seconds

### Email Automation

- [ ] **EMAIL-01**: Buyer removal from nurture sequence — when purchased-starter or purchased-full tag is applied, subscriber is removed from nurture sequence
- [ ] **EMAIL-02**: Post-purchase onboarding email sequence for Starter buyers (5 emails over 14 days: welcome + quick wins, deep dive prompt usage, advanced techniques, success stories, upsell to Full Kit)
- [ ] **EMAIL-03**: Post-purchase onboarding email sequence for Full Kit buyers (5 emails over 14 days: welcome + quick wins, deep dive, advanced techniques, success stories, community building)
- [ ] **EMAIL-04**: Win-back email sequence for non-converting leads (3 emails: value-first new content, social proof, time-anchored final offer) triggered after 60 days of inactivity
- [ ] **EMAIL-05**: Advanced segmentation in Kit: segments for active leads, cold leads (60+ days inactive), Starter buyers, Full Kit buyers
- [ ] **EMAIL-06**: Kit custom fields populated via webhook: product_tier, purchase_value, purchase_date

### Paid Advertising — Google Ads

- [ ] **GADS-01**: Google Ads account created and verified with business information
- [ ] **GADS-02**: Google Ads Search campaign live with 5 ad groups by keyword intent (AI marketing prompts, ChatGPT templates, AI copywriting, AI email, AI social media)
- [ ] **GADS-03**: Conversion action configured in Google Ads linked to real gtag conversion events
- [ ] **GADS-04**: Campaign running with $15/day budget on Manual CPC or Maximize Conversions bid strategy
- [ ] **GADS-05**: At least one conversion tracked in Google Ads dashboard within 7 days of launch

### Paid Advertising — Meta Ads

- [ ] **META-01**: Meta Business Manager account created and business verified
- [ ] **META-02**: Meta Pixel created with real Pixel ID wired into all HTML files
- [ ] **META-03**: Cold traffic conversion campaign live with interest + behavior targeting
- [ ] **META-04**: Campaign running with minimum $10/day budget
- [ ] **META-05**: At least one conversion tracked in Meta Events Manager within 7 days of launch

### Pre-Launch Verification

- [ ] **VERIFY-01**: Real Stripe charge ($147 Starter) completes end-to-end: payment → redirect → conversion events → Kit tagging → email receipt → refund
- [ ] **VERIFY-02**: Mobile purchase flow verified on physical device
- [ ] **VERIFY-03**: Lead magnet email delivers to Gmail and Outlook within 60 seconds, not in spam

## v1.2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Tracking

- **CAPI-01**: Meta Conversions API (server-side) via Netlify Function webhook extension
- **CAPI-02**: Google Enhanced Conversions via server-side webhook
- **CAPI-03**: Stripe checkout_session_id passed through to thank-you page for perfect event_id matching

### Retargeting

- **RETGT-01**: Meta retargeting campaign for site visitors (requires 1,000+ pixel events)
- **RETGT-02**: Google Ads remarketing lists for search ads (RLSA)

### Conversion Optimization

- **CRO-01**: A/B testing on headline and CTA copy
- **CRO-02**: Exit-intent popup with discount offer
- **CRO-03**: Video sales letter (VSL) on landing page

## Out of Scope

| Feature | Reason |
|---------|--------|
| Performance Max campaigns | Need 30-50 monthly conversions to train; premature at launch budget |
| Meta CAPI (server-side) | Browser pixel sufficient for launch; adds complexity with event_id threading |
| Discount-led win-back emails | 10% off $147 = $14.70 — not motivating for info products; value-first approach proven better |
| Landing page builder tools (Unbounce, Instapage) | Static HTML works fine; no need for $100/month tool at this stage |
| TikTok/YouTube/Pinterest ads | Focus on Google + Meta first; expand channels after proving ROI |
| Subscription/membership model | One-time payment model for v1.1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | Phase 6 | Pending |
| TRACK-02 | Phase 6 | Pending |
| TRACK-03 | Phase 6 | Pending |
| TRACK-04 | Phase 6 | Pending |
| TRACK-05 | Phase 6 | Pending |
| LP-01 | Phase 6 | Pending |
| LP-02 | Phase 6 | Pending |
| LP-03 | Phase 6 | Pending |
| LP-04 | Phase 6 | Pending |
| EMAIL-01 | Phase 7 | Pending |
| EMAIL-02 | Phase 7 | Pending |
| EMAIL-03 | Phase 7 | Pending |
| EMAIL-04 | Phase 7 | Pending |
| EMAIL-05 | Phase 7 | Pending |
| EMAIL-06 | Phase 7 | Pending |
| GADS-01 | Phase 8 | Pending |
| GADS-02 | Phase 8 | Pending |
| GADS-03 | Phase 8 | Pending |
| GADS-04 | Phase 8 | Pending |
| GADS-05 | Phase 8 | Pending |
| META-01 | Phase 8 | Pending |
| META-02 | Phase 8 | Pending |
| META-03 | Phase 8 | Pending |
| META-04 | Phase 8 | Pending |
| META-05 | Phase 8 | Pending |
| VERIFY-01 | Phase 9 | Pending |
| VERIFY-02 | Phase 9 | Pending |
| VERIFY-03 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after roadmap creation*
