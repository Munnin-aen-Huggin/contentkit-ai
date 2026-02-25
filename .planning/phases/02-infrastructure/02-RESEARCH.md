# Phase 2: Infrastructure - Research

**Researched:** 2026-02-25
**Domain:** Cloudflare Pages deployment, Tailwind CSS v4 standalone CLI, Alpine.js v3, Stripe Payment Links
**Confidence:** HIGH (all claims verified against official documentation or official GitHub)

## Summary

Phase 2 establishes the technical foundation: a git-push-to-deploy pipeline via Cloudflare Pages, a local CSS build toolchain using Tailwind v4 standalone CLI (no npm), a CDN-loaded Alpine.js v3 for interactivity, and two Stripe Payment Links for the two product tiers. The project is already a static HTML site with no framework and no npm project, so each of these tools is being wired together as independent pieces rather than as part of a unified build system.

The most significant configuration nuance is Cloudflare Pages' handling of pure-static deployments: the build command must be set to `exit 0` (not left blank) and the build output directory must be set to `/` (root). Getting this wrong silently deploys but serves 404 errors. Tailwind v4 changes the input CSS from three `@tailwind` directives to a single `@import "tailwindcss"` line and replaces `tailwind.config.js` with CSS-first configuration — no init step is needed. Alpine.js requires the `defer` attribute on the script tag and must load before `x-data` is referenced.

**Primary recommendation:** Complete Cloudflare Pages connection and verify push-to-deploy works before setting up toolchain or Stripe — the live deploy URL is a prerequisite for configuring Stripe Payment Link redirect URLs.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Cloudflare Pages | Free tier | Static site hosting + CDN | Unlimited bandwidth, unlimited requests, 500 builds/month free — decision locked |
| Tailwind CSS standalone CLI | v4.2.1 (Feb 2026) | Compile CSS without npm | Locked decision; no Node.js project required |
| Alpine.js | v3.15.8 (Feb 2026) | Lightweight JS for interactivity | Locked decision; CDN, no build step |
| Stripe Payment Links | Current | No-code checkout | Locked decision; no custom checkout page required |
| GitHub | Any | Git host for deploy trigger | Required by Cloudflare Pages git integration |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| jsDelivr CDN | - | Serves Alpine.js | More reliable than unpkg for production |

### Alternatives Considered
All choices are locked decisions from prior context. No alternatives to consider.

**Tailwind v4 standalone CLI download (macOS arm64 — the current machine's platform):**
```bash
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64
chmod +x tailwindcss-macos-arm64
mv tailwindcss-macos-arm64 tailwindcss
```

**Tailwind v4 other platforms:**
- macOS x64: `tailwindcss-macos-x64`
- Linux x64: `tailwindcss-linux-x64`
- Linux arm64: `tailwindcss-linux-arm64`
- Windows x64: `tailwindcss-windows-x64.exe`

Source: https://github.com/tailwindlabs/tailwindcss/releases/latest

## Architecture Patterns

### Recommended Project Structure
```
dp/ (repo root)
├── index.html              # existing landing page shell
├── thank-you.html          # to be created in Phase 4
├── downloads/              # Phase 1 product assets (already exists)
├── src/
│   └── input.css           # Tailwind v4 source (single @import line)
├── output.css              # Tailwind compiled output (gitignored)
├── tailwindcss             # Tailwind standalone CLI binary (gitignored)
└── .gitignore              # must exclude output.css if pre-built, or include if checked in
```

**Key decision:** `output.css` can be either:
1. Compiled locally and committed to git — Cloudflare Pages serves it as a static asset (simplest for Phase 2)
2. Not committed — requires a build step on Cloudflare Pages (adds complexity, not needed here)

**Recommended: Commit `output.css` to the repository.** Since there is no npm project and no build framework, have Cloudflare Pages serve the pre-compiled file. This eliminates the need for any build command at all.

### Pattern 1: Cloudflare Pages for Pure Static HTML
**What:** Connect a GitHub repository to Cloudflare Pages; all pushes to `main` trigger an automatic redeploy in ~30-60 seconds.
**When to use:** Any static site with no server-side rendering.

**Exact Dashboard Configuration:**
```
Framework preset:       None
Build command:          exit 0
Build output directory: /
Root directory:         (leave blank — defaults to repo root)
Production branch:      main
```

**Why `exit 0` instead of blank:** Cloudflare requires some build command to consider the deploy successful. An empty field causes deployment failures on some configurations. `exit 0` is a no-op that always succeeds.

**Why `/` not blank for output directory:** Blank output directory causes 404 errors even when deployment reports success. `/` tells Cloudflare to serve files from the repo root, which is where `index.html` lives.

Source: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

### Pattern 2: Tailwind CSS v4 Standalone CLI
**What:** Download a single binary executable; run it against an input CSS file to produce a compiled output CSS.
**When to use:** No npm project exists and Tailwind is the only CSS tooling needed.

**v4 input.css (replaces the old three @tailwind directives):**
```css
@import "tailwindcss";
```

**Development (watch mode):**
```bash
./tailwindcss --input src/input.css --output output.css --watch
```

**Production (minified build):**
```bash
./tailwindcss --input src/input.css --output output.css --minify
```

**No config file needed for basic projects.** v4 auto-detects HTML files in the directory tree. If you add custom theme tokens, put them in the CSS file itself:
```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.65 0.20 240);
  --font-display: "Inter", sans-serif;
}
```

Source: https://github.com/tailwindlabs/tailwindcss/discussions/15855, https://tailwindcss.com/blog/tailwindcss-v4

### Pattern 3: Alpine.js v3 from CDN
**What:** Load Alpine.js via a `<script>` tag in `<head>`; use `x-data`, `x-show`, and `@click` attributes directly in HTML.
**When to use:** Lightweight interactivity (accordion, toggles) without a JS framework.

**Script tag (place in `<head>` with `defer`):**
```html
<script defer src="https://cdn.jsdelivr.net/npm/[email protected]/dist/cdn.min.js"></script>
```

**FAQ Accordion pattern (single-open-at-a-time):**
```html
<div x-data="{ active: null }">
  <div>
    <button @click="active === 1 ? active = null : active = 1">
      Question 1
    </button>
    <div x-show="active === 1">
      Answer 1
    </div>
  </div>

  <div>
    <button @click="active === 2 ? active = null : active = 2">
      Question 2
    </button>
    <div x-show="active === 2">
      Answer 2
    </div>
  </div>
</div>
```

**`defer` is mandatory.** Without it, Alpine tries to initialize before the DOM is ready and silently fails on elements it hasn't yet seen.

Source: https://alpinejs.dev/essentials/installation, https://alpinejs.dev/directives/show

### Pattern 4: Stripe Payment Links
**What:** No-code checkout pages hosted by Stripe; direct customers to a URL, Stripe handles payment, then redirects to your thank-you page.
**When to use:** Simple one-time product purchases with no custom checkout UI.

**Dashboard steps to create one Payment Link:**
1. Stripe Dashboard → Payment Links → **+ New**
2. Click **+ Add a new product**
3. Fill in: Name (`ContentKit AI - Starter Kit`), Price (`$27.00`), Type: One-time
4. Click **Add product**
5. Click the **"After the payment"** tab
6. Under "Confirmation page", select **"Don't show confirmation page"** and enter the redirect URL: `https://[your-pages-url]/thank-you.html`
7. Click **Create link**
8. Copy the `https://buy.stripe.com/...` URL

**Repeat for the $47 Full Kit.**

**Redirect URL placeholder:** You can include `{CHECKOUT_SESSION_ID}` in the redirect URL if needed for webhook correlation later (Phase 3). For Phase 2, a plain redirect URL is sufficient.

Source: https://docs.stripe.com/payment-links/post-payment, https://docs.stripe.com/payment-links/create

### Anti-Patterns to Avoid
- **Leaving the Cloudflare Pages build output directory blank:** Results in 404 on deploy. Set it to `/`.
- **Leaving the build command blank:** Can cause deployment to not complete correctly. Use `exit 0`.
- **Using `defer` on Alpine.js inside `<body>`:** Always put Alpine in `<head>` with `defer`. Putting it at the bottom of body without defer works but is fragile.
- **Using dynamic class construction with Tailwind v4:** `"text-" + color + "-500"` will not be included in the compiled output. Class names must appear as complete strings in HTML files.
- **Creating Stripe products in test mode and expecting live mode links:** Test mode products cannot be used in live mode payment links. If selling for real money, ensure the Stripe Dashboard toggle is set to **Live** mode before creating products.
- **Not gitignoring the Tailwind binary and output.css (if building locally):** The binary is platform-specific and large. Output.css should be committed (since there is no Cloudflare build step), but the binary should not.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS compilation | Custom PostCSS pipeline | Tailwind v4 standalone CLI | Single binary, no npm, handles content detection automatically |
| Accordion toggle state | Custom JS event listeners | Alpine.js x-data + x-show | 10 lines of HTML attributes vs. 50+ lines of JS |
| Payment checkout | Custom HTML form + Stripe.js | Stripe Payment Links | PCI compliance, fraud protection, mobile UI — all handled |
| Static hosting | VPS or custom server | Cloudflare Pages | Zero ops, automatic SSL, unlimited bandwidth |

**Key insight:** Every component in this phase has a managed service or zero-config tool that handles the hard parts. The entire phase is about connecting existing services, not building infrastructure from scratch.

## Common Pitfalls

### Pitfall 1: Cloudflare Pages 404 After Successful Deploy
**What goes wrong:** The deployment dashboard shows green/success, but visiting the `*.pages.dev` URL returns a 404 error.
**Why it happens:** The build output directory is blank or wrong, so Cloudflare cannot find `index.html`.
**How to avoid:** Set build output directory to `/` and ensure `index.html` exists in the repo root.
**Warning signs:** Deploy log shows success, URL returns 404, no error in the Cloudflare dashboard.

Source: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/ (confirmed: "if you are getting 404 errors, make sure your website has a top-level index.html")

### Pitfall 2: Tailwind v4 Not Scanning HTML Files
**What goes wrong:** CSS compiles without error but utility classes used in HTML are not included in `output.css`.
**Why it happens:** v4 auto-detection respects `.gitignore`. If `index.html` is somehow excluded, or if the CLI is run from a different directory, the scanner may miss files.
**How to avoid:** Run the CLI from the project root. If classes are missing, add `@source "./";` to `input.css` to explicitly force scanning the current directory.
**Warning signs:** Classes work with CDN Tailwind but not with compiled `output.css`; `output.css` is unexpectedly small.

Source: https://tailwindcss.com/docs/detecting-classes-in-source-files

### Pitfall 3: Alpine.js Silent Initialization Failure
**What goes wrong:** Accordion clicks do nothing in the browser; no JavaScript errors in console.
**Why it happens:** Missing `defer` attribute on the Alpine script tag, causing Alpine to initialize before the DOM has loaded. Elements with `x-data` are not found.
**How to avoid:** Always use `<script defer src="...alpinejs..."></script>` in `<head>`.
**Warning signs:** Page loads, no console errors, but `@click` and `x-show` have no effect.

Source: https://alpinejs.dev/essentials/installation

### Pitfall 4: Stripe Payment Link URL Is Not Live Before Cloudflare Pages URL Exists
**What goes wrong:** The Stripe Payment Link redirect URL (thank-you page) must be set when creating the link. If Cloudflare Pages is not set up yet, you don't have a real URL.
**Why it happens:** Phase dependencies — Stripe needs to know the redirect URL, which is the Cloudflare Pages URL.
**How to avoid:** Set up Cloudflare Pages first, get the `*.pages.dev` URL, then create Stripe Payment Links with that URL. The URL can always be updated later in the Stripe Dashboard by editing the link.
**Warning signs:** Not a bug — just a sequencing issue. Create Cloudflare Pages first.

### Pitfall 5: Tailwind v4 vs v3 Gradient Class Rename
**What goes wrong:** `bg-gradient-to-r` class does not render gradient in v4.
**Why it happens:** Tailwind v4 renamed gradient utilities from `bg-gradient-*` to `bg-linear-*`.
**How to avoid:** Use `bg-linear-to-r` in all HTML. The existing `index.html` uses the CDN play version which may auto-handle this — must verify when switching to standalone CLI output.
**Warning signs:** Hero section gradient renders flat after switching to compiled CSS.

Source: https://tailwindcss.com/blog/tailwindcss-v4 (confirmed breaking change documented)

### Pitfall 6: Stripe Test Mode vs Live Mode Confusion
**What goes wrong:** Payment links created in test mode cannot be used for real purchases.
**Why it happens:** Stripe test and live environments are completely isolated — objects in one are not accessible in the other.
**How to avoid:** Confirm the Stripe Dashboard toggle (top of page) is set to **"Live"** mode before creating the products and payment links. Use test mode only for Phase 5 purchase verification with test cards.
**Warning signs:** Payment link URL looks like `https://buy.stripe.com/test_...` — the `test_` prefix indicates a test mode link.

Source: https://docs.stripe.com/testing-use-cases (confirmed: test and live API objects are not interchangeable)

## Code Examples

Verified patterns from official sources:

### Cloudflare Pages: Build Settings for Static HTML
```
Framework preset:       None
Build command:          exit 0
Build output directory: /
```
Source: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

### Tailwind v4: Minimal Input CSS
```css
/* src/input.css */
@import "tailwindcss";
```
Source: https://github.com/tailwindlabs/tailwindcss/discussions/15855

### Tailwind v4: Custom Theme Tokens in CSS (replaces tailwind.config.js)
```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.65 0.20 240);
  --color-dark-900: oklch(0.12 0.01 260);
  --color-dark-800: oklch(0.15 0.01 260);
}
```
Source: https://tailwindcss.com/blog/tailwindcss-v4

### Tailwind v4: Compile Commands
```bash
# Development (watch for changes)
./tailwindcss --input src/input.css --output output.css --watch

# Production (minify for smallest file)
./tailwindcss --input src/input.css --output output.css --minify
```
Source: https://github.com/tailwindlabs/tailwindcss/discussions/15855

### Alpine.js v3: Script Tag
```html
<!-- In <head>, MUST have defer -->
<script defer src="https://cdn.jsdelivr.net/npm/[email protected]/dist/cdn.min.js"></script>
```
Source: https://alpinejs.dev/essentials/installation

### Alpine.js v3: FAQ Accordion (single-open)
```html
<div x-data="{ active: null }">
  <!-- Item 1 -->
  <div class="border-b">
    <button
      @click="active === 1 ? active = null : active = 1"
      class="flex justify-between w-full py-4 text-left font-medium"
    >
      <span>Can I use these with ChatGPT?</span>
      <span x-text="active === 1 ? '−' : '+'"></span>
    </button>
    <div x-show="active === 1" class="pb-4 text-gray-400">
      Yes — every prompt works with ChatGPT, Claude, and any other AI model.
    </div>
  </div>

  <!-- Item 2 -->
  <div class="border-b">
    <button
      @click="active === 2 ? active = null : active = 2"
      class="flex justify-between w-full py-4 text-left font-medium"
    >
      <span>Is there a refund policy?</span>
      <span x-text="active === 2 ? '−' : '+'"></span>
    </button>
    <div x-show="active === 2" class="pb-4 text-gray-400">
      Yes, 30-day money-back guarantee.
    </div>
  </div>
</div>
```
Source: https://alpinejs.dev/directives/show, pattern verified against multiple official examples

### .gitignore for This Project
```gitignore
# Tailwind CLI binary (platform-specific, not for version control)
tailwindcss
tailwindcss-macos-arm64
tailwindcss-macos-x64
tailwindcss-linux-x64

# Compiled CSS is committed (no build step on Cloudflare Pages)
# output.css — intentionally NOT gitignored
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | v4.0 (Jan 2025) | Must update existing input.css |
| `tailwind.config.js` for theme | `@theme {}` block in CSS | v4.0 (Jan 2025) | No config file needed for basic setup |
| `content: [...]` array in config | Automatic detection + .gitignore | v4.0 (Jan 2025) | No manual content path configuration |
| `bg-gradient-to-r` | `bg-linear-to-r` | v4.0 (Jan 2025) | Must update existing HTML |
| Alpine v2 (legacy) | Alpine v3 (current) | v3.0 (2021) | New API; CDN URL is different |

**Deprecated/outdated:**
- `tailwind.config.js` with `content` array: Not needed in v4 (can still use for advanced cases)
- `@tailwind base; @tailwind components; @tailwind utilities;`: Replaced by single `@import "tailwindcss"`
- `unpkg.com` for Alpine CDN: Still works but jsDelivr is preferred for production reliability

## Open Questions

1. **output.css committed vs. built on Cloudflare**
   - What we know: Cloudflare Pages supports custom build commands. The project has no npm project and no Node.js tooling.
   - What's unclear: Whether the planner wants to commit pre-compiled CSS (simple, but CSS is a generated artifact) or configure Cloudflare to run the Tailwind binary as a build step.
   - Recommendation: Commit `output.css` for Phase 2. This is simpler and the file is small. Revisit in Phase 4 when final CSS is built for production.

2. **Stripe Payment Link redirect URL during Phase 2**
   - What we know: The Stripe Payment Link requires a redirect URL at creation time. The thank-you page does not exist yet (Phase 4).
   - What's unclear: Whether to use a placeholder URL and update it in Phase 4, or to create a minimal `thank-you.html` stub in Phase 2.
   - Recommendation: Create a one-line stub `thank-you.html` in Phase 2 so the Stripe link has a valid URL that resolves. Update the full page content in Phase 4.

3. **index.html currently uses CDN Tailwind script + hardcoded config**
   - What we know: The existing `index.html` uses `<script src="https://cdn.tailwindcss.com">` with an inline `tailwind.config` object. Switching to standalone CLI means removing this script and linking `output.css` instead.
   - What's unclear: Whether all existing classes in `index.html` are v4-compatible (gradient class rename risk).
   - Recommendation: After compiling with standalone CLI, visually diff the page in browser. Flag any gradient utilities for rename.

## Sources

### Primary (HIGH confidence)
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/ — Static site deployment config
- https://developers.cloudflare.com/pages/get-started/git-integration/ — GitHub integration steps
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/ — GitHub permissions and gotchas
- https://developers.cloudflare.com/pages/platform/limits/ — Free tier limits
- https://tailwindcss.com/blog/tailwindcss-v4 — v4 breaking changes and feature list
- https://tailwindcss.com/blog/standalone-cli — Standalone CLI download and usage
- https://tailwindcss.com/docs/detecting-classes-in-source-files — @source directive and .gitignore behavior
- https://github.com/tailwindlabs/tailwindcss/discussions/15855 — v4 standalone CLI beginner tutorial
- https://github.com/tailwindlabs/tailwindcss/releases — v4.2.1 confirmed as latest release (Feb 23, 2026)
- https://alpinejs.dev/essentials/installation — Official CDN script tag and defer requirement
- https://alpinejs.dev/directives/show — x-show directive, x-cloak pattern
- https://docs.stripe.com/payment-links/post-payment — After-payment redirect configuration
- https://docs.stripe.com/payment-links/create — Payment link creation steps

### Secondary (MEDIUM confidence)
- https://github.com/alpinejs/alpine/releases — v3.15.8 confirmed as latest Alpine v3 (Feb 2026)
- Multiple Cloudflare community threads confirming: build output directory `/`, build command `exit 0` for pure static HTML

### Tertiary (LOW confidence)
- None — all critical claims verified against official sources

## Metadata

**Confidence breakdown:**
- Cloudflare Pages setup: HIGH — official docs, confirmed build settings
- Tailwind v4 standalone CLI: HIGH — official blog post + GitHub discussions from tailwindlabs
- Alpine.js v3 CDN: HIGH — official installation docs
- Stripe Payment Links: HIGH — official Stripe docs for post-payment redirect
- Pitfalls (404, gitignore, defer): HIGH — verified against official sources and confirmed community patterns

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (30 days — all technologies stable; Tailwind v4.x minor versions release frequently but no breaking changes expected within minor versions)
