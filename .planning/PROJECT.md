# ContentKit AI

## What This Is

A faceless digital product business selling AI marketing prompt packs and Notion templates as a premium bundle. Customers buy via Stripe Payment Links and get instant access to 500+ battle-tested marketing prompts, content calendars, and templates that work with any AI tool (ChatGPT, Claude, Gemini). Full sales funnel with email capture and free lead magnet.

## Core Value

A single landing page that converts visitors into buyers of a high-value digital marketing toolkit — with zero ongoing costs and maximum profit margins.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] High-converting landing page with social proof, pricing, FAQ
- [ ] Stripe Payment Links integration (2 tiers: $27 Starter, $47 Full Kit)
- [ ] Post-purchase download/thank-you page with product delivery
- [ ] Email capture with free lead magnet ("5 AI Prompts That Replace a $5K Copywriter" mini-guide PDF)
- [ ] The actual digital product: 500+ AI marketing prompts organized by category
- [ ] Notion template pack: content calendars, brand strategy workspace, campaign planners
- [ ] Lead magnet PDF creation
- [ ] Mobile-responsive design
- [ ] SEO meta tags and Open Graph tags for social sharing
- [ ] Full funnel: landing page → email capture → lead magnet → nurture → sale

### Out of Scope

- Backend/database — static site, no server needed
- User accounts/login — one-time purchase, direct download
- Subscription model — one-time payment only for v1
- Custom domain email — use existing email for support
- Blog/content marketing — focus on paid traffic and direct sales first
- Mobile app — web only

## Context

- Faceless business model — no personal brand needed, pure product-market fit
- Target audience: solopreneurs, freelancers, small business owners, marketing agencies
- Competitors: PromptBase, various Gumroad prompt sellers, Jasper/Copy.ai (subscription tools)
- Differentiation: one-time payment vs. subscriptions, comprehensive bundle vs. individual prompts
- Distribution: paid ads (Facebook/Instagram/TikTok), Twitter/X organic, Reddit, Product Hunt
- Revenue goal: $10,000/week at scale

## Constraints

- **Cost**: Zero or near-zero hosting/infrastructure costs (static hosting on Vercel/Netlify free tier)
- **Stack**: Static HTML + Tailwind CSS (CDN) — no framework overhead, instant deploy
- **Payments**: Stripe Payment Links only — no custom checkout code needed
- **Email**: Free tier email service (Mailchimp free / ConvertKit free / Buttondown)
- **Timeline**: Launch-ready this week
- **Delivery**: Digital download via hosted files or Notion template links

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static HTML over Next.js/React | Zero build step, instant deploy, no dependencies | — Pending |
| Stripe Payment Links over Gumroad | 2.9% fee vs 10% fee, more professional | — Pending |
| Two-tier pricing ($27/$47) | Anchoring effect, captures both budget and premium buyers | — Pending |
| Free PDF lead magnet over free prompts | Higher perceived value, builds email list for upsells | — Pending |
| Tailwind CDN over custom CSS | Rapid development, professional look, no build step | — Pending |

---
*Last updated: 2026-02-24 after initialization*
