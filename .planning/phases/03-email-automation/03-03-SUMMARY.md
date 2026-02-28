---
phase: 03-email-automation
plan: "03"
subsystem: infra
tags: [netlify, serverless, webhook, stripe, kit, convertkit, hmac, crypto]

# Dependency graph
requires:
  - phase: 03-01
    provides: Kit tag IDs (purchased-starter=16547727, purchased-full-kit=16547728, buyer=16547729)

provides:
  - Netlify Function (ls-webhook.js) with Stripe HMAC-SHA256 signature verification and Kit buyer tagging
  - netlify.toml configuration for function deployment
  - Deployed at https://gleeful-alfajores-fd284c.netlify.app/.netlify/functions/ls-webhook

affects:
  - 03-02 (buyers tagged as purchased-starter or purchased-full-kit)
  - 04 (buyer segmentation in Kit enables post-purchase email sequences)

# Tech tracking
tech-stack:
  added: [netlify-functions, node:crypto]
  patterns: [Stripe webhook signature verification, serverless webhook handler, Kit tag-subscribe API]

key-files:
  created:
    - webhook/netlify/functions/ls-webhook.js
    - webhook/netlify.toml
  modified: []

key-decisions:
  - "Pivoted from Lemon Squeezy to Stripe — user's Stripe account verified faster"
  - "Product identification by payment amount (2700 cents = Starter, 4700 cents = Full Kit)"
  - "Generic 'buyer' tag failure is non-fatal — product-specific tag is critical; buyer tag is supplementary"
  - "timingSafeEqual wraps Buffer.from() in try/catch — handles malformed signatures that differ in length"
  - "Signature verified on raw body before JSON.parse — prevents HMAC bypass via body manipulation"
  - "Replay protection: rejects timestamps older than 5 minutes"
  - "500 returned on product-specific Kit API failure — triggers Stripe retry; 200 on buyer tag failure"

patterns-established:
  - "Webhook security: verify Stripe signature (t=timestamp,v1=sig), then parse body"
  - "Netlify Functions use exports.handler and global fetch (Node 18+ runtime)"

# Metrics
duration: 10min
completed: 2026-02-26
---

# Phase 3 Plan 03: Stripe → Kit Buyer Tagging Webhook

**Netlify Function that verifies Stripe checkout.session.completed webhooks and tags buyers in Kit with product-specific and generic tags**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-02-26
- **Tasks:** 2 of 2 complete
- **Files created:** 2

## Accomplishments

- Created `webhook/netlify/functions/ls-webhook.js` with Stripe signature verification (timestamp + HMAC-SHA256 + replay protection)
- Product-to-tag routing by amount: $27 (2700 cents) → purchased-starter, $47 (4700 cents) → purchased-full-kit
- Two-step Kit tagging: product-specific tag (critical, returns 500 on failure for Stripe retry) + generic buyer tag (supplementary, logs error only)
- Zero hardcoded secrets or IDs — all via environment variables
- CORS headers and OPTIONS preflight for health checks
- Deployed to Netlify at https://gleeful-alfajores-fd284c.netlify.app/.netlify/functions/ls-webhook
- Stripe webhook endpoint configured (ID: we_1T52wmJRmz7CuOXJYH0uLcdO) pointing to Netlify function
- Environment variables set in Netlify: STRIPE_WEBHOOK_SECRET, KIT_API_SECRET, KIT_TAG_ID_PURCHASED_STARTER, KIT_TAG_ID_PURCHASED_FULL_KIT, KIT_TAG_ID_BUYER, STRIPE_STARTER_AMOUNT, STRIPE_FULL_KIT_AMOUNT

## Netlify Environment Variables

| Variable | Value |
|----------|-------|
| STRIPE_WEBHOOK_SECRET | whsec_lPt5g66KUWRIFjdetGKxbPzKIdwfa5lR |
| KIT_API_SECRET | aKo5TiD9q3mYmEkfawZb4Nj2Y6YjZALKQnbuI2Tifz8 |
| KIT_TAG_ID_PURCHASED_STARTER | 16547727 |
| KIT_TAG_ID_PURCHASED_FULL_KIT | 16547728 |
| KIT_TAG_ID_BUYER | 16547729 |
| STRIPE_STARTER_AMOUNT | 2700 |
| STRIPE_FULL_KIT_AMOUNT | 4700 |

## Files Created

- `webhook/netlify/functions/ls-webhook.js` — Serverless function: Stripe checkout.session.completed → signature verify → Kit tag subscriber
- `webhook/netlify.toml` — Netlify site configuration: functions directory and esbuild bundler

## Decisions Made

- **Stripe over Lemon Squeezy:** User's Stripe account activated; LS verification was too slow. Rewrote webhook from LS HMAC to Stripe signature format.
- **Amount-based product mapping:** Uses checkout session `amount_total` (cents) instead of product IDs — simpler with Payment Links.
- **500 vs 200 on failure:** Product-specific tag failure returns 500 so Stripe retries. Generic buyer tag failure returns 200.
- **Sequence removal deferred:** Buyers in nurture sequence will see upsell emails but won't click — acceptable tradeoff vs. extra API complexity.

## Self-Check: PASSED

---
*Phase: 03-email-automation*
*Completed: 2026-02-26*
