# Feature Research

**Domain:** Digital product growth & revenue — post-purchase lifecycle, email segmentation, paid acquisition (ContentKit AI v1.1)
**Researched:** 2026-02-28
**Confidence:** MEDIUM-HIGH (multi-source WebSearch; Kit-specific claims verified against official Kit help docs; paid ad benchmarks from 2026 industry sources)

---

## Scope Note

This document covers ONLY v1.1 features — the growth and revenue infrastructure being added to an already-shipped v1.0. The existing v1.0 funnel (landing page, lead magnet opt-in, 5-email nurture sequence Day 0/2/4/6/9, Stripe webhooks, Kit buyer tags, Plausible analytics, thank-you page) is the baseline. Everything below assumes those components are working.

**Existing infrastructure this research builds on:**
- Kit tags: `purchased-starter` (16547727), `purchased-full-kit` (16547728), `buyer` (16547729)
- Kit form: 9136765 (lead magnet opt-in)
- Stripe webhook → Netlify function → Kit tag (already live)
- Nurture sequence: 5 emails, Days 0/2/4/6/9 (already active)
- Plausible: Purchase, Email Signup, Purchase Click goals (already tracking)
- Google Ads pixel placeholder and Meta Pixel placeholder: already in `index.html` (need real IDs)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that are standard practice in mature digital product businesses. Missing these = leaving money on the table or burning list health.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Post-purchase onboarding email sequence (3–5 emails, Days 1/3/7/14) | Buyers who get zero follow-up after purchase report lower satisfaction and product usage. "Thank you + download link" alone is insufficient — buyers need confirmation they did the right thing and guidance to get value fast. Studies show 88% of customers are more likely to stay loyal when businesses invest in onboarding. | MEDIUM | Triggered by Kit `purchased-starter` or `purchased-full-kit` tag. Separate from nurture sequence. Must be NEW subscribers entering a NEW sequence, not re-entering the nurture sequence. |
| Buyer removal from nurture sequence | A buyer who receives nurture emails pitching the product they already bought feels unseen and unsubscribes. Kit's automation rules prevent this. | LOW | Kit Visual Automation: when `purchased-starter` or `purchased-full-kit` tag is applied, remove subscriber from lead-magnet-delivery sequence. This requires adding an automation step — not just a tag. |
| Win-back sequence for non-converters (3 emails, sent after Day 21–30) | Leads who completed the 9-day nurture and did not buy are the warmest non-buyers on the list. A separate re-engagement sequence (distinct from the nurture) is standard practice before these contacts go cold. | MEDIUM | Triggered by: subscribed + opened at least one email + NOT tagged as buyer + 21+ days since opt-in. Kit segments can define this group. |
| Engagement-based list segmentation | Emailing the entire list identically ignores behavior and crushes deliverability. Separating active (opened in 60 days) from cold (90+ days inactive) is a sender reputation requirement at scale. | MEDIUM | Kit tag-based approach: add `engaged` tag on click/open events; create segment excluding `engaged` for re-engagement flows. No paid Kit plan required for basic tag automation. |
| Dedicated ad landing page (separate from index.html) | Sending paid traffic to the homepage — which has a lead magnet opt-in and a sales page combined — splits conversion intent and degrades Quality Score in Google Ads. A dedicated page with single CTA converts 5–15% vs homepage 0.5–2%. | HIGH | New static HTML page, separate from `index.html`. Removes lead magnet opt-in, removes nav links, matches ad headline verbatim (message match). Single CTA: direct Stripe Payment Link. |
| Google Ads Search campaign (not Performance Max) | Search captures high-intent queries ("AI marketing prompts," "ChatGPT marketing prompts") that Performance Max cannot efficiently target on small budgets. Search campaigns convert at ~3.5% vs PMax ~1.5% at small scale. | HIGH | Requires: real Google Ads account, real Conversion ID to replace placeholder in `index.html`, keyword list, ad copy, negative keywords, bid strategy (Manual CPC to start). Budget: minimum $10–15/day during learning. |
| Meta Ads campaign (cold traffic awareness) | Meta reaches buyers who don't know they need AI marketing prompts yet — interest-based targeting (solopreneurs, digital marketing, content creators). Two-campaign structure: creative testing (20% budget) + winning ads (80% budget). | HIGH | Requires: real Meta Pixel ID to replace placeholder in `index.html`, ad creative (UGC-style performs best in 2026), campaign objective = Conversions. Budget: minimum $20–30/day during learning. |

---

### Differentiators (Competitive Advantage)

Features that go beyond standard practice and create meaningful lift for this specific business.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Tier-specific post-purchase sequences (Starter vs Full Kit) | Starter buyers ($27) need to see the path to Full Kit upsell while getting value. Full Kit buyers ($47) need to feel their premium purchase was correct. One generic sequence serves neither group well. Segmented sequences reduce post-purchase cognitive dissonance and open upsell revenue. | MEDIUM | Kit already has separate tags (`purchased-starter`, `purchased-full-kit`). Build two separate post-purchase sequences, each triggered by the appropriate tag. Starter sequence includes a Day-7 upsell email to Full Kit. |
| Win-back with content re-engagement (not just discount) | Most win-back sequences lead with a discount. For a $27–$47 product, a 10% discount ($2.70–$4.70) is not compelling. Leading with a new piece of value (a bonus prompt, a "what most people missed" email) outperforms pure discount offers for info products. | LOW | Sequence structure: Email 1 (Day 21) — new value/reminder. Email 2 (Day 25) — social proof + use case. Email 3 (Day 30) — final offer with time anchor. |
| Engagement scoring via Kit custom fields | Beyond binary engaged/inactive tagging, tracking a simple score (3-point scale: opened last 30 days = active, opened 31–90 days = warm, 90+ days = cold) enables fine-grained content targeting without expensive third-party tools. | MEDIUM | Achievable in Kit via automation rules on open events + custom field "engagement_level" with values "active," "warm," "cold." Requires Kit's visual automations to trigger on open events. |
| Ad landing page with lead magnet path (dual CTA) | The single-CTA ad landing page (buy now) will convert the ready buyer. A secondary escape hatch (free lead magnet) captures the "not ready yet" visitor back into the nurture funnel. This recovers traffic that would otherwise bounce to zero. | MEDIUM | Add a small secondary CTA below the fold: "Not ready to buy? Get the free 5-prompt guide first." Links to opt-in form. Does NOT remove the primary CTA from its dominant position. Replaces a full bounce with a list-building event. |
| UTM-tagged ad landing pages per campaign | Google Ads and Meta Ads traffic landing on separate UTM-parameter-aware pages (or even separate HTML files per campaign) allows Plausible to break revenue attribution by source without Google Analytics. | LOW | Plausible already captures UTM parameters. Create `/lp-google.html` and `/lp-meta.html` as ad-specific landing pages — identical content but separate URLs — for clean source attribution in Plausible. |
| Sunset automation for irreversibly cold subscribers | Subscribers who receive the win-back sequence and still do not engage should be suppressed (not deleted) from sends. This protects sender reputation (bounces and spam complaints degrade Kit deliverability for the entire list) and reduces Kit subscriber count toward plan limits. | LOW | Kit automation: after win-back sequence ends + no open/click, add tag `sunset-candidate`, exclude from all broadcasts. Option to delete after 90 days if not re-engaged. |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem like logical additions but create complexity, dilute effectiveness, or are premature for this stage.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Automated discount codes for win-back | Discounts feel like the standard win-back lever. | For a $27–$47 product, the discount itself ($2.70–$4.70) is too small to motivate action. Repeated discounting trains the list to wait for offers and cheapens the product positioning. | Lead with value content (new prompt, bonus resource) in Email 1. Reserve a modest urgency anchor ("for the next 48 hours") only in Email 3, tied to a real deadline, not a coupon code. |
| A/B testing ad landing pages before enough traffic | Split testing sounds data-driven. | With small ad budgets ($300–$600/month), statistical significance on a 5–15% conversion rate requires 400–800 visitors per variant. At $1–3 CPC, that is $400–$2,400 per variant before significance. Premature split testing wastes budget on inconclusive data. | Run a single best-hypothesis landing page for 60 days. Make iterative improvements based on scroll depth (Plausible) and conversion rate, not formal A/B tests. Switch to split testing only when spending $1,500+/month. |
| Performance Max campaigns (PMax) for this stage | Google pushes PMax as the default campaign type. | PMax requires substantial conversion data (30–50 conversions/month minimum) to train effectively. At a $147–$499 CPA for a digital product, this requires $4,410–$24,950/month in ad spend just to provide the learning signal. PMax on small budgets optimizes toward low-quality signals (views, partial scrolls) not purchases. | Use Search campaigns for high-intent keywords + Demand Gen for awareness. Add PMax only after 50+ purchase conversions are recorded in Google Ads. |
| Full marketing automation platform (Klaviyo, ActiveCampaign, HubSpot) | These platforms have more sophisticated behavioral triggers than Kit. | Kit already tags buyers and supports visual automations. Migrating to a new ESP at this stage means rebuilding all sequences, re-verifying the domain, risking deliverability dip during migration, and paying higher monthly cost. The marginal capability gain does not justify the migration cost at this scale. | Build all sequences within Kit using tags + visual automations + custom fields. Kit's free plan supports 1,000 subscribers; paid plan supports up to 300 automations. Migrate if list exceeds 10K and revenue justifies the switch. |
| Retargeting campaigns before purchase conversion data | Retargeting (Google Display, Meta custom audiences) is powerful but requires audience size. | Meta requires minimum 1,000 matched users in a custom audience for retargeting to work reliably. Google Display retargeting requires 100+ cookied users. Without sufficient traffic volume, retargeting audiences are too small for meaningful reach. | Enable retargeting pixel tracking now (Meta Pixel, Google tag are already placeholders in code — just need real IDs). Build the audience passively while running cold traffic. Launch retargeting campaigns after 1,000 unique visitors are recorded. |
| Email broadcast newsletter cadence | Regular newsletters build audience relationships. | A weekly or biweekly newsletter to a list of non-buyers increases unsubscribe rate, dilutes urgency messaging, and creates ongoing content production burden for a solopreneur. | Limit broadcasts to event-triggered sends: new product, price change, limited-time offer. Use sequences (automated) as the primary communication vehicle — not broadcasts. |
| Separate ad landing page builder (Unbounce, Leadpages, Instapage) | Dedicated landing page tools offer templates and built-in A/B testing. | The stack is static HTML + GitHub Pages. Adding a third-party landing page tool introduces monthly cost ($79–$299/month for Unbounce), a separate CMS, and a different domain/subdomain that breaks brand consistency. | Build the ad landing page as a static HTML file (`lp-google.html`, `lp-meta.html`) using the existing Tailwind token system. Same dev environment, zero additional cost, same hosting. |

---

## Feature Dependencies

```
[Post-Purchase Onboarding Sequence]
    └──requires──> [Kit Buyer Tags] (purchased-starter, purchased-full-kit — ALREADY LIVE)
    └──requires──> [Buyer removed from nurture sequence] (must run before onboarding starts)
    └──depends-on──> [Tier-specific branching] (Starter and Full Kit get separate sequences)

[Tier-Specific Onboarding Sequences]
    └──requires──> [Post-Purchase Onboarding Sequence] (same trigger, different branch)
    └──enhances──> [Starter → Full Kit upsell] (Day-7 email in Starter sequence)

[Win-Back Sequence]
    └──requires──> [Engagement-Based Segmentation] (need a "non-buyer + 21+ days" segment in Kit)
    └──requires──> [Nurture Sequence completed] (win-back fires after Day 9 nurture ends)
    └──conflicts-with──> [Discount-led win-back] (see Anti-Features — value-first approach instead)

[Engagement-Based Segmentation]
    └──requires──> [Kit tags or custom fields] (add `engaged` tag on open/click via automation)
    └──enables──> [Win-Back Sequence] (segment filters define trigger)
    └──enables──> [Sunset Automation] (cold segment triggers suppression after win-back)

[Sunset Automation]
    └──requires──> [Win-Back Sequence completed] (sunset fires after last win-back email + no engagement)
    └──enhances──> [List deliverability] (removes cold weight from sending list)

[Google Ads Search Campaign]
    └──requires──> [Real Google Ads Conversion ID] (replace placeholder in index.html)
    └──requires──> [Dedicated Ad Landing Page] (send traffic to lp-google.html, not index.html)
    └──requires──> [Stripe Payment Links] (ALREADY LIVE — buy buttons wired)
    └──requires──> [Plausible Purchase goal] (ALREADY LIVE — tracks conversions)

[Meta Ads Campaign]
    └──requires──> [Real Meta Pixel ID] (replace placeholder in index.html)
    └──requires──> [Dedicated Ad Landing Page] (send traffic to lp-meta.html, not index.html)
    └──requires──> [Ad creative assets] (UGC-style image or video — must be produced)

[Dedicated Ad Landing Page(s)]
    └──requires──> [Message match with ad copy] (headline on page must echo ad headline verbatim)
    └──enhances──> [Google Ads Quality Score] (page relevance directly affects CPC)
    └──enhances──> [Meta Ads relevance score] (landing page experience is a ranking factor)
    └──optional-enhances──> [Secondary lead magnet CTA] (escape hatch for non-buyers)

[UTM-Tagged Landing Pages]
    └──requires──> [Dedicated Ad Landing Pages] (separate URLs per source)
    └──requires──> [Plausible] (ALREADY LIVE — reads UTM params automatically)

[Retargeting Campaigns]
    └──requires──> [Sufficient audience size] (1,000+ users — defer until cold traffic generates volume)
    └──requires──> [Meta Pixel and Google Tag active] (pixel collects audience passively during cold traffic phase)
```

### Dependency Notes

- **Buyer removal from nurture is a prerequisite to onboarding:** If a buyer enters the post-purchase onboarding sequence while still in the nurture sequence, they receive both simultaneously. This produces duplicate emails and mixed messaging. Remove from nurture first, then trigger onboarding.
- **Win-back requires segmentation to exist first:** Without a Kit segment defining "opted in 21+ days ago, no buyer tag, engaged with at least one email," there is no reliable trigger for the win-back sequence. Segmentation is the foundation.
- **Ad landing pages must exist before campaigns launch:** Running Google Ads or Meta Ads to `index.html` will work but wastes budget. The landing page is not optional — it directly determines campaign efficiency and Quality Score.
- **Meta Pixel and Google Tag IDs must be real before ad campaigns launch:** The placeholder code is in `index.html` but contains dummy IDs. Real IDs must be substituted before any ad spend, otherwise conversions are not tracked and campaigns cannot optimize.
- **Retargeting is explicitly deferred:** Do not launch retargeting until cold traffic has accumulated 1,000+ unique visitors. Enable pixel tracking immediately (it costs nothing) so the audience builds passively.

---

## MVP Definition

This is v1.1 scope, not v1.0. "MVP" here means: minimum set of features to begin generating revenue from paid acquisition while protecting list health.

### Ship First (v1.1 Immediate)

These are the critical path — nothing generates revenue without them.

- [ ] **Buyer removal from nurture sequence** — eliminates the cross-contamination between nurture and post-purchase; required before any other email work
- [ ] **Post-purchase onboarding sequence (Starter)** — 3–4 emails: Day 1 (welcome + quick win), Day 3 (prompt use tip), Day 7 (upsell to Full Kit), Day 14 (success check-in + testimonial ask)
- [ ] **Post-purchase onboarding sequence (Full Kit)** — 3–4 emails: Day 1 (welcome + full overview), Day 3 (advanced use tip), Day 7 (success metric prompt), Day 14 (testimonial ask + referral nudge)
- [ ] **Real Google Ads Conversion ID wired** — replace placeholder in `index.html` `<head>`; required before any Google Ads spend
- [ ] **Real Meta Pixel ID wired** — replace placeholder in `index.html` `<head>`; required before any Meta Ads spend
- [ ] **Dedicated ad landing page** — `lp-google.html` (or `lp-meta.html`); single CTA, message match, no nav distractions, built on existing Tailwind tokens

### Add Once First Revenue Comes In (v1.1 Secondary)

Add after initial campaigns are running and first purchase conversions are recorded.

- [ ] **Engagement-based segmentation** — tag subscribers `engaged` on open/click via Kit automation; creates foundation for win-back and sunset
- [ ] **Win-back sequence (3 emails)** — Email 1 (Day 21, new value), Email 2 (Day 25, social proof), Email 3 (Day 30, time-anchored offer); triggered by non-buyer segment
- [ ] **UTM-tagged landing page variants** — `lp-google.html` and `lp-meta.html` as separate files for clean Plausible source attribution

### Defer Until Proven Scale (v1.2+)

Build only after meaningful conversion volume validates the investment.

- [ ] **Sunset automation** — add after win-back sequence is proven; protects deliverability at scale; not urgent until list exceeds 2,000 subscribers
- [ ] **Retargeting campaigns (Meta / Google)** — defer until 1,000+ unique ad visitors are recorded; pixel builds audience passively in the meantime
- [ ] **Engagement scoring (3-point custom field)** — adds granularity beyond binary engaged/inactive; worth building when list exceeds 1,000 active subscribers
- [ ] **Affiliate/referral program** — defer until LTV is known and conversion rate is validated; high implementation cost for premature stage

---

## Feature Prioritization Matrix

| Feature | User/Business Value | Implementation Cost | Priority |
|---------|---------------------|---------------------|----------|
| Buyer removal from nurture sequence | HIGH (prevents bad experience) | LOW (Kit automation rule) | P1 |
| Post-purchase onboarding — Starter | HIGH (LTV, satisfaction) | MEDIUM (write 3–4 emails in Kit) | P1 |
| Post-purchase onboarding — Full Kit | HIGH (LTV, satisfaction) | MEDIUM (write 3–4 emails in Kit) | P1 |
| Real Google Ads Conversion ID wired | HIGH (enables paid acquisition) | LOW (replace one ID in HTML) | P1 |
| Real Meta Pixel ID wired | HIGH (enables paid acquisition) | LOW (replace one ID in HTML) | P1 |
| Dedicated ad landing page | HIGH (campaign efficiency, Quality Score) | MEDIUM (new static HTML file) | P1 |
| Engagement-based segmentation | HIGH (list health, win-back trigger) | MEDIUM (Kit automation + tags) | P2 |
| Win-back sequence | HIGH (recovers non-converting leads) | MEDIUM (write 3 emails + Kit segment) | P2 |
| UTM-tagged landing page variants | MEDIUM (cleaner attribution) | LOW (duplicate HTML file, rename) | P2 |
| Meta Ads cold traffic campaign | HIGH (revenue) | HIGH (creative production + campaign setup) | P2 |
| Google Ads Search campaign | HIGH (revenue) | HIGH (keyword research + campaign setup) | P2 |
| Sunset automation | MEDIUM (deliverability hygiene) | LOW (Kit tag + exclusion rule) | P3 |
| Retargeting campaigns | MEDIUM (conversion lift on warm traffic) | MEDIUM (campaign setup, requires audience) | P3 |
| Engagement scoring (custom field) | LOW at current scale | MEDIUM (Kit custom field + automation) | P3 |

**Priority key:**
- P1: Required for v1.1 launch — campaigns cannot run or list health at risk without these
- P2: Ship within 30 days of first ad revenue
- P3: Defer to v1.2 or when scale justifies

---

## Sequence Structure Reference

### Post-Purchase Onboarding (Starter — $27 tier)

| Email | Day | Subject Angle | Content Goal | CTA |
|-------|-----|--------------|-------------|-----|
| 1 | Immediately (Day 0 or Day 1) | "Here's how to get your first result in 20 minutes" | Confirm purchase + deliver quick win use case | Open the prompt kit |
| 2 | Day 3 | "The prompt 80% of buyers miss first" | Practical use tip — one specific high-value prompt | Try this prompt now |
| 3 | Day 7 | "Ready for the full toolkit?" | Upsell to Full Kit with Starter-specific frame | Upgrade to Full Kit |
| 4 | Day 14 | "Quick question about your results" | Satisfaction check + testimonial ask + referral nudge | Reply with your result |

### Post-Purchase Onboarding (Full Kit — $47 tier)

| Email | Day | Subject Angle | Content Goal | CTA |
|-------|-----|--------------|-------------|-----|
| 1 | Immediately (Day 0 or Day 1) | "Your full ContentKit is ready — start here" | Confirm purchase + overview of all 9 categories | Browse the kit |
| 2 | Day 3 | "The advanced prompt structure most people skip" | Advanced use tip — chaining prompts, custom variables | Apply this today |
| 3 | Day 7 | "What results are you getting?" | Engagement check + success metric prompt | Reply with your results |
| 4 | Day 14 | "Would you share what worked?" | Testimonial ask + referral nudge with social share copy | Submit your result |

### Win-Back Sequence (Non-Buyer, Post-Day-21)

| Email | Day from opt-in | Subject Angle | Content Goal | CTA |
|-------|----------------|--------------|-------------|-----|
| 1 | Day 21–23 | "Something we didn't send you yet" | New value (bonus prompt or case study) — no pitch | Read the bonus prompt |
| 2 | Day 25–27 | "How [persona] used this to [outcome]" | Social proof story — concrete, specific use case | Read the story |
| 3 | Day 30–32 | "Last chance to get this at launch price" | Time-anchored offer — close the sequence with urgency | Get the kit now |

**After Email 3 with no engagement:** Tag `win-back-completed-no-action`, exclude from all future sends.

### Ad Landing Page Structure

Single-page, no nav, no footer links, no lead magnet opt-in on the primary version.

| Section | Content | Notes |
|---------|---------|-------|
| Hero | Headline matches ad copy verbatim. Subhead: "why this, why now." | Message match is the single highest-leverage conversion lever |
| Problem statement | 2–3 lines on the pain — mirrors the ad creative's hook | No feature list here — pain first |
| Product preview | 3–5 specific prompt examples, with variables shown | Demonstrates quality, answers "is this generic?" |
| Social proof | 2–3 testimonials with outcomes ("saved 4 hours," "wrote 10 ads in 30 min") | Near the CTA — objection removal at decision point |
| Pricing + CTA | Single tier or matched to ad (if ad promotes Full Kit, show Full Kit only) | One price, one button, no navigation away |
| Guarantee | 30-day badge | Remove last purchase objection |
| Secondary (below fold) | "Not ready to buy? Get the free guide first." Links to opt-in. | Recovers non-buyers; does not dilute primary CTA |

---

## Competitor / Benchmark Analysis

| Feature | Typical AI Prompt Pack on Gumroad | Info Product Funnel (e.g., course creator) | ContentKit AI v1.1 Approach |
|---------|----------------------------------|-------------------------------------------|----------------------------|
| Post-purchase emails | Platform receipt only (no onboarding) | 3–7 email sequence, often generic | Tier-specific sequences, Day 1/3/7/14, outcomes-focused |
| Win-back for non-buyers | None — Gumroad has no list | Sometimes, typically discount-first | Value-first 3-email sequence, discount only in Email 3 |
| List segmentation | None — no email list | Basic (buyers vs non-buyers) | Engagement-tiered: buyer/non-buyer + engaged/warm/cold |
| Paid ads | None (organic-only on Gumroad) | Google Search, Meta, some YouTube | Google Search (high-intent) + Meta (awareness); separate landing pages |
| Ad landing page | Platform product page | Often homepage or generic sales page | Dedicated, message-matched, single-CTA, static HTML |
| Attribution | None | Often Google Analytics (overkill) | Plausible with UTM params + separate page per source |

**Key insight:** The v1.1 differentiator is not any individual feature — it is the complete lifecycle email management (onboarding + win-back + sunset) paired with purpose-built ad infrastructure. Most direct competitors on Gumroad/Stan Store have zero lifecycle email automation. Course creators have it but often do it generically. ContentKit AI can do it specifically and correctly from the start.

---

## Sources

- Encharge — "The Onboarding Email Sequence We Use to Get 40%+ Open Rates": https://encharge.io/onboarding-email-sequence/ — MEDIUM confidence
- ProsperStack — "The First 30 Days: Crafting a Winning Onboarding Email Sequence": https://prosperstack.com/blog/onboarding-email-sequence/ — MEDIUM confidence
- ActiveCampaign — "5 Win-Back Email Campaign Examples": https://www.activecampaign.com/blog/win-back-email-campaigns — MEDIUM confidence
- Klaviyo — "5 Win-Back Email Examples & Strategies for Success": https://www.klaviyo.com/blog/winback-email-campaign-examples — MEDIUM confidence
- Kit Help Center — "Tags and Segments in Kit (and when to use which)": https://help.kit.com/en/articles/4257108-tags-and-segments-in-kit-and-when-to-use-which — HIGH confidence (official documentation)
- Kit Blog — "11 Email Segmentation strategies": https://kit.com/resources/blog/email-segmentation — HIGH confidence (official documentation)
- Passiveincomesuperstars — "ConvertKit Tags & Segments - 15 Powerful Ways": https://www.passiveincomesuperstars.com/convertkit-tags-segments/ — MEDIUM confidence
- SmartPassiveIncome — "Create a Reengagement Campaign for Cold Email Subscribers": https://www.smartpassiveincome.com/blog/create-reengagement-campaign-cold-email-subscribers-automate-it/ — MEDIUM confidence
- Google/LeadsBridge — "The perfect Google Ads campaign structure: A guide for 2026": https://leadsbridge.com/blog/google-ads-campaign-structure/ — MEDIUM confidence
- Adventure PPC — "How to Run Google Ads Campaigns Profitably in 2026": https://www.adventureppc.com/blog/how-to-run-google-ads-campaigns-profitably-in-2026-a-complete-business-owner-s-guide — MEDIUM confidence
- BlueprintDigital — "Performance Max vs Search Campaigns Compared": https://blueprintdigital.com/blog/performance-max-vs-search-campaign/ — MEDIUM confidence (aligns with multiple sources on PMax vs Search for small budgets)
- Metalla Digital — "Meta Ads Strategy 2026: Why 2 Campaigns Scale Better Than 20": https://metalla.digital/meta-ads-strategy-2026-blueprint/ — MEDIUM confidence
- Creative AdBundance — "Meta Ads 2026 Playbook: 5 Creative Strategies That Convert": https://www.creativeadbundance.com/blog/meta-ads-2026-playbook-5-creative-strategies-to-maximize-roi — MEDIUM confidence
- Orr Consulting — "Landing Pages vs Homepages vs Product Pages: What Converts Best in 2026?": https://www.orr-consulting.com/post/landing-pages-vs-homepages-vs-product-pages-what-converts-best-in-2026 — MEDIUM confidence
- ConversionLab — "Dedicated landing pages vs. homepage: a 116% uplift case study": https://blog.conversionlab.no/boosting-conversions-rates-with-dedicated-landing-pages-a-case-study-from-betterworlds-recent-a-b-test/ — MEDIUM confidence
- Klientboost — "Message Match: Critical Component For Ad Success": https://www.klientboost.com/cro/message-match/ — MEDIUM confidence
- Klaviyo — "Engagement-Based Email Segmentation": https://www.klaviyo.com/blog/engagement-based-email-segmentation — MEDIUM confidence (principle applies to Kit)
- EngageBay — "Email Sunsetting Policy 101": https://www.engagebay.com/blog/sunsetting-policy-email-deliverability/ — MEDIUM confidence

---

*Feature research for: ContentKit AI v1.1 — Growth & Revenue (post-purchase lifecycle, email segmentation, paid acquisition)*
*Researched: 2026-02-28*
