# ContentKit AI

## What This Is

A faceless digital product business selling AI marketing prompt packs and Notion templates as a premium bundle. Customers buy via Stripe Payment Links at getcontentkit.com and get instant access to 500+ battle-tested marketing prompts, content calendars, and templates that work with any AI tool (ChatGPT, Claude, Gemini). Full sales funnel with email capture, free lead magnet, 5-email nurture sequence, and automated buyer tagging.

## Core Value

A single landing page that converts visitors into buyers of a high-value digital marketing toolkit — with zero ongoing costs and maximum profit margins.

## Current State (v1.0 shipped 2026-02-28)

- **Live site:** getcontentkit.com (GitHub Pages)
- **Products:** Starter Kit ($147, 200 prompts) / Full Kit ($499, 500+ prompts + Notion templates)
- **Anchor pricing:** $397 / $997 crossed out
- **Email funnel:** Kit opt-in → lead magnet PDF → 5-email nurture → sale
- **Buyer tagging:** Netlify Function webhook (Stripe → Kit)
- **Analytics:** Plausible (3 goals: Purchase/revenue, Email Signup, Purchase Click)
- **Ad tracking:** Google Ads + Meta Pixel placeholders in 8 HTML files (deferred for organic-first launch)
- **SEO:** 5 blog articles targeting high-intent keywords + sitemap.xml + robots.txt
- **Marketing assets:** Reddit seeding plans (8 subreddits), Twitter 30-day calendar, Product Hunt launch kit, paid ad campaign docs
- **Stack:** Static HTML, Tailwind CSS v4 (standalone CLI), Alpine.js v3 (CDN)
- **LOC:** ~4,400 HTML across 12 pages

## Requirements

### Validated

- High-converting landing page with social proof, pricing, FAQ — v1.0
- Stripe Payment Links integration (2 tiers: $147 Starter, $499 Full Kit) — v1.0
- Post-purchase thank-you page with download instructions — v1.0
- Email capture with free lead magnet ("5 AI Prompts That Replace a $5K Copywriter") — v1.0
- 500+ AI marketing prompts organized by 9 categories as styled PDF — v1.0
- Notion templates: 30-day calendar, 90-day calendar, brand strategy, campaign planner — v1.0
- Lead magnet PDF creation — v1.0
- Mobile-responsive design (Tailwind CSS) — v1.0
- SEO meta tags and Open Graph tags — v1.0
- Full funnel: landing page → email capture → lead magnet → nurture → sale — v1.0
- Plausible analytics with conversion tracking — v1.0

### Active

- [ ] Real charge end-to-end verification (pre-launch action item from Phase 5)
- [ ] Mobile device physical test
- [ ] Email deliverability verification (Gmail + Outlook)
- [ ] Production link audit
- [ ] Replace ad tracking placeholder IDs when ready for paid ads

### Out of Scope

- Backend/database — static site, no server needed
- User accounts/login — one-time purchase, direct download
- Subscription model — one-time payment only for v1
- Custom domain email — use existing email for support
- Mobile app — web only

## Context

- Faceless business model — no personal brand needed, pure product-market fit
- Target audience: solopreneurs, freelancers, small business owners, marketing agencies
- Competitors: PromptBase, various Gumroad prompt sellers, Jasper/Copy.ai (subscription tools)
- Differentiation: one-time payment vs. subscriptions, comprehensive bundle vs. individual prompts
- Distribution: organic first (Reddit, Twitter/X, Product Hunt), paid ads when ready
- Revenue goal: $10,000/week at scale
- Pricing evolved: $27/$47 → $67/$127 → $197/$499 → $147/$499 (current)

## Constraints

- **Cost**: Zero hosting costs (GitHub Pages free tier)
- **Stack**: Static HTML + Tailwind CSS v4 standalone CLI + Alpine.js v3 CDN
- **Payments**: Stripe Payment Links — no custom checkout code
- **Email**: Kit (ConvertKit) free tier
- **Delivery**: Digital download via hosted files on GitHub Pages
- **Webhooks**: Netlify Function (free tier) for Stripe → Kit buyer tagging

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static HTML over Next.js/React | Zero build step, instant deploy, no dependencies | Good — 4,400 LOC, fast page loads |
| Stripe Payment Links over Gumroad | Lower fees, professional checkout | Good — live and working |
| GitHub Pages over Cloudflare Pages | User preference, simpler setup | Good — free, reliable |
| Lemon Squeezy as merchant of record | Handles EU VAT, no western bank required | Good — resolved VAT concern |
| Kit (ConvertKit) for email | Free tier, automation builder, Stripe integration | Good |
| Netlify Function for webhook | No third-party automation cost, full HMAC control | Good — deployed, reliable |
| Tailwind v4 standalone CLI | No npm/node project, committed output.css | Good — simple workflow |
| Two-tier pricing ($147/$499) | Anchoring with $397/$997, captures range of buyers | Pending validation |
| Organic-first launch strategy | Reddit, Twitter, Product Hunt before paid ads | Pending validation |
| Ad tracking deferred | Plausible handles organic; add Google/Meta IDs later | Good — reduces launch complexity |

---
*Last updated: 2026-02-28 after v1.0 milestone*
