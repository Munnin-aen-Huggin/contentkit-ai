---
phase: 02-infrastructure
plan: "03"
subsystem: payments
tags: [lemon-squeezy, checkout, payments, digital-products]

# Dependency graph
requires: ["02-02"]
provides:
  - Lemon Squeezy store with two products ($27 Starter, $47 Full Kit)
  - Two checkout URLs for embedding in sales page buttons
  - Built-in digital product delivery (PDFs uploaded to Lemon Squeezy)
  - Automatic receipt emails with download links
affects:
  - 03-email-automation (Lemon Squeezy handles product delivery; Kit integration via webhooks)
  - 04-landing-page (checkout URLs embedded in Buy Now buttons)

# Tech tracking
tech-stack:
  added:
    - Lemon Squeezy (merchant of record, 5% + 50¢ per transaction)
  removed:
    - Stripe Payment Links (user lacks western business details)
  patterns:
    - Lemon Squeezy as merchant of record — handles global tax/VAT automatically
    - Digital product files uploaded directly to Lemon Squeezy — automatic delivery on purchase
    - Checkout URLs embedded as direct links in HTML buttons

key-decisions:
  - "Lemon Squeezy over Stripe — user cannot meet Stripe's western business/bank requirements"
  - "Merchant of record model — Lemon Squeezy handles VAT/tax globally, resolving the EU VAT blocker"
  - "File delivery via Lemon Squeezy — PDFs uploaded to products, buyers get download links in receipt email automatically"
  - "Confirmation redirect to thank-you.html with email and product query params"

# Metrics
duration: 15min
completed: 2026-02-25
---

# Phase 2 Plan 03: Payment Links Summary

**Lemon Squeezy store with two products and checkout URLs — replaces Stripe Payment Links**

## Performance

- **Duration:** ~15 min (user dashboard setup)
- **Completed:** 2026-02-25
- **Tasks:** 3 (account setup, Starter product, Full Kit product)

## Accomplishments
- Created Lemon Squeezy store: `contentkit-ai` (https://contentkit-ai.lemonsqueezy.com)
- Created Starter Kit product ($27) with checkout URL
- Created Full Kit product ($47) with checkout URL
- Uploaded product PDFs directly to Lemon Squeezy for automatic delivery
- Confirmation redirect configured to thank-you.html

## Key Artifacts

- **Lemon Squeezy Store:** https://contentkit-ai.lemonsqueezy.com
- **Starter Kit ($27) Checkout URL:** https://contentkit-ai.lemonsqueezy.com/checkout/buy/91776603-aff0-4efb-9513-0be0a1514540
- **Full Kit ($47) Checkout URL:** https://contentkit-ai.lemonsqueezy.com/checkout/buy/5a44db7f-e439-4acf-9a90-96073b40fe9a
- **Thank-you redirect:** https://getcontentkit.com/thank-you.html

## Deviation from Plan

- **Original:** Stripe Payment Links (buy.stripe.com URLs)
- **Actual:** Lemon Squeezy checkout URLs
- **Reason:** User cannot meet Stripe's western business details/bank account requirements
- **Impact:** Positive — Lemon Squeezy as merchant of record resolves the EU VAT blocker that was flagged in STATE.md. Also provides built-in file delivery, simplifying Phase 3.

## Requirements Covered

- PAY-01: Payment links exist for both tiers ($27 Starter, $47 Full Kit)
- Partial PAY-03: Lemon Squeezy delivers product files automatically on purchase (reduces Kit email delivery dependency)

## Phase 3 Impact

Lemon Squeezy's built-in delivery changes the email automation approach:
- **Product delivery:** Handled by Lemon Squeezy receipt email (not Kit)
- **Kit role shifts to:** Lead magnet delivery, nurture sequence, buyer tagging only
- **Webhook:** Lemon Squeezy `order_created` → Kit tag subscriber (via Zapier or LS webhook)

---
*Phase: 02-infrastructure*
*Completed: 2026-02-25*
