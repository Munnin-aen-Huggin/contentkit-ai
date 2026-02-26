# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-24)

**Core value:** A single landing page that converts visitors into buyers of a high-value digital marketing toolkit — with zero ongoing costs and maximum profit margins.
**Current focus:** Phase 4 — Front-End Build

## Current Position

Phase: 4 of 5 (Front-End Build)
Plan: 3 of 4 (in progress)
Status: Executing
Last activity: 2026-02-26 — 04-03 COMPLETE (legal pages: privacy-policy.html, terms-of-service.html, refund-policy.html)

Progress: [██████████████░░░░░░] 70%

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: 44min
- Total execution time: 175min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | 172min | 43min |
| 02 | 1 | 3min | 3min |

**Recent Trend:**
- Last 5 plans: 120min (01-01), 35min (01-02), 7min (01-03), 10min (01-04), 3min (02-01)
- Trend: Fast

*Updated after each plan completion*

**By Task:**

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 04 | 02 | 5min | 1 | 2 |
| 03 | 03 | 10min | 1 | 2 |
| 02 | 01 | 3min | 3 | 5 |
| 01 | 04 | 10min | 2 | 5 |
| 01 | 03 | 7min | 2 | 2 |
| 01 | 02 | 35min | 2 | 5 |
| 01 | 02 | 10min | 1 | 1 |
| 01 | 01 | 120min | 2 | 2 |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Pre-phase]: Static HTML + Tailwind CDN over Next.js/React — zero build step, instant deploy
- [Pre-phase]: Stripe Payment Links over Gumroad — 2.9% vs 10% fee
- [Pre-phase]: Cloudflare Pages over Netlify/Vercel — unlimited bandwidth, commercial use permitted on free tier
- [Pre-phase]: Kit (ConvertKit) for email — 10K subscriber free tier (verify current limit at kit.com/pricing before first email)
- [Pre-phase]: Zapier/Make for Stripe webhook → Kit delivery — Cloudflare Worker is alternative; decide during Phase 2 planning
- [Pre-phase]: EU VAT decision deferred — must resolve before first sale (Stripe Payment Links vs. Lemon Squeezy merchant of record)
- [Phase 01-product-assets]: Inline databases only in Notion templates — linked views cause buyer data bleed on duplication
- [Phase 01-product-assets]: 4 separate Notion templates with separate public URLs — increases perceived product count and buyer clarity
- [Phase 01-01]: Batch-write by category then commit — prevents context-limit failures on large content files
- [Phase 01-01]: Starter prompts copied verbatim from Full Kit — prevents content drift between product tiers
- [Phase 01-01]: Variable format includes concrete example ("e.g., 'freelance graphic designers charging under $50/hr'") — not just [VARIABLE NAME]
- [Phase 01-02]: Notion templates delivered as markdown files, not Notion GUI builds — per user instruction; files are immediately usable as product deliverables, also importable into Notion
- [Phase 01-02]: Pre-filled with realistic sample content (not generic placeholders) — buyers see a populated workspace that shows the level of specificity the kit enables
- [Phase 01-03]: Notion templates referenced by file path in asset manifest, not Notion URLs — consistent with markdown file delivery format from 01-02
- [Phase 01-03]: yourdomain.com placeholder convention throughout asset manifest — Phase 2 does single find-replace after domain is established
- [Phase 01-03]: Lead magnet prompts are fresh simplified versions of Full Kit categories — Instagram hooks, email subject lines, PAS ad, hero section, launch email
- [Phase 01-04]: md-to-pdf via npx --yes chosen over pandoc/wkhtmltopdf — puppeteer handles CSS @page rules and blockquote styling without system PDF engine dependencies
- [Phase 01-04]: Shared pdf-style.css applied to all three PDFs — consistent branding, single source for typography changes
- [Phase 01-04]: PDFs stored at flat paths in downloads/ — consistent with other Phase 1 deliverables, simplifies Cloudflare Pages static routing
- [Phase 02-01]: Tailwind v4 standalone CLI over npm/package.json — no build step, Cloudflare Pages serves committed output.css directly
- [Phase 02-01]: output.css committed to git (not gitignored) — static deployable artifact, no CI/CD build required
- [Phase 02-01]: Alpine.js v3 via jsDelivr CDN with defer in head — defer ensures DOM-ready init without moving script to body bottom
- [Phase 02-01]: oklch color space for custom theme tokens — Tailwind v4 default, perceptually uniform, modern browser support
- [Phase 02-02]: GitHub Pages over Cloudflare Pages — user preference, simpler setup, same outcome
- [Phase 02-03]: Lemon Squeezy over Stripe — user cannot meet Stripe's western business/bank requirements; LS is merchant of record, handles VAT globally
- [Phase 02-03]: Product file delivery via Lemon Squeezy receipt email — simplifies Phase 3 (Kit handles lead magnet + nurture only, not product delivery)
- [Phase 03-03]: Netlify Function over Zapier/Make for LS→Kit webhook — direct API calls, no third-party automation cost, full control over HMAC verification
- [Phase 03-03]: Buyer tag failure handling — product-specific tag is critical (500 on failure triggers LS retry); generic buyer tag is supplementary (log error, return 200)
- [Phase 03-03]: Sequence removal deferred — no clean Kit API endpoint without extra GET subscriber lookup; buyers in sequence will see upsell emails but won't click (acceptable)
- [Phase 04-02]: No Alpine.js on thank-you.html — page has no interactive elements requiring JS
- [Phase 04-02]: noindex meta tag on thank-you.html — prevents purchase confirmation page from being indexed by search engines
- [Phase 04-02]: Step badge color via inline oklch() style — avoids Tailwind v4 JIT uncertainty for dynamic background classes on thank-you.html
- [Phase 04]: Legal pages use noindex meta — legal content should not rank in search
- [Phase 04]: Lemon Squeezy listed as merchant of record in privacy/terms (not Stripe directly) — accurate per Phase 2 decision
- [Phase 04]: Google Fonts loaded via preconnect + stylesheet link (not @import) — eliminates render-blocking; measured improvement on mobile simulation
- [Phase 04]: Stripe Payment Links wired as plain href on anchor tags — no JS wrapper needed

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 2]: RESOLVED — EU VAT handled by Lemon Squeezy as merchant of record
- [Phase 3]: RESOLVED — Stripe → Kit integration via custom Netlify Function webhook (03-03); deployed and live
- [Phase 1]: Social proof dependency — testimonials from 10-20 beta users are a hard dependency for PAGE-05; collect during Phase 1 before Phase 4 begins

## Session Continuity

Last session: 2026-02-26
Stopped at: Completed 04-03-PLAN.md. Legal pages live. Ready for 04-04.
Resume file: None
Note: 01-01 COMPLETE (2026-02-25) — Full Kit (500 prompts) and Starter (200 prompts) committed at f249aed
Note: 01-02 COMPLETE (2026-02-25) — 4 template markdown files committed at 78b482f, d8d3271, 93bdfc5, ff33679
Note: 01-03 COMPLETE (2026-02-25) — lead-magnet-content.md (544aae4) and asset-manifest.md (bd9e07a)
Note: 01-04 COMPLETE (2026-02-25) — ai-prompt-kit-full.pdf (3.0MB), ai-prompt-kit-starter.pdf (1.3MB), 5-ai-prompts-lead-magnet.pdf (261KB) committed at e076c58; asset-manifest.md updated at b7067b0. Phase 1 all 4 plans complete.
Note: 02-01 COMPLETE (2026-02-25) — .gitignore (494eb44), src/input.css, thank-you.html; output.css compiled 22KB (5d31108); index.html CDN swap + Alpine.js (9fd62a7)
Note: 03-01 COMPLETE (2026-02-26) — Kit infra: 4 tags, form embed, sequence, nurture copy committed at a9f3dbc, 119ab9c
Note: 03-03 Task 1 COMPLETE (2026-02-26) — webhook/netlify/functions/ls-webhook.js + webhook/netlify.toml committed at c0e008e
Note: 04-03 COMPLETE (2026-02-26) — privacy-policy.html (b50a652), terms-of-service.html + refund-policy.html (1a7b5ad)
