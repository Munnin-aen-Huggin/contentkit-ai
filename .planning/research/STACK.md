# Stack Research

**Domain:** Faceless digital product business — static landing page + email capture + Stripe Payment Links + digital delivery
**Researched:** 2026-02-24
**Confidence:** HIGH (core stack verified via official docs; hosting recommendation verified via official pricing pages)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| HTML5 (vanilla) | N/A | Page structure | Zero build complexity for a single-page static site; no framework overhead; deploys anywhere instantly. A React/Next.js site is engineering overkill when there is no dynamic server-side state — one `.html` file is the right abstraction. |
| Tailwind CSS | v4.x (stable since 2025-01-22) | Utility-first styling | Industry standard for rapid, custom-looking UIs without writing CSS files. v4 eliminates the `tailwind.config.js` requirement — just `@import "tailwindcss"` in your CSS. The CSS-first config approach and Lightning CSS engine make it ideal for single-file static projects. |
| Alpine.js | v3.x (latest stable) | Minimal interactivity (modals, toggle states, FAQ accordions) | 15 kB gzipped; lives in HTML attributes like `x-data`, `x-show`, `x-on:click`. Perfect for the small interactions a landing page needs (mobile menu, scroll-triggered sections, form state) without pulling in Vue or React. Pairs naturally with Tailwind. Do not use jQuery — it is 90 kB for no benefit here. |
| Cloudflare Pages | Free tier | Static site hosting + CDN | Unlimited bandwidth and unlimited requests on the free tier with commercial use explicitly allowed. 500 builds/month. 300+ edge locations globally. After Netlify's September 2025 pricing shift to credit-based billing (30 GB effective free bandwidth), Cloudflare Pages is now the clear zero-cost winner for commercial static sites. |

### Email Capture & Automation

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Kit (formerly ConvertKit) | Free plan | Email list, lead magnet delivery, post-purchase sequences | Free up to 10,000 subscribers with unlimited emails, unlimited forms, and unlimited landing pages. Forms embed via `<script>` tag or raw HTML — no backend required. Kit is creator-first: tags, sequences, and automations are first-class. MailerLite is cheaper at scale but Kit's free plan is more generous (10K vs 500 subscribers) for bootstrapped launch. |

### Payments

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Stripe Payment Links | Dashboard-created (no SDK needed) | $27/$47 tier checkout | No backend required. Create payment links in the Stripe Dashboard, set `after_completion` to redirect, include `{CHECKOUT_SESSION_ID}` in the redirect URL. Stripe-hosted checkout handles PCI compliance, Apple Pay/Google Pay, 20+ payment methods, adaptive pricing (17% average uplift on cross-border revenue), and localization to 30+ languages — all for free. Do not build a custom checkout. |

### Digital Delivery

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Static download page (HTML) | N/A | Post-purchase file delivery | Simplest approach: Stripe Payment Link redirects to `download.html?session={CHECKOUT_SESSION_ID}`. The page reads the session ID from the URL via `URLSearchParams` in vanilla JS. Because the product is a PDF/template pack (not high-value gated software), URL-based access is acceptable — the "security" is obscurity of the URL plus the fact that the buyer just paid. This avoids any backend entirely. |
| Cloudflare R2 (optional) | Free tier | PDF/asset storage if files exceed Pages 25 MB limit | R2 gives 10 GB free storage with zero egress fees. Use only if product files exceed Cloudflare Pages' 25 MiB per-file limit. For most prompt packs and Notion templates as zip files under 25 MB, store assets directly in the Pages repo. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Fonts (via CSS `@import`) | N/A | Typography | Use a single font family (e.g., Inter or Plus Jakarta Sans) loaded via CSS import. Do not use a JS font loader — it blocks rendering. |
| Font Awesome or Heroicons (SVG inline) | Heroicons v2 | Icons | Inline SVG icons add zero HTTP requests. Use Heroicons (MIT-licensed, Tailwind-native) by copy-pasting SVG directly into HTML. Do not load an icon font CDN — it costs 50–200 ms on first load. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| VS Code | Code editor | Standard; install Tailwind CSS IntelliSense extension for class autocomplete |
| Vite (optional) | Local dev server + Tailwind v4 build pipeline | Required only if using Tailwind v4's Vite plugin for HMR during development. For a single HTML file, the Tailwind CLI standalone binary (`npx @tailwindcss/cli`) is simpler — no `npm init` needed. |
| Tailwind CSS CLI (standalone) | CSS build | `npx @tailwindcss/cli@latest -i ./input.css -o ./output.css --watch` — produces a minified CSS file with only the classes used. No Node.js project required. |
| Git + GitHub | Version control | Push-to-deploy triggers Cloudflare Pages CI automatically. |

---

## Installation

```bash
# Option A: Simplest (Tailwind CLI, no npm project)
# Download standalone Tailwind CLI binary from https://github.com/tailwindlabs/tailwindcss/releases
# Run: ./tailwindcss -i input.css -o output.css --watch

# Option B: With npm (if using Vite for HMR)
npm init -y
npm install -D tailwindcss @tailwindcss/vite vite

# Alpine.js (via CDN in HTML — no npm install needed)
# Add to <head>:
# <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

# No backend dependencies. No server. No Node runtime in production.
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Cloudflare Pages | Netlify | Only if you need Netlify's built-in form handling or identity features — but Netlify's September 2025 credit pricing means ~30 GB effective free bandwidth vs Cloudflare's unlimited. For pure static hosting, Cloudflare Pages is superior. |
| Cloudflare Pages | Vercel | Vercel prohibits commercial use on the free Hobby tier. Not suitable for a revenue-generating product. |
| Kit (ConvertKit) free | MailerLite free | MailerLite's free tier was cut to 500 subscribers in September 2025. Kit's free tier goes to 10,000. Use MailerLite only after outgrowing Kit's free tier when cost per subscriber matters. |
| Stripe Payment Links | Stripe Checkout (API) | Use Checkout API only if you need to pass customer metadata server-side (e.g., dynamic pricing, license key generation). Payment Links require zero code and zero backend. |
| Stripe Payment Links | Gumroad / Lemon Squeezy | Use these platforms only if you want them to handle VAT/tax compliance globally. Stripe Payment Links require manual VAT handling if selling to EU customers. Lemon Squeezy acts as merchant of record — relevant if EU sales are significant. |
| Alpine.js | React / Next.js | Use Next.js only if the site needs SSR, a database, or API routes. A static landing page has none of these needs. React adds 40–130 kB of JS bundle for no benefit. |
| Vanilla HTML | Astro | Use Astro if you have multiple pages, a blog, or need component reuse across pages. For a single landing page + one download page, Astro's build pipeline is unnecessary overhead. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js / React | Adds 40-130 kB JS bundle, requires Node.js runtime or serverless functions, Vercel free tier prohibits commercial use. Massive complexity for a 2-page static site. | Vanilla HTML + Alpine.js |
| Vercel (free tier) | Explicitly prohibits monetized/commercial projects on the Hobby plan. Risk of account suspension. | Cloudflare Pages |
| Netlify (new accounts, 2026) | September 2025 pricing change to credit-based billing; effective free bandwidth is ~30 GB/month (300 credits ÷ 10 credits per GB). Pauses site on limit hit. | Cloudflare Pages |
| WordPress | Runtime PHP server, database, plugin maintenance, hosting costs $5-15/month minimum. Completely wrong tool for a static product page. | Vanilla HTML |
| jQuery | 90 kB for DOM manipulation that vanilla JS or Alpine.js handles in 15 kB or 0 kB. Deprecated pattern. | Alpine.js or vanilla JS |
| Stripe Checkout (API) | Requires a backend/serverless function to create sessions. Adds Node.js + deployment complexity for zero added value vs Payment Links. | Stripe Payment Links |
| MailerLite (free tier, new subscribers) | Reduced to 500 subscribers cap in September 2025. You will hit this within weeks of a successful launch. | Kit (10,000 free subscribers) |
| Webflow | $14-23/month minimum, proprietary CMS lock-in, overkill for a static page you control. | Vanilla HTML + Tailwind |
| PDF hosting on Google Drive | Drive rate-limits public file downloads at scale, can flag files as spam, and randomly breaks public share links. | Cloudflare Pages static assets or R2 |

---

## Stack Patterns by Variant

**If product files (PDFs + zip) are under 25 MB total:**
- Store directly in the Cloudflare Pages repo
- No R2 needed
- Because Cloudflare Pages serves static assets for free with no egress

**If product files exceed 25 MB or you add more products over time:**
- Add Cloudflare R2 for file storage (10 GB free, zero egress cost)
- Generate signed R2 URLs from a Cloudflare Worker (free tier: 100,000 requests/day)
- Because R2 is the cheapest object storage with no bandwidth fees

**If EU customer volume becomes significant (>10% of revenue):**
- Migrate payment processing to Lemon Squeezy (merchant of record)
- Because Stripe Payment Links do NOT handle EU VAT/GST automatically; Lemon Squeezy does
- This is a later-phase concern, not day-one

**If list grows past 10,000 subscribers:**
- Upgrade Kit to Creator plan ($25/month for up to 10K, then $50/month to 25K) or migrate to MailerLite at comparable price
- Because Kit's free plan hard-limits at 10K and you'll need sequences + automations at that scale

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Tailwind CSS v4 | Vite 5.x | Requires `@tailwindcss/vite` plugin; PostCSS config is not needed when using the Vite plugin |
| Tailwind CSS v4 | Tailwind CLI standalone | Works without any Node.js project; download binary directly from GitHub releases |
| Alpine.js v3.x | Tailwind CSS v4 | No compatibility issues; both operate independently in HTML |
| Stripe Payment Links | Any static HTML page | No SDK required; Payment Links redirect via browser after payment |

---

## Delivery Architecture (No Backend)

The entire post-purchase flow works without a server:

```
Visitor lands on index.html
  → Clicks "Buy Now" (href to Stripe Payment Link)
  → Stripe-hosted checkout (PCI compliant, Apple Pay, etc.)
  → Stripe redirects to: download.html?session_id={CHECKOUT_SESSION_ID}
  → download.html reads session_id from URL via URLSearchParams
  → Shows download button (links directly to static PDF/zip in /assets/)
  → Kit form on download page captures email for post-purchase sequence
```

The session ID in the URL is used for display/trust purposes (confirms payment happened), not for cryptographic access control. For $27-$47 digital products, this is the standard acceptable approach. If piracy becomes a real concern at scale, add Cloudflare Workers to generate time-limited signed URLs.

---

## Sources

- Tailwind CSS v4 official release blog: https://tailwindcss.com/blog/tailwindcss-v4 — version confirmed, setup changes verified (HIGH confidence)
- Stripe Payment Links post-payment docs: https://docs.stripe.com/payment-links/post-payment — `{CHECKOUT_SESSION_ID}` redirect pattern verified (HIGH confidence)
- Cloudflare Pages limits docs: https://developers.cloudflare.com/pages/platform/limits/ — build limits, file size, domain limits verified (HIGH confidence)
- Cloudflare Pages unlimited bandwidth confirmed via official pricing: https://pages.cloudflare.com — commercial use, unlimited bandwidth (HIGH confidence)
- Kit pricing page (via emailtooltester.com, 2026): https://www.emailtooltester.com/en/reviews/convertkit/pricing/ — 10,000 subscriber free plan limit (MEDIUM confidence; verify current limits at kit.com/pricing)
- MailerLite free plan update (500 subscriber limit effective September 2025): https://www.mailerlite.com/help/free-plan-update-faq (HIGH confidence — official MailerLite docs)
- Netlify credit-based pricing (September 2025): https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ — 10 credits/GB, 300 credits/month free (HIGH confidence — official Netlify docs)
- Vercel commercial use restriction on Hobby tier: https://vercel.com/kb/guide/vercel-vs-netlify (MEDIUM confidence — verify at vercel.com/pricing before recommending to client)
- MailerLite vs Kit comparison (Dreamgrow, 2026): https://www.dreamgrow.com/mailerlite-vs-convertkit/ (MEDIUM confidence)
- Alpine.js official site: https://alpinejs.dev/ (HIGH confidence — framework confirmed stable at v3)

---

*Stack research for: ContentKit AI — faceless digital product business (static landing page + Stripe Payment Links + email capture + digital delivery)*
*Researched: 2026-02-24*
