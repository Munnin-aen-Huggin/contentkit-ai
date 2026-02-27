# Phase 5: Launch Readiness - Research

**Researched:** 2026-02-27
**Domain:** End-to-end funnel verification, analytics configuration, pre-launch QA
**Confidence:** HIGH (most decisions already made; this phase is verification, not new build)

---

## Summary

Phase 5 is a verification phase, not a build phase. By the time this phase runs, all pages are live on GitHub Pages (getcontentkit.com), Stripe Payment Links are the checkout mechanism, Kit handles email automation, and a Netlify webhook tags buyers. The work is: configure Plausible goals in the dashboard (the script is already installed), replace placeholder IDs for Google Ads and Meta Pixel, configure Stripe redirect URLs to append `?tier=starter` or `?tier=full`, then run a systematic checklist to confirm every step of the purchase-to-delivery funnel works under real conditions.

The single highest-risk item is **the Stripe redirect URL configuration**: the current Stripe Payment Links in index.html (`buy.stripe.com/bJefZi8NU2lgfHc9TG9ws06` for Starter, `buy.stripe.com/4gM8wQ0ho7FA3Yu1na9ws05` for Full Kit) must be configured in the Stripe Dashboard to redirect to `https://getcontentkit.com/thank-you.html?tier=starter` and `https://getcontentkit.com/thank-you.html?tier=full` respectively. Without the `?tier=` parameter, the thank-you.html conversion tracking fires with `value=0` for all purchases.

A secondary risk is the **ad platform placeholder IDs**: `AW-XXXXXXXXXX` (Google Ads) and `PIXEL_ID_HERE` (Meta Pixel) appear across all HTML files. These must be replaced before any paid traffic is sent, or conversion data is silently discarded.

**Primary recommendation:** Execute this phase as a two-plan sequence — Plan 05-01 configures all analytics (Plausible goals, ad platform IDs) and Plan 05-02 runs the end-to-end verification checklist (real charge, mobile flow, email deliverability, Notion duplication, link audit). The Stripe redirect configuration belongs in 05-01 as a prerequisite for the real-charge test in 05-02.

---

## Confirmed State of the Project

Verified by reading the actual source files:

| Component | Status | Evidence |
|-----------|--------|----------|
| GitHub Pages hosting | Live at getcontentkit.com | CNAME file contains `getcontentkit.com` |
| Plausible script | Installed | `script.tagged-events.js` on index.html; `script.revenue.js` on thank-you.html |
| Plausible goals | NOT configured | Goals must be created in Plausible dashboard manually |
| Google Ads gtag | Script present, ID is placeholder | `AW-XXXXXXXXXX` in all HTML files |
| Meta Pixel | Script present, ID is placeholder | `PIXEL_ID_HERE` in all HTML files |
| Conversion events | Code correct | Purchase, Lead, InitiateCheckout, begin_checkout all wired |
| Tier detection | Code correct | `?tier=starter` / `?tier=full` read from URL on thank-you.html |
| Stripe redirect | NOT configured | 04-04-SUMMARY documents this as pending manual setup |
| Stripe Payment Links | Live | bJefZi8NU2lgfHc9TG9ws06 (Starter $147), 4gM8wQ0ho7FA3Yu1na9ws05 (Full Kit $499) |
| Webhook | Deployed | Netlify function at gleeful-alfajores-fd284c.netlify.app |
| Kit automation | Live | Nurture sequence + buyer tagging via webhook |

---

## Standard Stack

No new libraries are added in this phase. The stack is what was already deployed.

### Core (Already Installed)
| Tool | How Used | Where Configured |
|------|----------|-----------------|
| Plausible Analytics | Page views + custom events (Purchase, Email Signup, Purchase Click) | plausible.io dashboard — goals must be created manually |
| Google Ads gtag (AW-XXXXXXXXXX) | Conversion tracking: begin_checkout + purchase | Replace placeholder in all HTML files |
| Meta Pixel (PIXEL_ID_HERE) | InitiateCheckout + Lead + Purchase | Replace placeholder in all HTML files |
| Stripe Payment Links | Checkout, redirects to thank-you.html | Stripe Dashboard redirect config required |
| Kit (ConvertKit) | Email delivery: lead magnet + nurture + buyer sequence | Already live |
| Netlify Function webhook | Stripe → Kit buyer tagging | Already deployed |

### Tools for Verification (No Install Needed)
| Tool | Purpose | Access |
|------|---------|--------|
| Meta Pixel Helper | Chrome extension, verifies pixel fires | Chrome Web Store |
| Browser DevTools Console | Verify plausible() and gtag() calls fire | Built-in |
| Mail-tester.com | Email spam score and deliverability check | mail-tester.com |
| Google PageSpeed Insights | Mobile LCP verification | pagespeed.web.dev |

---

## Architecture Patterns

### Pattern 1: Plausible Goals Must Be Created in Dashboard (Not Just Scripted)

**What:** When `plausible('Purchase', {...})` fires in JavaScript, the event is sent to Plausible's servers. However, the event will NOT appear in the dashboard and will NOT be tracked as a conversion until a matching goal is manually created in the Plausible site settings.

**How it works:**
```
Code fires: plausible('Purchase', { revenue: { currency: 'USD', amount: 499 } })
      ↓
Plausible receives the event (silently)
      ↓
IF a Goal named "Purchase" exists → shows in Goal Conversions with revenue
IF no Goal exists → event is received but never visible
```

**Steps to create goals** (must be done in plausible.io dashboard):
1. Go to site settings for `getcontentkit.com`
2. Click "Goals" → "+ Add goal"
3. Select "Custom event" as trigger
4. Enter exact event name — must match the string in `plausible()` call exactly
5. For revenue goals (Purchase): enable "Enable Revenue Tracking" and set currency to USD

**Goals to create for this project:**

| Goal Name | Type | Revenue Tracking | Fired From |
|-----------|------|-----------------|-----------|
| `Purchase` | Custom event | YES — USD | thank-you.html on page load |
| `Email Signup` | Custom event | No | index.html on form submit |
| `Purchase Click` | Custom event | No | index.html on buy button click |

Source: [Plausible custom event goals docs](https://plausible.io/docs/custom-event-goals), [Plausible ecommerce revenue tracking](https://plausible.io/docs/ecommerce-revenue-tracking) — MEDIUM confidence (official docs verified).

### Pattern 2: Stripe Payment Link Redirect with Tier Parameter

**What:** Each Stripe Payment Link must be configured in the Stripe Dashboard to redirect to thank-you.html with a `?tier=` URL parameter. The thank-you.html reads this parameter to determine which tier was purchased and fires the correct conversion value.

**Configuration per Stripe Dashboard** (Stripe Dashboard > Payment Links > [link] > Edit > "After the payment" tab):
- Select: "Don't show a confirmation page" → redirect customers to your website
- Starter Link (`bJefZi8NU2lgfHc9TG9ws06`): `https://getcontentkit.com/thank-you.html?tier=starter`
- Full Kit Link (`4gM8wQ0ho7FA3Yu1na9ws05`): `https://getcontentkit.com/thank-you.html?tier=full`

**Why this matters:** Without `?tier=`, the `tier` variable is `unknown`, `value` is `0`, and all three conversion tracking systems (Plausible, Google Ads, Meta Pixel) fire with `$0` purchase value. This corrupts ad attribution data before any paid traffic runs.

Source: [Stripe post-payment docs](https://docs.stripe.com/payment-links/post-payment) — MEDIUM confidence (official docs).

### Pattern 3: Webhook Amount Mismatch Risk

**What:** The Netlify webhook (`ls-webhook.js`) routes buyers to Kit tags based on `amount_total` in cents. The routing logic uses `STRIPE_STARTER_AMOUNT=2700` and `STRIPE_FULL_KIT_AMOUNT=4700`. However, the current live pricing is **$147 (14700 cents) and $499 (49900 cents)**.

This means the webhook environment variables must be updated in the Netlify dashboard, or buyers will NOT be tagged in Kit.

**Verification required:** Confirm whether the Stripe Payment Links (`bJefZi8NU2lgfHc9TG9ws06` and `4gM8wQ0ho7FA3Yu1na9ws05`) charge $147/$499 or $27/$47. The 04-04-SUMMARY shows the pricing displayed in HTML as $147/$499 but the webhook was built with $27/$47 amounts.

Source: `03-03-SUMMARY.md` (key-decisions: "Product identification by payment amount") and `index.html` (pricing display) — HIGH confidence (source files).

### Pattern 4: Real Charge Verification Process

**What:** A real charge with a real card (not Stripe test mode) is required to verify the full purchase-to-delivery flow before paid traffic. The test validates the complete chain: Payment Link → Stripe processes charge → webhook fires → Kit tags buyer → Lemon Squeezy/Stripe sends receipt email.

**Steps for real charge test:**
1. Use a physical card with sufficient balance
2. Go to the live Stripe Payment Link URL (not test mode)
3. Complete checkout with real card details
4. Verify redirect lands on `thank-you.html?tier=starter` (or `?tier=full`)
5. Verify browser console shows conversion events firing with correct values
6. Check Kit: confirm buyer email appears with correct tag (`purchased-starter` or `purchased-full-kit`)
7. Check email inbox: confirm receipt email arrives within 5 minutes
8. Stripe Dashboard: issue refund immediately after test

**Stripe refund:** Stripe refunds the full amount if initiated within 7 days. Stripe's fee (typically 2.9% + $0.30) may or may not be returned depending on account type — confirm in Stripe Dashboard after refund.

Source: Stripe documentation + project source files — MEDIUM confidence.

### Pattern 5: Email Deliverability — What to Verify

**What:** The phase requires confirming email lands in Gmail Primary (not spam or Promotions). This must be tested manually with real email addresses.

**Testing protocol:**
1. Submit the opt-in form on the live site with a Gmail address
2. Confirm delivery within 60 seconds
3. Note whether it lands in Primary, Promotions, or Spam
4. If Promotions: this is acceptable — Kit's deliverability places ~58% in Gmail inbox, 41.5% in Promotions per 2024 benchmarks
5. If Spam: Kit SPF/DKIM configuration must be investigated

**Kit custom sending domain:** If emails land in spam, setting up a custom sending domain (`mail.getcontentkit.com` or similar) improves deliverability by linking Kit's SPF/DKIM to the project's domain. This is NOT needed for initial launch but is the remediation if spam placement occurs.

Source: [EmailDeliverabilityReport — ConvertKit 2024](https://www.emaildeliverabilityreport.com/en/deliverability/convertkit/2024/) — MEDIUM confidence.

### Anti-Patterns to Avoid

- **Testing with a Stripe test card instead of a real card:** Test mode does not trigger webhooks to production endpoints and does not send real emails. The real-charge test must use live mode with a real card.
- **Creating Plausible goals after traffic starts:** Goals only count conversions that occur after the goal is created. Events sent before goal creation are not retroactively counted.
- **Forgetting to update Netlify webhook amounts:** If the webhook uses old cent amounts ($27=2700, $47=4700) and Payment Links charge new prices ($147, $499), no buyers get tagged in Kit.
- **Testing mobile flow on localhost or browser emulation:** The phase requires a physical iOS or Android device. Browser emulation does not replicate real mobile payment flows, camera-based QR scanning for Apple Pay, or network conditions.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Analytics dashboard | Custom tracking dashboard | Plausible (already installed) | Script is live; just create goals in dashboard |
| Spam testing | Manual read-by-read comparison | mail-tester.com | Automated SPF/DKIM/DMARC check + spam score |
| Mobile testing | BrowserStack or emulator | Physical device | Stripe checkout, Apple Pay, real network behavior |
| Conversion verification | Custom logging | Browser DevTools console | `plausible()`, `gtag()`, `fbq()` calls logged in real-time |

**Key insight:** This phase is about verification, not construction. Every tool needed is either already deployed or freely available in a browser. The risk is missing steps, not building the wrong thing.

---

## Common Pitfalls

### Pitfall 1: Plausible Goals Not Created Before Testing

**What goes wrong:** The real-charge test fires `plausible('Purchase', { revenue: ... })` but no Purchase goal exists in the Plausible dashboard. The test appears to pass (no JS errors) but conversion data is never recorded. You discover this days later when the dashboard shows zero conversions.

**Why it happens:** Plausible accepts events without goals silently — there is no error if a goal doesn't exist.

**How to avoid:** Create all three Plausible goals (Purchase, Email Signup, Purchase Click) BEFORE running the end-to-end test. Verify goals appear in the "Goals" section of the Plausible dashboard.

**Warning signs:** Dashboard shows pageviews but "0 conversions" after form submit or buy button click.

### Pitfall 2: Thank-You Page Fires With `tier=unknown`

**What goes wrong:** Stripe redirect is configured to `https://getcontentkit.com/thank-you.html` (without `?tier=`). All conversion events fire with `value=0`. Google Ads and Meta Pixel receive $0 purchase events. This corrupts conversion data before any paid campaign runs.

**Why it happens:** The Stripe Dashboard redirect configuration was documented as pending at end of Phase 4. It's easy to forget or misconfigure.

**How to avoid:** After configuring Stripe redirects, immediately test by visiting the Payment Link and confirming the browser lands on `thank-you.html?tier=starter`. Check DevTools console for conversion event values.

**Warning signs:** `thank-you.html` loads without `?tier=` in the URL bar.

### Pitfall 3: Webhook Cent Amounts Out of Sync With Payment Link Prices

**What goes wrong:** Netlify function uses `STRIPE_STARTER_AMOUNT=2700` (=$27) and `STRIPE_FULL_KIT_AMOUNT=4700` (=$47). If the live Payment Links charge $147/$499, the `amount_total` will be `14700`/`49900`. The webhook's amount comparison fails for every real purchase. Buyers are never tagged in Kit.

**Why it happens:** Pricing was updated (from $27/$47 to $147/$499) after the webhook was built. The webhook environment variables were not updated.

**How to avoid:** Before the real-charge test, verify what the live Payment Links actually charge. Check Stripe Dashboard > Payment Links and confirm the amounts. Update Netlify env vars if needed: `STRIPE_STARTER_AMOUNT=14700`, `STRIPE_FULL_KIT_AMOUNT=49900`.

**Warning signs:** Real charge completes, thank-you page loads, but buyer email does not appear in Kit within 5 minutes.

### Pitfall 4: Ad Placeholder IDs Never Replaced

**What goes wrong:** `AW-XXXXXXXXXX` and `PIXEL_ID_HERE` remain in all HTML files when paid traffic begins. Google Ads shows "no conversions tracking" and Meta Pixel fires to a nonexistent pixel ID. Conversion optimization never trains.

**Why it happens:** The Google Ads account and Meta Business Manager account must be created by the user (cannot be automated). The tracking-setup.md document covers this but it's a manual step that can be skipped.

**How to avoid:** The phase explicitly requires creating these accounts and replacing placeholders. The find-and-replace must happen across all HTML files:
- `AW-XXXXXXXXXX` appears in: index.html, thank-you.html, blog/index.html, all 5 blog articles
- `PIXEL_ID_HERE` appears in the same files

**Warning signs:** Running `grep -r "AW-XXXXXXXXXX"` returns results in any HTML file.

### Pitfall 5: Mobile Test Not on Physical Device

**What goes wrong:** Mobile flow is tested using Chrome DevTools device emulation. The test passes. On a real iPhone, the email opt-in form autocomplete fires unexpectedly, a buy button has a tap target too small to hit, or Stripe's hosted checkout page doesn't render correctly in iOS Safari.

**Why it happens:** Device emulation does not replicate iOS Safari's rendering engine, tap target behavior, autocomplete, or Apple Pay wallet integration.

**How to avoid:** Test on a physical iOS or Android device over a cellular connection (not WiFi, to simulate real user conditions). Walk the full flow: landing page → opt-in form → check email on device → sales page → Stripe checkout → thank-you page.

**Warning signs:** Skipping this step means discovering mobile issues after paid traffic has already started.

### Pitfall 6: Email Test Only Sends to Same Provider

**What goes wrong:** Email deliverability is only tested with Gmail. An Outlook user buys the product and their confirmation email lands in Outlook's Junk folder.

**How to avoid:** Test email delivery to both a Gmail address AND an Outlook (Hotmail/Live) address. The phase success criteria explicitly names both providers.

---

## Code Examples

### Verify Plausible Events Are Firing (Browser Console)

```javascript
// Paste into DevTools console on the live site to monkey-patch plausible()
// and log every event before it sends:
var _orig = window.plausible;
window.plausible = function(event, opts) {
  console.log('[Plausible]', event, opts);
  if (_orig) _orig.apply(this, arguments);
};
// Now click buy button or submit form — you'll see the events in console
```

Source: Derived from Plausible's plausible() API documentation — LOW confidence (pattern, not official snippet).

### Verify Tier Param Is Being Read on Thank-You Page (Browser Console)

```javascript
// Paste into DevTools console on thank-you.html?tier=starter
var params = new URLSearchParams(window.location.search);
console.log('tier:', params.get('tier'));
// Expected output: "tier: starter"
// If output is "tier: null" — Stripe redirect is misconfigured
```

Source: Derived from thank-you.html source code — HIGH confidence (direct code reference).

### Find-and-Replace Placeholder IDs (Terminal)

```bash
# Find all files containing placeholder Google Ads ID
grep -r "AW-XXXXXXXXXX" /path/to/project --include="*.html"

# Find all files containing placeholder Meta Pixel ID
grep -r "PIXEL_ID_HERE" /path/to/project --include="*.html"

# After getting real IDs from dashboards, replace across all files:
# macOS sed (BSD):
find /path/to/project -name "*.html" -exec sed -i '' 's/AW-XXXXXXXXXX/AW-REALID/g' {} +
find /path/to/project -name "*.html" -exec sed -i '' 's/PIXEL_ID_HERE/123456789012345/g' {} +
```

Source: Standard sed usage — HIGH confidence.

### Verify Webhook Cent Amounts in Netlify

The current environment variables documented in `03-03-SUMMARY.md`:
```
STRIPE_STARTER_AMOUNT=2700   ← was $27, may need updating to 14700 ($147)
STRIPE_FULL_KIT_AMOUNT=4700  ← was $47, may need updating to 49900 ($499)
```

Confirm actual prices by checking live Stripe Payment Links in the Dashboard, then update in Netlify > Site configuration > Environment variables if prices changed.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| Lemon Squeezy as merchant of record | Stripe Payment Links (pivoted in Phase 3) | Webhook uses Stripe HMAC, not LS HMAC |
| $27/$47 pricing | $147/$499 pricing (current in HTML) | Webhook cent amounts likely need updating |
| Cloudflare Pages hosting (referenced in roadmap) | GitHub Pages + CNAME (actual deployment) | No Cloudflare-specific verification needed |
| Test mode for real charge verification | Live mode required | Must use real card, not test card |

**Deprecated/outdated references in prior documents:**
- **"Lemon Squeezy" as merchant**: Phase 3 pivoted to Stripe. The webhook is called `ls-webhook.js` but actually handles Stripe webhooks.
- **"Cloudflare Pages" in roadmap**: The success criteria mentions "Cloudflare Pages production deployment" but the project uses GitHub Pages. Verify that the success criteria language about Cloudflare is vestigial — the actual site is on GitHub Pages at getcontentkit.com.
- **"Stripe Payment Links" in context**: These ARE the actual checkout mechanism (not LS). The buy.stripe.com URLs are the real checkout links.

---

## Open Questions

1. **Do the live Stripe Payment Links charge $147/$499 or $27/$47?**
   - What we know: index.html displays $147/$499, Stripe links `bJefZi8NU2lgfHc9TG9ws06` and `4gM8wQ0ho7FA3Yu1na9ws05` are the live links
   - What's unclear: What those links were configured with at creation time in the Stripe Dashboard
   - Recommendation: First task in 05-01 — open Stripe Dashboard and confirm prices. If $27/$47, update both the links AND the Netlify env vars. If $147/$499, only update Netlify env vars.

2. **Has the Plausible site (`getcontentkit.com`) been added to the Plausible account yet?**
   - What we know: Script tag `data-domain="getcontentkit.com"` is in all pages
   - What's unclear: Whether the domain was registered in the Plausible dashboard (required before tracking works)
   - Recommendation: 05-01 first task — go to plausible.io, confirm `getcontentkit.com` appears as a site, and add it if not.

3. **Are Google Ads and Meta Pixel accounts already created, or do they need to be?**
   - What we know: Placeholder IDs are in all HTML files; tracking-setup.md documents the creation process
   - What's unclear: Whether the user has already created these accounts
   - Recommendation: 05-01 must include verification. If accounts don't exist, create them per tracking-setup.md instructions and replace placeholders.

4. **Will the Stripe redirect support `?tier=` as a custom parameter?**
   - What we know: Stripe Payment Links post-payment configuration supports static redirect URLs and `{CHECKOUT_SESSION_ID}` dynamic parameter
   - What's unclear: Whether Stripe will preserve custom query params like `?tier=starter` in the redirect URL
   - Recommendation: Configure redirect URL as `https://getcontentkit.com/thank-you.html?tier=starter` and test. Stripe's documentation confirms query params in the redirect URL are preserved.

---

## Sources

### Primary (HIGH confidence)
- Project source files (`index.html`, `thank-you.html`, `03-03-SUMMARY.md`, `04-04-SUMMARY.md`) — current state of tracking implementation, Stripe URLs, webhook logic

### Secondary (MEDIUM confidence)
- [Plausible custom event goals docs](https://plausible.io/docs/custom-event-goals) — goal creation steps, event name matching requirement
- [Plausible ecommerce revenue tracking](https://plausible.io/docs/ecommerce-revenue-tracking) — revenue goal setup, `plausible()` API with revenue object
- [Stripe post-payment docs](https://docs.stripe.com/payment-links/post-payment) — redirect URL configuration, parameter passing
- [Lemon Squeezy testing and going live guide](https://docs.lemonsqueezy.com/guides/developer-guide/testing-going-live) — context on test vs. live mode (even though LS is not used, the concepts apply)

### Tertiary (LOW confidence)
- [EmailDeliverabilityReport — ConvertKit 2024](https://www.emaildeliverabilityreport.com/en/deliverability/convertkit/2024/) — Gmail inbox vs. Promotions placement rates (~58% primary, ~41% promotions)
- WebSearch results on iOS mobile checkout testing — general device testing principles

---

## Metadata

**Confidence breakdown:**
- Current project state: HIGH — read directly from source files and summary docs
- Plausible goal configuration: MEDIUM — verified with official Plausible docs
- Stripe redirect configuration: MEDIUM — verified with official Stripe docs
- Webhook cent amount mismatch: HIGH — directly derived from source code and pricing display
- Email deliverability: MEDIUM — based on 2024 benchmark reports, not project-specific measurement
- Ad platform placeholder replacement: HIGH — confirmed by grepping source files

**Research date:** 2026-02-27
**Valid until:** 2026-03-29 (30 days — Plausible and Stripe APIs are stable)

---

## Plan Structure Recommendation

Based on this research, the two plans should be structured as:

### 05-01: Analytics Configuration and Pre-Launch Setup
*All configuration that must be done before the end-to-end test*

1. Confirm Plausible site is registered for `getcontentkit.com`
2. Create three Plausible goals: `Purchase` (revenue), `Email Signup`, `Purchase Click`
3. Create Google Ads account (or confirm existing), get Conversion ID + Label, replace `AW-XXXXXXXXXX` across all HTML files
4. Create Meta Pixel (or confirm existing), get Pixel ID, replace `PIXEL_ID_HERE` across all HTML files
5. Configure Stripe redirect URLs: Starter → `?tier=starter`, Full Kit → `?tier=full`
6. Verify/update Netlify webhook env vars (`STRIPE_STARTER_AMOUNT`, `STRIPE_FULL_KIT_AMOUNT`) to match live payment link prices
7. Commit updated HTML files and push to GitHub (triggers GitHub Pages redeploy)

### 05-02: End-to-End Verification Checklist
*Human execution checklist — all steps require real services, real devices, or real money*

1. Real charge test: complete actual purchase with real card, verify redirect, verify conversion events, verify Kit tagging, verify receipt email, issue Stripe refund
2. Mobile device test: walk full flow on physical iOS or Android device (landing → opt-in → email → sales → checkout → thank-you)
3. Email deliverability: verify lead magnet email reaches Gmail Primary/Promotions (not spam) and Outlook inbox within 60 seconds
4. Notion template: verify all templates duplicate correctly from a fresh Notion account
5. Link audit: verify all navigation links, footer links, legal page links, and Stripe Payment Link URLs work on the live production domain
6. Plausible dashboard: confirm Purchase conversion event appears with correct revenue amount
7. Final go/no-go decision before paid traffic
