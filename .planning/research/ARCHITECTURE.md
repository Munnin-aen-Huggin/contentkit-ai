# Architecture Research

**Domain:** Faceless digital product business — static landing page + sales funnel
**Researched:** 2026-02-24
**Confidence:** HIGH (core architecture verified against official Stripe and Kit documentation; hosting constraints verified against Vercel and Netlify official pricing pages)

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        VISITOR ENTRY                             │
│  (organic, paid ads, social, referral)                           │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   STATIC HTML LAYER (Netlify CDN)                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Landing Page │  │  Sales Page  │  │  Thank-You / Download│   │
│  │ index.html   │  │  sales.html  │  │  thank-you.html      │   │
│  │              │  │              │  │  (post-purchase)     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘   │
│         │                 │                                      │
└─────────┼─────────────────┼──────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────┐  ┌──────────────────────────────────────────┐
│  EMAIL SERVICE  │  │            STRIPE PAYMENT LINKS           │
│  (Kit/ConvertKit│  │                                           │
│  embedded form) │  │  buy.stripe.com/...  ($27 — Tier 1)      │
│                 │  │  buy.stripe.com/...  ($47 — Tier 2)      │
│  - Lead magnet  │  │                                           │
│    automation   │  │  ┌──────────────────────────────────┐    │
│  - Welcome seq  │  │  │ after_completion: redirect →     │    │
│  - Nurture seq  │  │  │ /thank-you.html?session_id=...   │    │
│  - Buyer list   │  │  └──────────────────────────────────┘    │
└─────────────────┘  └──────────────────────────────────────────┘
```

The architecture is a composition of four independently-operated external services stitched together with URLs and JavaScript embeds. There is no shared backend, no server, and no database owned by this project.

---

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Landing Page | Capture attention, present free lead magnet offer, drive email opt-in | `index.html` + Tailwind CSS, embedded Kit form via JavaScript snippet |
| Sales Page | Present paid product offer, display both pricing tiers, link to checkout | `sales.html` + Tailwind CSS, two Stripe Payment Link buttons |
| Kit/ConvertKit | Collect email addresses, deliver lead magnet PDF, trigger nurture sequences, tag buyer subscribers | External SaaS — embedded via JavaScript on static HTML pages |
| Stripe Payment Links | Host checkout, collect payment, apply tax, redirect buyer post-purchase | External SaaS — no code required; two separate links for $27/$47 |
| Thank-You / Download Page | Confirm purchase, deliver product download, upsell or cross-sell | `thank-you.html` — receives redirect from Stripe with `{CHECKOUT_SESSION_ID}` in URL |
| Lead Magnet PDF | Free value exchange that builds email list | Static asset hosted on Netlify or linked from Kit's file hosting |
| Netlify | Host all static HTML/CSS files, serve from CDN globally | Push-to-deploy from Git; free tier supports commercial use |

---

## Recommended Project Structure

```
/
├── index.html              # Landing page — lead magnet opt-in (primary entry)
├── sales.html              # Sales page — paid product offer, both pricing tiers
├── thank-you.html          # Post-purchase page — download delivery, order confirm
├── lead-magnet-optin.html  # Optional: dedicated opt-in squeeze page variant
├── css/
│   └── styles.css          # Compiled Tailwind output
├── assets/
│   ├── images/             # Product mockups, hero images
│   └── fonts/              # Any custom fonts (prefer system fonts)
├── js/
│   └── main.js             # Minimal JS: scroll behavior, modal, any interactivity
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Build tooling only (Tailwind CLI)
└── netlify.toml            # Netlify deploy config (build command, publish dir)
```

### Structure Rationale

- **Flat HTML files at root:** Netlify serves flat files by convention; no build framework needed. `index.html` is the primary entry so the domain root converts immediately.
- **`css/`:** Single compiled Tailwind output. Keep CSS as one file — avoids render-blocking multiple requests.
- **`assets/`:** Static media separate from code. Netlify serves from CDN; reference paths stay stable.
- **`js/`:** One optional JS file. The architecture is intentionally JavaScript-light — Kit and Stripe each inject their own scripts via embed snippets; don't fight them.
- **No `src/` or framework structure:** Overkill for this project. Static HTML needs no compilation beyond Tailwind's CSS build step.

---

## Architectural Patterns

### Pattern 1: URL-Stitched Third-Party Composition

**What:** Each stage of the funnel hands off to the next via URL. The landing page's Kit form submit redirects to a success URL. Stripe Payment Links redirect to `/thank-you.html?session_id={CHECKOUT_SESSION_ID}` on purchase completion. No shared session or backend coordinates these transitions.

**When to use:** Always — this is the only architecture available without a backend.

**Trade-offs:** Simple to build and maintain; no server costs. Downside is that you cannot verify on the thank-you page whether a legitimate Stripe session occurred (the `session_id` in the URL can be inspected but not verified server-side without a backend function). For a $27–$47 product, this is acceptable — the download link exposure risk is low.

**Example:**
```html
<!-- Stripe Payment Link buttons on sales.html -->
<a href="https://buy.stripe.com/YOUR_LINK_TIER1"
   class="btn-primary">
  Get ContentKit AI — $27
</a>

<a href="https://buy.stripe.com/YOUR_LINK_TIER2"
   class="btn-primary">
  Get ContentKit AI Pro — $47
</a>
```

```
Stripe Dashboard → Payment Link settings → "After the payment" tab
→ Set: Redirect to URL
→ URL: https://yourdomain.com/thank-you.html?session={CHECKOUT_SESSION_ID}
```

### Pattern 2: Kit Form Embed for Dual-Purpose Email Capture

**What:** A single Kit form on the landing page captures the lead, immediately triggers an automation that delivers the free PDF, and simultaneously adds the subscriber to the nurture sequence. The embed is a JavaScript snippet — Kit handles form validation, submission, GDPR consent checkbox, and delivery email.

**When to use:** Always for the lead magnet opt-in. Kit's JavaScript embed works on any static HTML page that allows custom script tags.

**Trade-offs:** Requires Kit account (free tier works). Form styling is constrained to what Kit exposes as CSS variables unless you use the raw HTML embed method (which breaks automatic updates). Recommended: use the JavaScript embed and override styles with Kit's CSS variable API.

**Example:**
```html
<!-- Paste Kit-generated script tag into index.html <head> or before </body> -->
<script async data-uid="YOUR_FORM_UID" src="https://youraccount.kit.com/YOUR_FORM_UID/index.js"></script>
```

### Pattern 3: Separate Stripe Payment Links Per Pricing Tier

**What:** Create two independent Stripe Payment Links — one for each price point ($27, $47). Each link is a standalone Stripe-hosted checkout URL. Both redirect to the same `/thank-you.html` page after purchase; the page content is the same because both tiers get the same core product.

**When to use:** Always for two-tier one-time payment products. Do not try to build a pricing selector that dynamically changes a single link — Stripe Payment Links are static URLs.

**Trade-offs:** Two links to manage in Stripe Dashboard. Both should redirect to the same thank-you page. If tiers deliver different products, create two separate thank-you pages.

---

## Data Flow

### Lead Magnet Funnel Flow

```
Visitor lands on index.html
    ↓
Fills Kit opt-in form (name + email)
    ↓
Kit processes submission (external — no server touch)
    ↓
Kit triggers Automation:
  → Sends "Here's your free PDF" email with download link
  → Adds subscriber to "Leads" sequence (nurture emails)
    ↓
Visitor sees Kit's on-page confirmation ("Check your inbox!")
    ↓
Kit nurture sequence runs over days/weeks
  → Email 1 (Day 0): PDF delivery + welcome
  → Email 2 (Day 2): Value tip from the product domain
  → Email 3 (Day 4): Social proof / testimonial
  → Email 4 (Day 6): Soft pitch to sales page
  → Email 5 (Day 9): Hard pitch with scarcity/urgency
```

### Purchase Funnel Flow

```
Visitor lands on sales.html
    ↓
Clicks pricing button (Tier 1 $27 or Tier 2 $47)
    ↓
Browser redirects to Stripe Payment Link URL (buy.stripe.com/...)
    ↓
Stripe hosts checkout:
  → Collects payment details
  → Processes charge
  → Sends Stripe receipt email automatically
    ↓
Stripe redirects to:
  https://yourdomain.com/thank-you.html?session={CHECKOUT_SESSION_ID}
    ↓
thank-you.html renders:
  → "Your purchase is confirmed" message
  → Download button or link to product PDF
  → Optionally: upsell to higher tier or complementary product
```

### Key Data Flows

1. **Email address:** Captured by Kit form on index.html → stored in Kit → used for lead nurture sequence → never touches your server.
2. **Payment:** Collected by Stripe on Stripe's domain → Stripe issues receipt → redirects buyer back to your thank-you page with session ID in URL → money deposited to your bank account by Stripe.
3. **Product delivery:** Download link lives on thank-you.html (static, always-accessible URL) → buyer bookmarks or re-visits from Stripe receipt email → no DRM, no auth required (acceptable at this price point and scale).
4. **Buyer email:** Not automatically captured from Stripe into Kit. If you want to add buyers to a separate "Customer" Kit sequence, requires either a Zapier/Make automation (Stripe → Kit) or manual export from Stripe Dashboard.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–1,000 buyers/month | No changes. Static HTML on Netlify + Stripe Payment Links + Kit handles this load with zero effort. Netlify free tier (300 credits/month) covers typical marketing site traffic. |
| 1,000–10,000 buyers/month | Netlify free tier may require upgrade to Starter ($19/mo) for bandwidth. Consider adding a Stripe webhook listener (Netlify Function) to auto-tag buyers in Kit. |
| 10,000+ buyers/month | Add proper download protection: move product PDF behind a token-based URL (Netlify Edge Function or simple redirect) so the download link isn't publicly crawlable. Consider a proper email service contract with Kit. |

### Scaling Priorities

1. **First bottleneck — download link exposure:** The thank-you page with a direct PDF link is publicly accessible by URL. At low volume this is fine. At scale, a determined person could share the URL. Fix by moving PDF delivery entirely to Kit's email (Kit hosts the file) and removing the direct link from thank-you.html.
2. **Second bottleneck — buyer segmentation:** Stripe does not automatically push buyer data to Kit. At scale, managing this manually becomes painful. Fix with a Zapier automation: Stripe `payment.succeeded` → add/tag subscriber in Kit as "Buyer."

---

## Anti-Patterns

### Anti-Pattern 1: Hosting on Vercel Free Tier for a Commercial Product

**What people do:** Deploy the landing page on Vercel's Hobby (free) plan because it's popular for developers.

**Why it's wrong:** Vercel's Hobby plan explicitly states it is "for personal, non-commercial use." A sales funnel generating revenue violates Vercel's terms of service. Vercel can suspend the site without warning. Source: Vercel pricing page and community documentation confirm commercial activity requires the Pro plan ($20/mo per member).

**Do this instead:** Use Netlify's free tier, which does not have a commercial use restriction. Netlify's free plan supports commercial deployments and provides 100 GB bandwidth and 300 build credits per month.

### Anti-Pattern 2: Building a Custom Checkout Instead of Using Stripe Payment Links

**What people do:** Try to integrate Stripe.js / Elements directly into their HTML to keep users "on-site" during checkout.

**Why it's wrong:** Stripe Elements requires a server-side component to create a PaymentIntent (you cannot safely call the Stripe API from client-side JavaScript without exposing your secret key). Without a backend, this is not securely implementable. Stripe Payment Links are purpose-built for exactly this no-backend scenario.

**Do this instead:** Use Stripe Payment Links. They are a hosted checkout page on Stripe's domain, fully PCI-compliant, require zero backend, and support custom post-purchase redirects.

### Anti-Pattern 3: Attempting to Verify Purchase on the Thank-You Page Client-Side

**What people do:** Try to read the `session_id` URL parameter on thank-you.html and make a client-side Stripe API call to verify it's a real, completed session before showing the download link.

**Why it's wrong:** Verifying a Stripe session requires the secret key, which cannot be exposed in client-side JavaScript. Any "verification" logic written in the browser is bypassable.

**Do this instead:** Accept that the thank-you page is effectively public at this price point. The simplest mitigation is to deliver the product via Kit email (Kit sends the download link to the buyer's email address) rather than putting the direct PDF link on the public thank-you page. This requires a Stripe → Kit Zapier automation but eliminates the exposure.

### Anti-Pattern 4: Using One Kit Sequence for Both Leads and Buyers

**What people do:** Drop everyone — leads from the free opt-in and paying customers — into the same Kit sequence.

**Why it's wrong:** Buyers should not receive "you should buy this product" emails they already paid for. Sending sales emails to customers damages trust and increases unsubscribes.

**Do this instead:** Maintain two Kit segments/tags: `lead` (opted in for free PDF, not yet purchased) and `buyer` (completed Stripe checkout). Buyers get a separate post-purchase sequence focused on product success and upsells — not sales pitches.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Kit (ConvertKit) | JavaScript embed snippet in `<head>` or before `</body>` | Works on any HTML page that allows custom script tags. JavaScript embed auto-updates if form changes in Kit dashboard. Raw HTML embed requires manual re-copy on form changes. |
| Stripe Payment Links | Hyperlink (`<a href="https://buy.stripe.com/...">`) | No JavaScript required. Configure post-purchase redirect in Stripe Dashboard → Payment Link → "After the payment" tab. Set to redirect to `/thank-you.html?session={CHECKOUT_SESSION_ID}`. |
| Netlify | Push-to-deploy from Git repository | Add `netlify.toml` to control build command (`npm run build` for Tailwind CSS compilation) and publish directory (root `/`). Free tier supports commercial use. |
| Tailwind CSS | Build-time CSS compilation only | Run `tailwind -i ./css/input.css -o ./css/styles.css --watch` locally. Commit compiled `styles.css`. Netlify runs the build command on deploy. No JavaScript runtime dependency. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| index.html ↔ Kit | JavaScript embed + form submit POST to Kit's servers | Kit handles the HTTP request. Your page only renders Kit's embed script. |
| sales.html ↔ Stripe | Hyperlink URL redirect | Browser navigates away to Stripe's domain. No JavaScript required. |
| Stripe ↔ thank-you.html | HTTP redirect with `session_id` query parameter | Stripe appends session ID to the redirect URL. thank-you.html reads it via `window.location.search` if needed for display personalization only (not for security). |
| Stripe ↔ Kit (buyer tagging) | Not connected natively — requires Zapier/Make | Zero-code path: export buyers from Stripe CSV and import to Kit manually. Automation path: Zapier `Stripe: New Charge` → `Kit: Add Subscriber Tag`. |

---

## Build Order (Phase Dependencies)

The architecture has a clear dependency chain that dictates the build order:

```
1. Tailwind CSS setup + base HTML structure
       ↓ (required before any visible pages)
2. Landing page (index.html) + Kit form embed
       ↓ (email capture must work before nurture can run)
3. Kit automations: lead magnet delivery + welcome sequence
       ↓ (Kit configured before you drive traffic)
4. Sales page (sales.html) with pricing tiers
       ↓ (needs Stripe products created first)
5. Stripe: create products + payment links ($27, $47)
       ↓ (links needed before sales page can link to them)
6. Thank-you / download page (thank-you.html)
       ↓ (depends on Stripe redirect URL being configured)
7. Netlify deployment + custom domain
       ↓ (all pages must exist before going live)
8. End-to-end test: opt-in flow + purchase flow
```

**Critical dependency:** Stripe Payment Links must be created (Step 5) before the sales page can be finalized (Step 4) because the actual `buy.stripe.com/...` URLs must be embedded in the HTML. Do not finalize sales.html with placeholder links and deploy — the URLs must be real.

**Secondary dependency:** Kit automations (Step 3) should be built and tested before driving any traffic. If the lead magnet delivery automation is broken, early opt-ins receive no email and are lost.

---

## Sources

- Stripe Payment Links post-payment documentation: https://docs.stripe.com/payment-links/post-payment — HIGH confidence, official Stripe docs
- Stripe Payment Links customization: https://docs.stripe.com/payment-links/customize — HIGH confidence, official Stripe docs
- Kit form embedding basics: https://help.kit.com/en/articles/4009572-form-embedding-basics — HIGH confidence, official Kit docs
- Vercel Hobby plan commercial use restriction: https://vercel.com/pricing + Vercel Community discussion — HIGH confidence, verified against official pricing page
- Netlify pricing and commercial use: https://www.netlify.com/pricing/ — MEDIUM confidence (commercial use confirmed; credit limits verified but subject to Netlify plan changes)
- Stripe Payment Links URL parameters: https://docs.stripe.com/payment-links/url-parameters — HIGH confidence, official Stripe docs
- Kit lead magnet delivery pattern: https://www.emakatiraee.com/blog/lead-magnet-convertkit + official Kit docs — MEDIUM confidence (pattern widely confirmed across multiple creator sources)
- Stripe ↔ Kit buyer tagging gap: derived from confirmed absence of native integration — MEDIUM confidence (Zapier solution widely documented)

---
*Architecture research for: Faceless digital product sales funnel — zero backend, static HTML*
*Researched: 2026-02-24*
