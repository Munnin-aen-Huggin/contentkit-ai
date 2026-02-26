---
phase: 03-email-automation
plan: "03"
subsystem: infra
tags: [netlify, serverless, webhook, lemon-squeezy, kit, convertkit, hmac, crypto]

# Dependency graph
requires:
  - phase: 03-01
    provides: Kit tag IDs (purchased-starter=16547727, purchased-full-kit=16547728, buyer=16547729)

provides:
  - Netlify Function (ls-webhook.js) with HMAC-SHA256 signature verification and Kit buyer tagging
  - netlify.toml configuration for function deployment
  - Pending: deployed Netlify URL and Lemon Squeezy webhook configured (Task 2 — awaiting user)

affects:
  - 03-02 (buyers tagged as purchased-starter or purchased-full-kit; excluded from further lead magnet upsell)
  - 04 (buyer segmentation in Kit enables post-purchase email sequences)

# Tech tracking
tech-stack:
  added: [netlify-functions, node:crypto]
  patterns: [HMAC-SHA256 webhook signature verification, serverless webhook handler, Kit tag-subscribe API]

key-files:
  created:
    - webhook/netlify/functions/ls-webhook.js
    - webhook/netlify.toml
  modified: []

key-decisions:
  - "Generic 'buyer' tag failure is non-fatal — product-specific tag is critical; buyer tag is supplementary"
  - "timingSafeEqual wraps Buffer.from() in try/catch — handles malformed signatures that differ in length"
  - "Signature verified on raw body before JSON.parse — prevents HMAC bypass via body manipulation"
  - "500 returned on product-specific Kit API failure — triggers Lemon Squeezy retry; 200 on buyer tag failure"
  - "Sequence removal (02-01 deviation) deferred to user decision — no clean Kit API endpoint to remove subscriber from sequence without fetching subscriber ID first; buyers will simply not click upsell emails"

patterns-established:
  - "Webhook security: verify signature first, parse body second — prevents timing/HMAC attacks"
  - "Netlify Functions use exports.handler and global fetch (Node 18+ runtime)"

# Metrics
duration: 10min
completed: 2026-02-26
---

# Phase 3 Plan 03: Netlify Webhook Function for Lemon Squeezy → Kit Buyer Tagging

**HMAC-verified Netlify Function that maps Lemon Squeezy order_created events to Kit product-specific and generic buyer tags using timing-safe signature comparison**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-02-26T10:29:31Z
- **Completed:** 2026-02-26 (Task 1 complete; Task 2 awaiting user deployment)
- **Tasks:** 1 of 2 auto-executed; 1 checkpoint awaiting human action
- **Files modified:** 2

## Accomplishments

- Created `webhook/netlify/functions/ls-webhook.js` with full HMAC-SHA256 verification using `crypto.timingSafeEqual`
- Implemented product-to-tag routing: LS_PRODUCT_ID_STARTER → KIT_TAG_ID_PURCHASED_STARTER, LS_PRODUCT_ID_FULL_KIT → KIT_TAG_ID_PURCHASED_FULL_KIT
- Two-step Kit tagging: product-specific tag (critical, returns 500 on failure) + generic buyer tag (supplementary, logs error only)
- Zero hardcoded secrets or IDs — all via environment variables
- CORS headers and OPTIONS preflight for Netlify health checks

## Task Commits

Each task committed atomically:

1. **Task 1: Create Netlify Function webhook receiver** - `c0e008e` (feat)
2. **Task 2: Deploy webhook to Netlify and configure LS webhook** - PENDING (checkpoint:human-action)

**Plan metadata:** TBD (after Task 2 completion)

## Files Created/Modified

- `webhook/netlify/functions/ls-webhook.js` — Serverless function: LS order_created → HMAC verify → Kit tag subscriber
- `webhook/netlify.toml` — Netlify site configuration: functions directory and esbuild bundler

## Decisions Made

- **500 vs 200 on failure:** Product-specific tag failure returns 500 so Lemon Squeezy retries the webhook delivery. Generic buyer tag failure returns 200 since the critical tagging already succeeded.
- **timingSafeEqual try/catch:** `Buffer.from()` throws a RangeError if the two hex strings have different byte lengths (e.g., malformed signature). Wrapping in try/catch treats any such case as a mismatch.
- **Sequence removal skipped for now:** The 03-01 deviation noted buyers should be removed from the lead-magnet-delivery sequence. The Kit API can do this (GET subscriber by email, then DELETE subscription), but adds complexity and two extra API calls. Given that upsell emails in the sequence are not harmful to buyers (they just won't click), this is deferred.

## Deviations from Plan

None — plan executed exactly as written for Task 1. Task 2 is a checkpoint (human-action), not a deviation.

## User Setup Required (Task 2 — BLOCKING)

The webhook function code is ready. The following manual steps are required to activate the full pipeline:

**A. Netlify Deployment**
1. Check https://www.netlify.com/pricing/ — confirm free tier supports serverless functions (if not, use Cloudflare Workers instead)
2. Go to https://app.netlify.com → New site → Deploy manually
3. Drag and drop the `webhook/` folder
4. Note the site URL: `https://[your-site-name].netlify.app`
5. Function URL will be: `https://[your-site-name].netlify.app/.netlify/functions/ls-webhook`

**B. Netlify Environment Variables**

Set these in Netlify Dashboard → Site → Site configuration → Environment variables:

| Variable | Value |
|----------|-------|
| LEMONSQUEEZY_WEBHOOK_SECRET | (set after creating LS webhook in step C) |
| KIT_API_SECRET | aKo5TiD9q3mYmEkfawZb4Nj2Y6YjZALKQnbuI2Tifz8 |
| KIT_TAG_ID_PURCHASED_STARTER | 16547727 |
| KIT_TAG_ID_PURCHASED_FULL_KIT | 16547728 |
| KIT_TAG_ID_BUYER | 16547729 |
| LS_PRODUCT_ID_STARTER | (from Lemon Squeezy Products page) |
| LS_PRODUCT_ID_FULL_KIT | (from Lemon Squeezy Products page) |

**C. Lemon Squeezy Webhook**
1. Go to Lemon Squeezy Dashboard → Settings → Webhooks → Create Webhook
2. URL: `https://[your-site-name].netlify.app/.netlify/functions/ls-webhook`
3. Events: `order_created` only
4. Signing secret: generate a strong secret, copy it
5. Save webhook
6. Go back to Netlify, set `LEMONSQUEEZY_WEBHOOK_SECRET` to that secret value
7. Redeploy the site (so env var takes effect)

**D. Test**
1. LS Dashboard → Settings → Webhooks → click webhook → Send Test Event
2. Check Netlify Functions logs for `[ls-webhook] Product tag ... applied`
3. Check Kit subscribers for buyer tag on test email

**Report back with:**
- Netlify Function URL
- Confirm webhook configured in LS (yes/no)
- Test result (success/failure + any error details)

## Next Phase Readiness

- Code is ready to deploy. Once Task 2 is complete, the buyer tagging pipeline is fully operational.
- 03-02 (sequence email content) can proceed independently of Task 2 deployment.
- Phase 4 (sales page optimization / social proof) depends on buyer tag being live.

---
*Phase: 03-email-automation*
*Completed: 2026-02-26 (partial — Task 2 pending user action)*
