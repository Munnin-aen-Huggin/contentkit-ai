# Roadmap: ContentKit AI

## Milestones

- v1.0 MVP Launch — Phases 1-5 (shipped 2026-02-28)
- v1.1 Growth & Revenue — Phases 6-9 (in progress)

## Phases

<details>
<summary>v1.0 MVP Launch (Phases 1-5) — SHIPPED 2026-02-28</summary>

- [x] Phase 1: Product Assets (4/4 plans) — completed 2026-02-25
- [x] Phase 2: Infrastructure (3/3 plans) — completed 2026-02-25
- [x] Phase 3: Email Automation (3/3 plans) — completed 2026-02-26
- [x] Phase 4: Front-End Build (4/4 plans) — completed 2026-02-27
- [x] Phase 5: Launch Readiness (2/2 plans) — completed 2026-02-28

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### v1.1 Growth & Revenue (In Progress)

**Milestone Goal:** Build growth infrastructure and launch paid marketing — post-purchase onboarding, win-back sequences, email segmentation, Google Ads + Meta Ads live with real budget, measurable revenue from at least 2 channels.

#### Phase 6: Tracking Infrastructure + Ad Landing Pages

**Goal**: Every conversion event fires accurately and paid traffic has dedicated pages to land on
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, LP-01, LP-02, LP-03, LP-04
**Success Criteria** (what must be TRUE):
  1. A test purchase on thank-you.html fires a Google Ads conversion event with the real Conversion ID/Label — verified in Google Tag Assistant
  2. A test purchase on thank-you.html fires a Meta Pixel Purchase event with the real Pixel ID — verified in Meta Pixel Helper
  3. Refreshing thank-you.html after a purchase does not fire duplicate conversion events (sessionStorage guard active)
  4. lp-google.html and lp-meta.html load under 2 seconds on mobile, have no site navigation, and contain a single CTA that links to the correct Stripe Payment Link
  5. Privacy policy page discloses Google Ads and Meta Pixel data collection
**Plans**: TBD

Plans:
- [ ] 06-01: Inject real Google Ads and Meta Pixel IDs into all HTML files + sessionStorage dedup on thank-you page
- [ ] 06-02: Build lp-google.html and lp-meta.html — dedicated ad landing pages
- [ ] 06-03: Update privacy policy with ad tracking disclosures

#### Phase 7: Email Automation

**Goal**: Every buyer gets the right onboarding email sequence and non-buyers have a win-back path — with zero overlap between nurture and onboarding
**Depends on**: Phase 6 (Netlify webhook custom field additions require real IDs deployed)
**Requirements**: EMAIL-01, EMAIL-02, EMAIL-03, EMAIL-04, EMAIL-05, EMAIL-06
**Success Criteria** (what must be TRUE):
  1. A test subscriber tagged purchased-starter receives the Starter onboarding sequence and is simultaneously removed from the nurture sequence — verified by Kit subscriber activity log
  2. A test subscriber tagged purchased-full-kit receives the Full Kit onboarding sequence and does not receive any further nurture emails
  3. Kit custom fields product_tier, purchase_value, and purchase_date are populated on a test subscriber's record after a webhook-triggered purchase event
  4. Kit shows 5 segments (Buyers-All, Buyers-Starter, Buyers-Full-Kit, Leads-Only, Cold-Subscribers) each filtering the correct subscriber population
  5. A test subscriber inactive for 60+ days with no buyer tag enters the win-back sequence and receives the 3-email flow
**Plans**: TBD

Plans:
- [ ] 07-01: Configure buyer suppression rule + extend Netlify webhook with custom fields
- [ ] 07-02: Build Starter and Full Kit post-purchase onboarding automations in Kit
- [ ] 07-03: Build Kit segments + win-back automation (requires Kit Creator plan upgrade)

#### Phase 8: Paid Ad Campaigns

**Goal**: Google Ads and Meta Ads campaigns are live, sending paid traffic to dedicated landing pages, with conversion tracking credited in both ad dashboards
**Depends on**: Phase 6 (real tracking IDs + landing pages), Phase 7 (buyer onboarding working before traffic volume increases)
**Requirements**: GADS-01, GADS-02, GADS-03, GADS-04, GADS-05, META-01, META-02, META-03, META-04, META-05
**Success Criteria** (what must be TRUE):
  1. Google Ads account shows a live Search campaign with 5 ad groups sending traffic to lp-google.html at a $15/day budget
  2. Meta Ads account shows a live Sales campaign with broad and interest ad sets sending traffic to lp-meta.html at a $10/day budget
  3. At least one conversion appears in the Google Ads Conversions dashboard within 7 days of campaign launch
  4. At least one conversion appears in Meta Events Manager within 7 days of campaign launch
  5. Both campaigns use Manual CPC bidding (not Smart Bidding) and ad copy contains no earnings or income claims
**Plans**: TBD

Plans:
- [ ] 08-01: Create Google Ads account + configure conversion action + build Search campaign
- [ ] 08-02: Create Meta Business Manager + verify business + create Pixel + build Sales campaign

#### Phase 9: Pre-Launch Verification

**Goal**: The entire purchase flow works end-to-end with a real charge before any ad budget is committed at scale
**Depends on**: Phase 6 (tracking), Phase 7 (email automation), Phase 8 (campaigns live)
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03
**Success Criteria** (what must be TRUE):
  1. A real $147 Stripe charge completes and triggers: thank-you page redirect, Google Ads conversion event, Meta Pixel Purchase event, Kit buyer tagging with custom fields populated, Stripe purchase confirmation email — and the charge is subsequently refunded
  2. The purchase flow completes without errors on a physical mobile device
  3. The Kit lead magnet delivery email arrives in both a Gmail inbox and an Outlook inbox within 60 seconds and is not in spam
**Plans**: TBD

Plans:
- [ ] 09-01: End-to-end real charge test + mobile verification + email deliverability check

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Product Assets | v1.0 | 4/4 | Complete | 2026-02-25 |
| 2. Infrastructure | v1.0 | 3/3 | Complete | 2026-02-25 |
| 3. Email Automation | v1.0 | 3/3 | Complete | 2026-02-26 |
| 4. Front-End Build | v1.0 | 4/4 | Complete | 2026-02-27 |
| 5. Launch Readiness | v1.0 | 2/2 | Complete | 2026-02-28 |
| 6. Tracking + Ad Pages | v1.1 | 0/3 | Not started | - |
| 7. Email Automation | v1.1 | 0/3 | Not started | - |
| 8. Paid Ad Campaigns | v1.1 | 0/2 | Not started | - |
| 9. Pre-Launch Verification | v1.1 | 0/1 | Not started | - |
