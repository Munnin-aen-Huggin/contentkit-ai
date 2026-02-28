# Phase 4: Front-End Build - Research

**Researched:** 2026-02-26
**Domain:** Static HTML / Tailwind CSS v4 / Stripe Payment Links / Open Graph / Performance
**Confidence:** HIGH (stack is locked and already in production; findings verified against official docs)

---

## Summary

Phase 4 is predominantly an editing and gap-filling exercise on an existing, well-structured `index.html`, not a greenfield build. The stack is already decided and working: static HTML, Tailwind v4 (standalone CLI, `output.css` committed), Alpine.js v3 via CDN, hosted on GitHub Pages at getcontentkit.com. The compiled CSS weighs 22KB — well within budget for sub-2-second loads.

The two most consequential tasks are (1) wiring Stripe Payment Links to the buy buttons and configuring redirect to `thank-you.html`, and (2) adding Open Graph / SEO meta tags and a proper OG image. Everything else — inserting the two missing sections (PAGE-04 sample prompt preview, PAGE-08 "Who this is NOT for"), building out `thank-you.html`, and creating three legal pages — is standard HTML authoring with the existing Tailwind token system.

Performance is achievable without major changes. The site is already static with a small CSS payload. The primary risk to sub-2-second LCP on Lighthouse's mobile simulation (150ms RTT, 1.6 Mbps down, 4x CPU throttle) is the Google Fonts `@import` in `<head>` and external requests. Self-hosting Inter as WOFF2 with `<link rel="preload">` is the single highest-impact performance move available.

**Primary recommendation:** Fix Stripe button hrefs first (unblocks sales), then add OG tags (unblocks social sharing), then fill the two missing page sections, then expand `thank-you.html`, then create legal pages, then run PageSpeed and address any remaining issues.

---

## Standard Stack

### Core (Already In Use — Do Not Change)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS v4 | v4.2.1 (confirmed in output.css) | Utility CSS | Standalone CLI, zero-config content detection, `output.css` already committed |
| Alpine.js | v3.x (CDN) | Lightweight interactivity (FAQ accordion, sticky nav) | Already loaded in `index.html`, handles FAQ `<details>` toggle with zero JS overhead |
| Static HTML | — | Page delivery | No build step, directly deployed to GitHub Pages |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Inter (Google Fonts) | Current | Body + heading typeface | Already in use via `@import` — candidate for self-hosting to eliminate render-blocking |
| GitHub Pages CDN | — | Hosting + HTTPS | Already configured via CNAME (`getcontentkit.com`); serves with `max-age=600` (10 min) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Self-hosted WOFF2 | Google Fonts CDN `@import` | `@import` in `<head>` is render-blocking, adds DNS lookup + TLS; self-hosted eliminates both. Measured improvement: 848ms on 4G, 1.3s on 3G |
| `<details>/<summary>` (current FAQ) | Alpine.js `x-show` accordion | `<details>` works without JS and is already in place; no change needed |
| No sales.html | Separate sales.html | Per prior decisions: sales page is the same as index.html; no separate page needed |

**Installation:** No new packages. Rebuild CSS after adding new Tailwind classes with:
```bash
./tailwindcss -i src/input.css -o output.css --minify
```

---

## Architecture Patterns

### Recommended Project Structure (Current + Required New Files)

```
/
├── index.html              # Lead magnet LP + full sales page (exists, needs gaps filled)
├── thank-you.html          # Post-purchase page (exists as stub, needs full build)
├── privacy-policy.html     # Legal page (new)
├── terms-of-service.html   # Legal page (new)
├── refund-policy.html      # Legal page (new)
├── output.css              # Compiled Tailwind (committed, regenerate after edits)
├── src/input.css           # Tailwind source
├── CNAME                   # getcontentkit.com
└── downloads/              # PDFs served directly
    └── 5-ai-prompts-lead-magnet.pdf
```

### Pattern 1: Stripe Payment Link Button Wiring

**What:** Replace placeholder `href="#"` with live Stripe Payment Link URLs. The `<a>` tag IS the buy button — no JS required.

**When to use:** Every "Buy Now" / "Get Starter Kit" / "Get Full Kit" button.

**Implementation:**
```html
<!-- Starter Kit button — replace href="#" -->
<a href="https://buy.stripe.com/cNidRa7JQaRMbqWaXK9ws00"
   id="starter-btn"
   class="block w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition">
  Get Starter Kit
</a>

<!-- Full Kit button — replace href="#" -->
<a href="https://buy.stripe.com/5kQ8wQ8NUe3Y2Uq7Ly9ws01"
   id="full-btn"
   class="block w-full text-center bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-bold transition transform hover:scale-105">
  Get Full Kit
</a>
```

**CRITICAL:** After updating hrefs, configure the redirect URL in the Stripe Dashboard for EACH Payment Link:
1. Go to Stripe Dashboard > Payment Links
2. Click the Payment Link > Edit
3. Click "After the payment" section
4. Select "Redirect customers to your website"
5. Enter: `https://getcontentkit.com/thank-you.html`
6. Save

This is a Dashboard-only action — cannot be done in HTML.

### Pattern 2: Open Graph + SEO Meta Tags

**What:** Required tags for social preview (Facebook, Twitter/X, LinkedIn) and SEO.

**When to use:** `<head>` of every HTML page (at minimum `index.html` and `thank-you.html`).

**Required tags — `index.html`:**
```html
<!-- SEO -->
<title>ContentKit AI — 500+ AI Marketing Prompts & Templates</title>
<meta name="description" content="500+ battle-tested AI prompts for ads, emails, social posts, and landing pages. One-time $47. Works with ChatGPT, Claude, and any AI.">
<link rel="canonical" href="https://getcontentkit.com/">

<!-- Open Graph (Facebook, LinkedIn, Discord) -->
<meta property="og:type" content="website">
<meta property="og:title" content="ContentKit AI — 500+ AI Marketing Prompts">
<meta property="og:description" content="Stop staring at a blank screen. 500+ copy-paste prompts that generate converting ads, emails, and social posts in seconds.">
<meta property="og:url" content="https://getcontentkit.com/">
<meta property="og:image" content="https://getcontentkit.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ContentKit AI — 500+ AI Marketing Prompts">
<meta property="og:site_name" content="ContentKit AI">

<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="ContentKit AI — 500+ AI Marketing Prompts">
<meta name="twitter:description" content="Stop staring at a blank screen. 500+ copy-paste prompts that generate converting ads, emails, and social posts in seconds.">
<meta name="twitter:image" content="https://getcontentkit.com/og-image.png">
<meta name="twitter:image:alt" content="ContentKit AI — 500+ AI Marketing Prompts">
```

**OG Image specs:** 1200×630px PNG or JPG. Must be served over HTTPS (GitHub Pages provides HTTPS). Twitter requires HTTPS — HTTP images will not display.

**Note:** `twitter:card` uses `name` attribute, NOT `property`. All other OG tags use `property`.

### Pattern 3: Sample Prompt Preview Section (PAGE-04)

**What:** A concrete example prompt from the kit shown in a styled "code card" to demonstrate value before purchase.

**When to use:** Between the "What's Inside" section and Testimonials in `index.html`.

**Content source:** Use prompt FB-01 from `/Users/wilfredshammah/Desktop/dp/downloads/ai-prompt-kit-full-content.md` — a Facebook PAS-framework ad prompt. It is concrete, scannable, and shows the structural quality of the kit.

**Pattern:**
```html
<!-- Sample Prompt Preview -->
<section class="py-20 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <div class="inline-block bg-brand-500/10 text-brand-500 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">REAL EXAMPLE FROM THE KIT</div>
    <h2 class="text-3xl md:text-4xl font-bold mb-4">See a Real Prompt</h2>
    <p class="text-gray-400 mb-10 max-w-2xl mx-auto">Every prompt in ContentKit is engineered like this — with a role, a framework, and clear variables you replace with your own details.</p>
    <div class="bg-dark-800/50 border border-white/10 rounded-xl p-6 md:p-8 text-left">
      <div class="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-4">FB-01: Facebook Ad — PAS Framework</div>
      <p class="text-gray-300 text-sm leading-relaxed font-mono">
        Act as a direct-response copywriter specializing in Facebook ads. Write a PAS-framework Facebook ad for <span class="text-brand-500">[PRODUCT/SERVICE NAME]</span>. Target audience: <span class="text-brand-500">[TARGET AUDIENCE]</span>. Pain point: <span class="text-brand-500">[CORE PAIN]</span>. Agitate by describing the emotional and financial cost of this problem. Solution: position <span class="text-brand-500">[PRODUCT/SERVICE NAME]</span> as the fix. Include a primary text (up to 125 words), a short headline (under 40 characters), and a description (under 30 characters). End with a CTA button label from this list: [Learn More / Shop Now / Sign Up / Get Quote / Download].
      </p>
      <div class="mt-6 pt-6 border-t border-white/5 text-xs text-gray-500">500+ prompts like this, organized across 9 categories — ready to copy, fill in, and use.</div>
    </div>
  </div>
</section>
```

### Pattern 4: "Who This Is NOT For" Section (PAGE-08)

**What:** Trust-building filter section that disqualifies bad-fit buyers and implicitly qualifies ideal buyers.

**When to use:** After the FAQ and before or after the Final CTA in `index.html`.

**Pattern:**
```html
<!-- Who This Is NOT For -->
<section class="py-20 px-6">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">Who This Is NOT For</h2>
    <p class="text-gray-400 text-center mb-10">ContentKit is a powerful tool — but it's not for everyone.</p>
    <div class="bg-dark-800/50 border border-white/10 rounded-xl p-8 space-y-4">
      <div class="flex gap-4"><span class="text-red-400 mt-0.5">✕</span><p class="text-gray-400">People who want a magic button that creates finished campaigns with zero input or thought</p></div>
      <div class="flex gap-4"><span class="text-red-400 mt-0.5">✕</span><p class="text-gray-400">Businesses with no product-market fit looking for copy to rescue a broken offer</p></div>
      <div class="flex gap-4"><span class="text-red-400 mt-0.5">✕</span><p class="text-gray-400">Those who won't spend 30 minutes learning how to use the prompts effectively</p></div>
      <div class="flex gap-4"><span class="text-red-400 mt-0.5">✕</span><p class="text-gray-400">Anyone expecting agency-level strategy included at this price point</p></div>
    </div>
    <p class="text-gray-500 text-sm text-center mt-6">If that's not you — you're exactly who we built this for.</p>
  </div>
</section>
```

### Pattern 5: Thank-You Page Structure

**What:** Full post-purchase confirmation page that satisfies PAY-04 and Stripe's redirect.

**When to use:** `thank-you.html` — Stripe redirects here after purchase.

**Key elements:**
- Confirmation message + checkmark visual
- Primary instruction: "Check your email — download links are on their way"
- Secondary: What to expect (Kit delivery email, PDF links)
- Optional: Social sharing prompt ("Know someone who'd love this?")
- Link back to site / help email
- Same nav and footer as index.html for brand consistency

**Note:** The Stripe redirect URL will be `https://getcontentkit.com/thank-you.html`. No `{CHECKOUT_SESSION_ID}` parameter is needed since there is no server-side fulfillment — Kit handles email delivery of download links automatically.

### Pattern 6: Legal Pages (Minimal but Functional)

**What:** Three static HTML pages with text content only; no complex layout needed.

**Pages required:**
- `privacy-policy.html`
- `terms-of-service.html`
- `refund-policy.html`

**Content guidance for digital products:**
- **Privacy Policy:** Must cover: what data is collected (email via Kit), how it's used (email marketing), third-party processors (Kit, Stripe), and user rights (unsubscribe). GDPR/CCPA mention recommended even for US sellers.
- **Terms of Service:** Cover: license grant (personal use, commercial use of outputs), no resale of prompts themselves, intellectual property, limitation of liability.
- **Refund Policy:** Specify: 30-day money-back guarantee (already stated on page), digital product non-returnable language, how to request (email to support), processing time.

**Footer wire-up:** Replace `href="#"` on Terms and Privacy links in the `index.html` footer:
```html
<a href="terms-of-service.html" class="hover:text-white transition">Terms</a>
<a href="privacy-policy.html" class="hover:text-white transition">Privacy</a>
```
Add a Refund Policy link too:
```html
<a href="refund-policy.html" class="hover:text-white transition">Refunds</a>
```

### Anti-Patterns to Avoid

- **Leaving `href="#"` on buy buttons at launch:** Stripe links are live and ready. Placeholder hrefs mean zero revenue. This is the highest-priority fix.
- **Putting OG image on a path that doesn't exist:** The `og:image` URL must resolve to a real file on the server. Create the image file before committing.
- **Using `@import` for Google Fonts in `<head>`:** This is render-blocking. Move to `<link rel="preload">` + self-hosted WOFF2 files, or at minimum use `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` instead of the `@import` in `<style>`.
- **Rebuilding Tailwind CSS without running the CLI:** Adding new Tailwind classes to HTML that aren't already in `output.css` will have no visual effect until the CSS is recompiled. After editing HTML with new utility classes, run `./tailwindcss -i src/input.css -o output.css --minify`.
- **Separate `sales.html`:** Prior decision confirmed this is not needed. The pricing section in `index.html` is the sales page.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FAQ accordion | Custom JS toggle | HTML `<details>/<summary>` (already in place) | Native, zero-JS, accessible, already working |
| Form validation | Custom JS | Browser native `required` + `type="email"` (already in Kit form) | Kit form already has this; don't duplicate |
| Social preview testing | Manual inspection | Facebook Sharing Debugger, LinkedIn Post Inspector, Twitter Card Validator | They cache and must be force-refreshed after deployment |
| Legal page text | Custom drafting | Termly, TermsFeed, or privacypolicies.com free generators | Legal generators produce defensible text; custom drafting risks omissions |
| Performance measurement | Eyeballing | PageSpeed Insights (pagespeed.web.dev) | Required by success criterion 5; measures simulated 150ms RTT / 1.6Mbps / 4x CPU |

**Key insight:** Everything in this phase is content placement and configuration, not engineering. The hardest part is the Stripe dashboard redirect configuration and self-hosting the font — both are non-code tasks.

---

## Common Pitfalls

### Pitfall 1: Stripe Redirect Not Configured in Dashboard

**What goes wrong:** Buy buttons point to Stripe Payment Links, customer completes purchase, Stripe shows its default "payment successful" hosted page instead of redirecting to `thank-you.html`.
**Why it happens:** The redirect URL must be configured per-Payment-Link in the Stripe Dashboard. Updating the `href` in HTML does nothing to post-payment behavior.
**How to avoid:** For each Payment Link (Starter + Full Kit), go to Dashboard > Payment Links > [link] > Edit > "After the payment" > "Redirect customers to your website" > `https://getcontentkit.com/thank-you.html`.
**Warning signs:** After test purchase, landing on Stripe's hosted confirmation page, not `thank-you.html`.

### Pitfall 2: New Tailwind Classes Not in output.css

**What goes wrong:** You add a new section with classes like `font-mono`, `tracking-widest`, `mt-0.5` — they render as unstyled because they're not in the compiled `output.css`.
**Why it happens:** Tailwind v4 standalone CLI uses zero-config content detection but `output.css` is a compiled artifact. New classes must be compiled in.
**How to avoid:** After finishing all HTML edits, run `./tailwindcss -i src/input.css -o output.css --minify` and commit the updated `output.css`.
**Warning signs:** Styles missing in browser but class names look correct; styles work in dev (watch mode) but not after static deploy.

### Pitfall 3: Google Fonts Render-Blocking

**What goes wrong:** PageSpeed Insights scores LCP poorly because the Inter font loads via `@import url(...)` in a `<style>` block inside `<head>`, which is render-blocking.
**Why it happens:** CSS `@import` in the HTML `<head>` blocks rendering until the font stylesheet fetches, which requires an extra DNS lookup + TLS handshake to `fonts.googleapis.com`.
**How to avoid:** Replace the `@import` with:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```
Or, for maximum performance: download Inter WOFF2 files, host locally, and use `<link rel="preload">`.
**Warning signs:** PageSpeed "Render-blocking resources" warning; LCP > 2s on mobile simulation.

### Pitfall 4: OG Image Missing or Wrong URL

**What goes wrong:** Social sharing shows no image or a broken image tile.
**Why it happens:** `og:image` must be an absolute HTTPS URL pointing to a real file. If the file doesn't exist or the path is wrong, scrapers silently fail.
**How to avoid:** Create the OG image file (`og-image.png`, 1200×630px) and commit it to the repo root before setting the meta tag URL. Test with Facebook Sharing Debugger after deploy.
**Warning signs:** No image appears when pasting URL into Facebook/LinkedIn/Twitter post composer.

### Pitfall 5: Footer Links Still Point to `#`

**What goes wrong:** Users click Terms / Privacy in footer, page scrolls to top instead of navigating to legal page. This looks unprofessional and may violate Stripe's acceptable use requirements.
**Why it happens:** Footer links in `index.html` currently have `href="#"` placeholders.
**How to avoid:** Update all footer legal links as part of the same task that creates the legal pages. These are coupled deliverables.

### Pitfall 6: GitHub Pages Cache Serving Stale Files

**What goes wrong:** After deploy, browser shows old version of index.html or output.css for up to 10 minutes.
**Why it happens:** GitHub Pages serves `Cache-Control: max-age=600` (10 minutes). On a fresh push, CDN edge nodes may serve cached responses.
**How to avoid:** Use cache-busting for `output.css` by appending a query string on major CSS changes: `<link rel="stylesheet" href="output.css?v=2">`. For HTML, this is not controllable — just wait 10 minutes after deploy for caches to expire.

---

## Code Examples

Verified patterns from official and current sources:

### Stripe Payment Link Button (Minimal, No JS)
```html
<!-- Source: Stripe docs — Payment Links are plain HTTPS URLs, embedded as href -->
<a href="https://buy.stripe.com/cNidRa7JQaRMbqWaXK9ws00"
   class="block w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition">
  Get Starter Kit — $27
</a>
```

### Kit Form Embed (Plain HTML POST, No JS Required)
```html
<!-- Source: Kit help docs — HTML form POST method -->
<!-- The form action already exists in index.html as https://app.convertkit.com/forms/9136765/subscriptions -->
<form action="https://app.convertkit.com/forms/9136765/subscriptions" method="post">
  <input name="email_address" type="email" placeholder="Your best email" required>
  <button type="submit">Get the Free Guide</button>
</form>
```
Note: The `name="email_address"` field is the Kit-required field name. This is already correctly implemented in `index.html`.

### Google Fonts — Non-Blocking Pattern
```html
<!-- Source: web.dev / Google Fonts docs — preconnect before stylesheet link -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```
Replace the existing `<style>@import url(...)` with the above `<link>` tags in `<head>`.

### Minimal Complete OG + Twitter Meta Block
```html
<!-- Source: ogp.me official spec + developer.twitter.com/cards/overview/markup -->
<meta property="og:type" content="website">
<meta property="og:title" content="ContentKit AI — 500+ AI Marketing Prompts">
<meta property="og:description" content="Stop staring at a blank screen. 500+ copy-paste prompts that generate converting ads, emails, and social posts in seconds.">
<meta property="og:url" content="https://getcontentkit.com/">
<meta property="og:image" content="https://getcontentkit.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ContentKit AI — 500+ AI Marketing Prompts">
<meta property="og:site_name" content="ContentKit AI">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="ContentKit AI — 500+ AI Marketing Prompts">
<meta name="twitter:description" content="Stop staring at a blank screen. 500+ copy-paste prompts that generate converting ads, emails, and social posts in seconds.">
<meta name="twitter:image" content="https://getcontentkit.com/og-image.png">
<meta name="twitter:image:alt" content="ContentKit AI — 500+ AI Marketing Prompts">
```

### Tailwind v4 CSS Rebuild Command
```bash
# Source: tailwindcss.com/docs/installation/tailwind-cli — standalone CLI
./tailwindcss -i src/input.css -o output.css --minify
```
Run from project root after any HTML edits that introduce new Tailwind class names.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 content array in config | Tailwind v4 zero-config content detection | v4.0 (Jan 2025) | No `tailwind.config.js` needed; CLI scans HTML automatically |
| `@import url()` Google Fonts in CSS | `<link rel="preconnect">` + `<link rel="stylesheet">` in HTML | Ongoing best practice | Eliminates render-blocking; measurable LCP improvement |
| Stripe Payment Links with default success page | Configurable redirect to custom thank-you URL | Current (dashboard feature) | Full control over post-purchase UX |
| Twitter Cards as separate tag system | Twitter reads `og:*` tags as fallback | 2023+ | `twitter:*` tags are still recommended for explicit control; `og:*` is fallback |
| Lighthouse "Fast 3G" label | Renamed "Slow 4G" (same specs: 150ms RTT, 1.6Mbps) | Lighthouse v6 | No functional change; still the mobile simulation benchmark |

**Deprecated/outdated:**
- CSS `@import` for fonts in `<head>`: Not deprecated per spec, but classified as an anti-pattern by PageSpeed Insights and web.dev — causes render-blocking.
- `details`/`summary` for accordion: Still valid and preferred for simple FAQ without animation needs. Alpine.js `x-show` only needed if custom animation is required (it is not, in this project).

---

## Open Questions

1. **OG Image: Does one need to be created from scratch?**
   - What we know: No `og-image.png` exists in the repo. The meta tag URL will be `https://getcontentkit.com/og-image.png`.
   - What's unclear: Whether the planner should include a task for creating the OG image (Figma/Canva export, screenshot, or AI-generated), or whether this will be manually handled by the user.
   - Recommendation: Include an explicit task: "Create 1200×630px OG image and commit as `og-image.png`". Mark it as required before the SEO audit task.

2. **Kit form: Does the HTML POST submit require JavaScript or can it work purely server-side?**
   - What we know: Kit's help docs show the HTML embed option; the `index.html` already uses the POST form pattern with `action="https://app.convertkit.com/forms/9136765/subscriptions"`. This is already live and working.
   - What's unclear: Post-submission redirect behavior (does Kit redirect back or show a Kit-hosted success page?).
   - Recommendation: Test the existing form submission behavior before adding any additional success/redirect handling. No action needed if Kit's default confirmation works.

3. **Legal page content: Self-authored vs. generator?**
   - What we know: Termly, TermsFeed, and privacypolicies.com offer free generators that produce defensible text for digital products.
   - What's unclear: Whether the user wants to author this content themselves or have the AI draft placeholder text.
   - Recommendation: Plan for the AI to draft reasonable placeholder text matching the product's stated policies (30-day guarantee, digital download, no resale). User should review before launch.

4. **`dark-700` Tailwind token: Defined?**
   - What we know: `src/input.css` defines `dark-800` and `dark-900` only. The `index.html` Kit form uses `bg-dark-700` for the email input field.
   - What's unclear: Whether `dark-700` resolves in the current `output.css` or falls through to transparent/inherited.
   - Recommendation: Verify in browser that the email input background renders correctly. If not, add `--color-dark-700: oklch(0.18 0.01 270)` to the `@theme` block in `src/input.css` and rebuild CSS. (LOW confidence this is an actual bug — may have been compiled in at some point.)

---

## Sources

### Primary (HIGH confidence)
- Stripe Documentation `docs.stripe.com/payment-links/post-payment` — after_completion redirect configuration, CHECKOUT_SESSION_ID parameter, UTM parameter behavior
- Stripe Documentation `docs.stripe.com/payment-links/customize` — dashboard edit flow for Payment Links
- Open Graph Protocol `ogp.me` — required og:* properties, image specs
- Twitter/X Developer Docs `developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup` — `twitter:card` tag syntax, `name` vs `property` attribute
- Google/Lighthouse `github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md` — confirmed mobile simulation specs: 150ms RTT, 1.6Mbps down, 4x CPU multiplier
- Kit Help Center `help.kit.com/en/articles/4009572-form-embedding-basics` — HTML embed vs JavaScript embed options
- Tailwind CSS v4 output.css header — confirmed version 4.2.1, token definitions, compiled classes

### Secondary (MEDIUM confidence)
- corewebvitals.io self-hosting Google Fonts study — 848ms LCP improvement on 4G (multiple sources corroborate the DNS lookup + TLS reduction; specific millisecond figure is from one study)
- GitHub Pages caching discussion `github.com/orgs/community/discussions/11884` + mrmarble.dev — confirmed `Cache-Control: max-age=600` (10-minute) TTL; no custom header support
- DebugBear `debugbear.com/blog/simulated-throttling` — corroborates Lighthouse throttling specs

### Tertiary (LOW confidence)
- Specific OG image dimension recommendations (1200×630 "works everywhere") — widely repeated across SEO blogs; official Facebook spec says minimum 200×200, recommends 1200×628; 1200×630 is acceptable deviation. Twitter requires minimum 300×157 for `summary_large_image`.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed from live code in repo (`output.css` header, `index.html` imports, `CNAME`)
- Architecture: HIGH — gaps are clearly enumerated from reading existing HTML against requirements
- Stripe integration: HIGH — verified against Stripe official docs; dashboard steps confirmed
- Performance specs: HIGH — Lighthouse throttling specs from official GitHub repo docs
- OG/SEO tags: HIGH — verified against ogp.me spec and Twitter developer docs
- Pitfalls: MEDIUM-HIGH — items 1-5 are verified; item 6 (cache) is confirmed; item on dark-700 is LOW (unverified)

**Research date:** 2026-02-26
**Valid until:** 2026-03-28 (stable stack; Stripe/Tailwind APIs unlikely to change in 30 days)
