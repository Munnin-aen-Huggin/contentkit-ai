# Pitfalls Research

**Domain:** Digital product growth infrastructure — post-purchase email, win-back sequences, paid ads (Google + Meta), ad landing pages added to existing static site
**Researched:** 2026-02-28
**Confidence:** MEDIUM-HIGH — Core tracking pitfalls verified against official Stripe and Google docs; Kit behavior verified against official help articles; ad platform behavior from multiple credible practitioner sources

---

## Scope Note

This document covers pitfalls specific to **v1.1: adding** post-purchase onboarding emails, win-back sequences, email segmentation, Google Ads, and Meta Ads to an existing system (Kit + Stripe Payment Links + static HTML on GitHub Pages + Plausible Analytics). It replaces the v1.0 pitfalls doc, which covered the initial sales funnel build.

---

## Critical Pitfalls

### Pitfall 1: Buyers Still In Nurture Sequence Receive Win-Back and Sales Emails After Purchasing

**What goes wrong:**
A subscriber opts in, enters the 5-email nurture sequence, then buys the Starter Kit on Day 3. The Lemon Squeezy webhook fires and tags them as `purchased-starter`. But they are still actively enrolled in the nurture sequence — emails 4 and 5 (which contain soft pitches for the Full Kit) continue to send. Additionally, if a win-back sequence is later added with a trigger "not opened in 30 days," buyers who are disengaged from non-purchase-related emails may incorrectly enter the win-back flow. The buyer now receives the post-purchase onboarding sequence AND the tail of the nurture sequence AND potentially a win-back, all in the same week.

**Why it happens:**
In Kit, subscribing a contact to a new sequence (post-purchase) does not automatically remove them from sequences they are already enrolled in. Tag-based triggers are additive — applying a `purchased-starter` tag starts the post-purchase automation but does not stop the existing nurture sequence unless an explicit "unsubscribe from sequence" action is configured. Founders build the new sequence without auditing the subscriber's current enrollment state.

**How to avoid:**
Add an automation rule in Kit: **when tag `purchased-starter` is added → unsubscribe from lead-magnet-nurture sequence**. Do the same for `purchased-full`. In the win-back sequence configuration, add the exclusion filter: exclude subscribers tagged `purchased-starter` OR `purchased-full` OR `buyer`. Kit's sequence editor supports per-sequence subscriber exclusions by tag. Test by manually enrolling a test subscriber in the nurture sequence, then triggering the buyer tag, and confirming the nurture sequence stops within 1 hour.

**Warning signs:**
- Buyers reply to sequence emails asking "I already bought this" — the clearest indicator
- Kit subscriber activity log shows a contact in 2+ active sequences simultaneously
- Plausible shows repeat visits to the checkout pages from confirmed buyers

**Phase to address:**
Email Automation phase — configure exclusion rules before the post-purchase sequence is activated. Do not launch post-purchase emails until buyer-from-nurture exclusion is confirmed working end-to-end.

---

### Pitfall 2: Conversion Tracking Fires on Thank-You Page Refresh — Google Ads and Meta Double-Count Purchases

**What goes wrong:**
The thank-you page at `getcontentkit.com/thank-you.html` receives traffic from the Stripe redirect after purchase. Google Ads and Meta Pixel conversion events are fired by JavaScript on page load. If a buyer refreshes the page — or opens the confirmation email and clicks a link that returns them to the thank-you page — the conversion event fires a second time. Google Ads records 2 purchases; Meta records 2 purchases. Ad spend optimization decisions are based on inflated conversion data, causing the algorithm to overvalue ad sets, inflate ROAS, and scale budget into underperforming campaigns.

**Why it happens:**
Client-side pixel events fire every time the page loads. Without a deduplication mechanism (unique transaction ID), the platforms count each load as a distinct conversion. Stripe's redirect appends a `?session_id={CHECKOUT_SESSION_ID}` parameter to the success URL — this ID is present on the first load. Without JavaScript that checks for the ID and stores it in sessionStorage/localStorage to prevent re-firing, refreshes trigger duplicates.

**How to avoid:**
Parse the `session_id` parameter from the URL on the thank-you page. Use `sessionStorage.getItem('conversion_fired')` to check if the conversion has already been recorded in this browser session. If not, fire the Google Ads `gtag('event', 'conversion', {...})` and Meta `fbq('track', 'Purchase', {...})` events and immediately set `sessionStorage.setItem('conversion_fired', session_id)`. For Google Ads, also pass the `transaction_id` value (the Stripe session ID) to the conversion event — Google deduplicates conversions with the same transaction ID even if client-side deduplication fails. Set Google Ads conversion count to "One" not "Every" for the purchase action.

**Warning signs:**
- Google Ads conversion column shows values 1.5–3x higher than Stripe actual revenue
- Plausible shows 50 purchase clicks but Google Ads reports 80+ conversions
- Meta Pixel Helper in browser shows the Purchase event firing immediately on page load without a URL parameter present

**Phase to address:**
Paid Ads tracking setup phase — must be implemented before any live campaign budget is allocated. Test by completing a real $1 purchase and refreshing the thank-you page; verify only 1 conversion appears in Google Ads and Meta Events Manager.

---

### Pitfall 3: Plausible Cannot Feed Conversion Data Into Google Ads — Smart Bidding Runs Blind

**What goes wrong:**
The existing analytics stack is Plausible. Plausible tracks purchases via a custom goal event, but Plausible conversion data cannot be imported into Google Ads. Google Ads requires its own `gtag` conversion tag (or GA4-linked conversion import) to optimize Smart Bidding (Target CPA, Target ROAS, Maximize Conversions). Running a Google Ads campaign without native Google conversion tracking means Smart Bidding has no purchase signal — it optimizes for clicks instead of sales. The algorithm will happily spend $20/day on traffic that never converts while believing it is performing well.

**Why it happens:**
Plausible is privacy-first and intentionally does not integrate with Google Ads. Founders who chose Plausible for its simplicity assume it covers all analytics needs, but paid ad platforms require their own conversion signals for algorithm optimization. This is a structural gap, not a configuration error.

**How to avoid:**
Add a Google Ads Global Site Tag (`gtag.js`) separately from Plausible. Both can coexist on the same page — Plausible tracks organic analytics, `gtag` feeds Google Ads conversion signals. The `gtag` conversion event fires on the thank-you page and is tied to the campaign. Similarly, add Meta Pixel (`fbq`) as a separate script. Do not remove or replace Plausible — add the ad platform tags alongside it. Use Google Tag Manager (GTM) if managing multiple tags becomes complex, but GTM is not required.

**Warning signs:**
- Google Ads campaign shows "Conversions: 0" after 48+ hours of live traffic and confirmed purchases
- Campaign optimization status shows "Learning" that never exits because it cannot accumulate 30+ conversions
- Google Ads UI warns "No conversion actions tracked"

**Phase to address:**
Paid Ads setup phase — tracking tags must be installed and verified (using Google Ads Tag Assistant or Meta Pixel Helper) before the first dollar of campaign budget is spent.

---

### Pitfall 4: Google Ads Smart Bidding Requires 30–50 Conversions Per Month — New Accounts Will Stall in Learning Phase

**What goes wrong:**
A new Google Ads account launches with Target CPA or Target ROAS bidding on a $147 product. Google's Smart Bidding requires a minimum of 30 conversions per month (optimally 50+) to exit the learning phase and make effective bid decisions. At $147 per conversion, achieving 30 conversions requires $4,410+ in revenue in the first month. If the campaign starts with a small budget ($10–$20/day), it will collect only a handful of conversions and remain permanently in learning phase — delivering inconsistent results, high CPC, and no optimization. The campaign looks broken when it is actually data-starved.

**Why it happens:**
Smart Bidding is designed for e-commerce businesses generating hundreds of conversions monthly. High-ticket digital products ($147–$499) inherently produce fewer conversions per dollar of traffic. New advertisers choose Smart Bidding because Google recommends it, without understanding the data requirements at their price point.

**How to avoid:**
Start with Manual CPC or Maximize Clicks (with a bid cap) for the first 4–6 weeks to accumulate click and impression data without burning budget on an algorithm that cannot optimize. Only switch to Smart Bidding after the account has recorded 30+ conversions. Alternatively, use Maximize Conversions without a CPA target initially — this is less data-hungry than Target CPA. If using Search campaigns, start with exact and phrase match keywords only to control quality during the data-gathering phase.

**Warning signs:**
- Campaign shows "Learning" status continuously after 2+ weeks
- Google Ads Recommendations tab suggests "increase your CPA target" repeatedly
- Conversions column shows 0–3 conversions despite $200+ spent

**Phase to address:**
Google Ads campaign setup phase — bidding strategy decision must be made with awareness of the product's conversion volume constraints before launch.

---

### Pitfall 5: Stripe Payment Link Cross-Domain Tracking Gap — Neither Google Ads Nor Meta Pixel Follows the Buyer Through Checkout

**What goes wrong:**
Stripe Payment Links operate on `buy.stripe.com`, a completely separate domain. When a visitor clicks "Buy Now" from `getcontentkit.com`, they leave the site. The Google Ads `gclid` click identifier and Meta `fbclid` click identifier stored in the browser are not passed to Stripe's domain because cookies are not shared across domains. When the buyer returns to the thank-you page at `getcontentkit.com`, the click-level attribution is lost — Google and Meta cannot connect the purchase back to the specific ad that drove it. The conversion is recorded but attributed to "direct" or "unknown" rather than to the campaign and keyword that generated it. ROAS calculations are wrong because the attribution chain is broken.

**Why it happens:**
Stripe is a closed payment environment that does not allow custom tracking code injection. The cross-domain tracking gap is an inherent limitation of payment link architecture documented by Stripe itself. Most ad tracking tutorials assume the checkout is on your own domain.

**How to avoid:**
Append the `gclid` and `fbclid` URL parameters to the Stripe Payment Link URL dynamically via JavaScript. This allows the Stripe redirect success URL to return to `getcontentkit.com/thank-you.html?gclid={gclid}&fbclid={fbclid}&session_id={CHECKOUT_SESSION_ID}`. Then read those parameters on the thank-you page and pass them to conversion events. This is the "simple method" that does not require a backend. Alternatively, use server-side conversion APIs (Google Enhanced Conversions or Meta CAPI via the existing Netlify Function) to send conversion data server-to-server, which is more reliable than client-side attribution. The Netlify webhook already processes successful purchases — it can be extended to also call Google's Conversion API and Meta's Conversions API.

**Warning signs:**
- Google Ads shows conversions but the Campaign/Ad Group/Keyword columns show "(not provided)" or "unattributed"
- The Acquisition report in any analytics tool shows paid traffic converting at 0% while thank-you page receives traffic
- ROAS appears impossibly high or low compared to actual revenue

**Phase to address:**
Paid Ads tracking setup phase — test attribution by clicking an ad, completing a purchase, and verifying the conversion shows in Google Ads with keyword-level attribution (not just overall conversion count).

---

### Pitfall 6: Meta Ads Account Restricted at Launch — Unverified Business, Policy Red Flags in Ad Copy

**What goes wrong:**
A new Meta Ads account launches for `getcontentkit.com`. Within 24–72 hours, ad sets are disabled with "Ad rejected" or the account is restricted. Common triggers: income/earnings claims in ad copy ("Replace a $5K copywriter"), unverified business account, landing page with urgency language ("Offer ends soon" without a real end date), or the account flagged because the payment method is new and unrecognized. Meta's enforcement is automated and opaque — appeals take 5–15 business days and are not guaranteed to succeed.

**Why it happens:**
Meta's 2025 Unacceptable Business Practices (UBP) policy is broadly enforced and catches legitimate businesses. Specific triggers for digital products: earnings-related claims, "guaranteed results" language, limited-time offers without substantiation, and mismatches between ad copy and landing page. New advertiser accounts have no trust history and are scrutinized more aggressively. Meta suspended 39.2M accounts in 2024 (up from 12.7M in 2023).

**How to avoid:**
Before launching any ads: (1) Complete Meta Business Verification with business documentation. (2) Add a valid payment method and let it age 48 hours before running ads. (3) Audit all ad copy against Meta's ad policies — replace earnings claims with outcome descriptions ("Save 8 hours a week on content creation" instead of "Replace a $5K copywriter"). (4) Ensure the landing page urgency language is either real (with an actual expiration date maintained) or removed. (5) Start with a $5–10/day budget on 1 ad set for 3–5 days before scaling — low-budget initial campaigns establish account history without triggering spend-velocity flags.

**Warning signs:**
- Ad set status shows "In review" for more than 24 hours on first submission
- Meta support emails reference "Unacceptable Business Practices" in the rejection reason
- Landing page policy checker in Meta Ads Manager flags specific page elements

**Phase to address:**
Meta Ads setup phase — business verification and copy review must complete before any campaign is created. Do not run ads until verification is confirmed.

---

### Pitfall 7: Win-Back Sequence Triggers After Only 14 Days of Inactivity — Annoys Engaged Subscribers, Damages Sender Score

**What goes wrong:**
A win-back sequence is configured with a trigger "subscriber has not opened an email in 14 days." The nurture sequence sends 5 emails over 9 days. A subscriber who opted in, read every email, and is considering the purchase gets tagged as "inactive" on Day 15 and immediately receives a "We miss you" win-back email with a discount offer. The subscriber — who was warm and close to buying — now perceives the brand as desperate, receives a discount they could have used on their pending purchase, and loses trust in the "launch pricing" urgency on the main page. Alternatively, if win-back sends too frequently (weekly), unsubscribe rates spike.

**Why it happens:**
Win-back timing benchmarks are established for SaaS and e-commerce businesses with high send frequency (2–4 emails/week). At that cadence, 14 days of inactivity is meaningful. ContentKit sends 5 emails over 9 days then stops — a 14-day inactive trigger fires almost immediately after the nurture sequence completes for everyone who did not buy. The system cannot distinguish "considering the purchase" from "lost interest."

**How to avoid:**
Set the win-back trigger to 60 days of inactivity (not 14–30 days) for a low-send-frequency list. Add a condition: only trigger win-back if the subscriber has been in the list for 30+ days AND has not purchased (no `buyer`, `purchased-starter`, or `purchased-full` tag). Cap the win-back sequence at 3 emails maximum with 7-day gaps between them. Include a clear unsubscribe option in every win-back email — giving disengaged subscribers an easy exit improves deliverability more than losing them costs. Do not include a discount in the first win-back email; reserve the offer for the third/final email only.

**Warning signs:**
- Unsubscribe rate on win-back emails exceeds 0.5% (healthy rate is under 0.2%)
- Win-back sequences trigger for subscribers who entered the list within the past 30 days
- Replies to win-back emails express confusion ("I just signed up last week")

**Phase to address:**
Email Automation phase — win-back sequence configuration and timing logic. Verify trigger conditions exclude recent subscribers and confirmed buyers before activating.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems specific to v1.1.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip deduplication on thank-you page conversion events | Simpler JavaScript | Double-counted conversions corrupt ROAS; algorithm scales wrong ad sets | Never — 30-minute fix with sessionStorage |
| Use Plausible alone for paid ad attribution | No additional scripts | Smart Bidding has no signal; Google Ads cannot optimize; wasted budget | Never — add gtag alongside Plausible |
| Suppress existing nurture sequence manually for buyers rather than via automation rule | One-time fix | Next buyer always affected; manual fix does not scale | Never — configure automation rule once |
| Use broad match keywords on new Google Ads account | More traffic volume | Irrelevant clicks eat budget before data accumulates; quality score damaged | Never on a new account; after 90 days consider phrase match expansion |
| Launch Meta Ads without Business Verification | Faster to start | Account restrictions within 24–72 hours; appeals take weeks | Never |
| Point ad traffic to main homepage rather than dedicated landing page | No new page needed | Lower Quality Score, higher CPC, lower conversion rate because the homepage has navigation and distractions | Never for paid traffic |
| Win-back trigger at 14 days inactive | Catches disengaged users quickly | Fires on warm prospects still considering purchase; damages brand trust | Never for a low-frequency sender (< 2 emails/week) |

---

## Integration Gotchas

Common mistakes when connecting v1.1 features to existing services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Kit + post-purchase sequence | Tagging buyer does not stop existing nurture sequence | Add automation rule: "tag `purchased-*` added → unsubscribe from nurture sequence" |
| Kit + win-back sequence | Win-back triggers for buyers tagged `purchased-*` who stop opening emails | Add exclusion filter on win-back: exclude `purchased-starter`, `purchased-full`, `buyer` tags |
| Kit + broadcasts | Sending a broadcast to "all subscribers" includes buyers who are in the post-purchase sequence | Create a "non-buyers" segment; send promotional broadcasts only to that segment |
| Stripe Payment Link + Google Ads | gclid parameter not passed through Stripe checkout domain | Append gclid dynamically to the Stripe Payment Link URL from the landing page; read it back on thank-you page |
| Stripe Payment Link + Meta Pixel | fbclid lost at Stripe checkout domain boundary | Same as gclid; pass fbclid through URL; use Meta CAPI via Netlify Function for server-side attribution fallback |
| GitHub Pages + Google Ads | GitHub Pages `github.io` domain used for ads instead of `getcontentkit.com` | Always use `getcontentkit.com` as the display URL and final URL; `github.io` domains score poorly in ad quality review |
| Plausible + Google Ads | Expecting Plausible goals to flow into Google Ads conversion tracking | Install `gtag.js` separately; the two systems do not share data |
| Google Ads + Meta Pixel | Both pixel scripts on the same thank-you page with no deduplication | Each platform needs its own transaction_id deduplication; implement sessionStorage guard and pass Stripe session_id as transaction_id |
| Netlify Function + paid ad CAPI | Assuming the existing webhook function handles conversion attribution | The existing function only tags Kit subscribers; extend it to also call Google Enhanced Conversions API and Meta CAPI |
| Kit + win-back | New subscriber (< 30 days) incorrectly enters win-back after completing nurture sequence | Add condition: subscriber age > 30 days before win-back trigger activates |

---

## Performance Traps

Patterns that work at low volume but degrade as ad spend and list size grow.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Client-side-only conversion tracking | Works until buyers share thank-you page URL or refresh after bookmark | Add sessionStorage deduplication + server-side CAPI as backup | Every refresh after go-live; exponentially worse at scale |
| Broad match keywords on new account | Lots of impressions; few conversions; money spent on irrelevant queries | Start exact/phrase match; audit search terms weekly | Immediately — broad match on a new account bleeds budget from day 1 |
| Smart Bidding before 30 conversions/month | Campaign never exits learning; CPC spikes | Start Manual CPC; switch to Smart Bidding after data threshold | From day 1 if used on new account with < 30 conversions/month |
| Sending broadcasts to full list including buyers | Buyers receive promotions for products they own | Build segmented send groups before first broadcast | After the first "I already bought this" reply |
| Single ad creative running for 30+ days | Ad fatigue — CTR drops, CPM rises, algorithm gets no fresh signal | Rotate 3–5 creative variants; replace when CTR drops > 30% from peak | After 3–4 weeks of continuous exposure to the same audience |
| Win-back sequence on a < 2,000 subscriber list | Segments too small for meaningful re-engagement data | Wait until list exceeds 2,000 before activating win-back (or accept low statistical power) | From the start — small lists produce unreliable win-back data |

---

## Security Mistakes

Domain-specific security issues introduced by v1.1 features.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Google Ads Conversion ID and Label embedded in public HTML without understanding they are non-secret | None — these IDs are designed to be public; not a security risk | No action needed; Google Ads tracking IDs are intentionally public |
| Meta Pixel ID embedded in public HTML | None — Pixel IDs are public by design | No action needed; Pixel IDs are not secrets |
| Meta Conversions API access token hardcoded in Netlify Function source committed to public GitHub repo | Full CAPI access exposed; anyone can send fake conversion events | Store CAPI access token in Netlify environment variables only; never commit to repo |
| Google Enhanced Conversions sending hashed PII (email) without GDPR consent | Potential GDPR violation for EU visitors | Only send hashed email data to Google Enhanced Conversions if the visitor has consented to marketing tracking; tie to consent flag |
| Stripe session_id parameter visible in thank-you page URL | Low risk — session IDs are single-use and expire; no financial action is possible from a session ID alone | No action required; do not attempt to hide this parameter as it enables deduplication |

---

## UX Pitfalls

User experience mistakes specific to adding paid ads and new email flows to an existing system.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Ad landing page is the main homepage with navigation | Paid traffic leaks to blog, about pages; lower conversion | Create a dedicated ad landing page with no navigation, single CTA |
| Post-purchase onboarding email 1 sends 24 hours after purchase | Buyer has forgotten they purchased; first touchpoint feels cold | Send email 1 within 15 minutes of purchase tag being applied; subject line references their purchase specifically |
| Win-back offer (discount) given in email 1 of the sequence | Trains subscribers to wait for discounts; devalues anchor pricing | Save the discount for email 3 (final win-back email) only; emails 1 and 2 add value without offering price reduction |
| Post-purchase sequence references "lead magnet" content the buyer may not have received | Buyer who purchased directly (cold ad traffic) is confused by references to a free guide they never got | Segment post-purchase sequence: buyers from ad traffic vs. buyers who went through nurture; or make onboarding content self-contained without referencing the lead magnet |
| Ad copy says "Limited time offer" but the pricing on the page is permanent | Meta flags as policy violation; buyers who return days later see same price, lose trust | Use real urgency or none; if anchor pricing is permanent, do not imply time-limit |
| Sending 3+ emails in the first week post-purchase (onboarding) + continuing nurture + broadcast | Email overload; unsubscribes spike | Suppress all other emails during the 14-day post-purchase onboarding window; resume broadcasts after onboarding sequence completes |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces specific to v1.1.

- [ ] **Post-purchase sequence activation:** Sequence is published AND activated AND automation rule "buyer tag → start sequence" is enabled — verify by manually tagging a test subscriber and confirming email 1 arrives within 15 minutes
- [ ] **Buyer suppression from nurture:** After the buyer tag is applied, the nurture sequence stops — verify by checking the test subscriber's sequence enrollment in Kit after tagging
- [ ] **Win-back exclusions:** Win-back trigger excludes subscribers tagged `purchased-starter`, `purchased-full`, `buyer` — verify by checking sequence exclusion settings against all three tags
- [ ] **Google Ads conversion tag:** `gtag` purchase event fires on thank-you page — verify with Google Ads Tag Assistant Chrome extension before launch
- [ ] **Meta Pixel Purchase event:** `fbq('track', 'Purchase', {...})` fires on thank-you page — verify with Meta Pixel Helper Chrome extension
- [ ] **Deduplication logic:** Refreshing the thank-you page does not fire a second conversion event — verify manually by completing a test purchase and refreshing 3 times; check Google Ads and Meta Events Manager for duplicate events
- [ ] **gclid/fbclid passthrough:** Click an ad (or simulate with URL parameters), complete a purchase, and confirm the conversion in Google Ads shows keyword/ad-level attribution — not just overall conversion count
- [ ] **Google Ads Conversion ID/Label:** The actual Google Ads Conversion ID (format: AW-XXXXXXXXX) and Conversion Label (format: XXXXXXXXXXXXXXXXX) are in the HTML — not the placeholder values from the v1.0 marketing/paid-ads/tracking-setup.md
- [ ] **Meta Pixel ID:** The actual numeric Pixel ID (format: 15+ digit number) is in the HTML — not the placeholder
- [ ] **Ad landing page:** Dedicated ad landing page exists with no navigation, focused single CTA, and matches ad copy headline exactly
- [ ] **Meta Business Verification:** Business verification is approved before first ad campaign is created — not after
- [ ] **Win-back timing:** Win-back trigger is set to 60+ days inactive (not 14–30 days) and subscriber age condition is > 30 days

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Buyers received 5 extra nurture emails after purchase | LOW | Apologize in next post-purchase email; add automation rule immediately; retroactively remove buyers from nurture sequence in Kit |
| Double-counted conversions inflated Google Ads ROAS for 2 weeks | MEDIUM | Pause campaign; implement deduplication; reset conversion data in Google Ads (mark historical conversions as "ineligible" if needed); rebuild Smart Bidding on clean data — expect 2-week re-learning period |
| Smart Bidding stalled in learning phase after 30 days | LOW | Switch bidding strategy to Manual CPC or Maximize Clicks; accumulate 30+ conversions; re-enable Smart Bidding |
| Meta Ads account restricted | HIGH | Submit appeal with business documentation immediately; do not create a new account (permanent ban risk); document the specific rejection reason and remove the offending element before appealing; expect 5–15 business day review |
| Google Ads account suspended (unacceptable business practices) | HIGH | Review policy violation cited; remove "guaranteed results" or misleading earnings language; update landing page; submit appeal; suspensions are indefinite until appealed successfully |
| Win-back sent to warm prospects who were about to buy | LOW-MEDIUM | Segment those who purchased after receiving win-back email (positive outcome); for those who unsubscribed, no recovery; adjust win-back timing to 60 days going forward |
| gclid attribution broken — Google Ads shows zero keyword-level data | MEDIUM | Implement server-side Enhanced Conversions via Netlify Function; requires extending the existing webhook function to call Google's offline conversion import API; expect 2-3 days for data to backfill |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Buyers in nurture + post-purchase simultaneously | Email Automation — post-purchase sequence setup | Manually tag test subscriber; confirm nurture sequence stops and post-purchase starts within 15 min |
| Win-back fires on warm prospects or buyers | Email Automation — win-back sequence setup | Check trigger conditions; verify exclusion tags before activation |
| Duplicate conversion events on thank-you page | Paid Ads — tracking setup | Complete test purchase; refresh thank-you page 3x; verify 1 conversion in each platform |
| Plausible does not feed Google Ads — Smart Bidding blind | Paid Ads — tracking setup | Google Ads Tag Assistant shows conversion tag active; conversion appears in Google Ads after test purchase |
| Cross-domain tracking gap (Stripe → thank-you) | Paid Ads — tracking setup | Simulate ad click with gclid URL param; complete purchase; verify keyword-level attribution in Google Ads |
| Meta account restricted pre-launch | Meta Ads — account setup | Business verification approved; 1 compliant ad approved before scaling budget |
| Google Ads Smart Bidding data starvation | Google Ads — campaign setup | Bidding strategy is Manual CPC or Maximize Clicks (no CPA target) until 30+ conversions accumulated |
| Broadcasts sent to buyers | Email Automation — segmentation setup | "Non-buyers" segment created in Kit; used for all promotional broadcasts |
| Post-purchase email references lead magnet (cold ad buyers) | Email Automation — post-purchase content | Post-purchase sequence is self-contained; no references to "the free guide" without conditional branching |

---

## Sources

- Stripe official docs: [Payment Links post-payment options](https://docs.stripe.com/payment-links/post-payment) — cross-domain tracking limitation confirmed (HIGH confidence)
- Google Ads Help: [Use a transaction ID to minimize duplicate conversions](https://support.google.com/google-ads/answer/6386790) — deduplication mechanism (HIGH confidence)
- Google Ads Help: [Duration of the learning period for campaigns](https://support.google.com/google-ads/answer/13020501) — 30–50 conversion minimum for Smart Bidding (HIGH confidence)
- Kit Help Center: [How to create and manage automation rules in Kit](https://help.kit.com/en/articles/6611507-how-to-create-and-manage-automation-rules-in-kit) — "unsubscribe from sequence" action available (HIGH confidence)
- Kit Help Center: [Excluding Subscribers from Sequences](https://intercom.help/convertkit/blueprints/excluding-subscribers-from-sequences-blueprints) — tag-based exclusion supported (HIGH confidence)
- ProvenFlows: [How to stop sending sales emails once a subscriber buys, in ConvertKit](https://provenflows.com/how-to-stop-sending-sales-emails-once-a-subscriber-buys-from-you-in-convertkit/) — automation rule pattern confirmed (MEDIUM confidence)
- ConversionTracking.io: [Stripe Payment Link Conversion Tracking](https://conversiontracking.io/blog/stripe-payment-link-conversion-tracking) — simple and advanced tracking methods; deduplication via session_id (MEDIUM confidence)
- Plausible Analytics: [Tracking Google Ads and other paid campaigns with Plausible](https://plausible.io/blog/google-ads-tracking) — confirmed Plausible cannot import into Google Ads (HIGH confidence)
- EasyInsights: [Why Conversions Don't Match Across Meta, Google, and GA4](https://easyinsights.ai/blog/why-conversions-dont-match-across-meta-google-and-ga4-and-how-to-fix-cross-platform-attribution/) — attribution window conflicts (MEDIUM confidence)
- StubGroup: [The State of Google Ads Suspensions 2025](https://stubgroup.com/blog/the-state-of-google-ads-suspensions-2025/) — 39.2M account suspensions in 2024; trust score factors (MEDIUM confidence)
- Blackscale Media: [Meta Ad Account Suspensions: Causes, Recovery & Prevention](https://blackscale.media/2025/09/08/meta-ad-account-suspensions-understanding-causes-and-prevention-strategies/) — UBP policy triggers for digital products (MEDIUM confidence)
- Meta Ads documentation (via WebSearch): Meta Andromeda Update 2025 — broad targeting now outperforms hyper-targeted; CBO allocation risks (MEDIUM confidence)
- Flowium: [Winback Email That Converts: Strategies and Examples for 2025](https://flowium.com/blog/winback-email-campaign-and-examples/) — 3–5 email maximum; 30–90 day trigger window (MEDIUM confidence)
- ActiveCampaign: [Re-engagement Emails: How to Win Back Lost Subscribers](https://www.activecampaign.com/blog/re-engagement-email) — timing and frequency guidance (MEDIUM confidence)
- Tracklution: [Stripe Conversion Tracking](https://www.tracklution.com/stripe-conversion-tracking/) — server-side tracking recommendation; duplicate prevention (MEDIUM confidence)
- HawkSEM: [How Long is the Google Ads Learning Phase?](https://hawksem.com/blog/google-ads-learning-phase/) — learning phase behavior for new accounts (MEDIUM confidence)

---
*Pitfalls research for: ContentKit AI — v1.1 Growth & Revenue (post-purchase email, win-back, Google Ads, Meta Ads)*
*Researched: 2026-02-28*
