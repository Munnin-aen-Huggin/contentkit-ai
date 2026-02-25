---
phase: 01-product-assets
plan: "03"
subsystem: content
tags: [lead-magnet, asset-manifest, gap-engineering, email-sequences, kit-automation]

# Dependency graph
requires:
  - phase: 01-01
    provides: Full Kit content (500+ prompts, 8 categories) and Starter Kit — used as reference for gap engineering and category names
  - phase: 01-02
    provides: 4 Notion template markdown files — file paths used in asset manifest delivery tables

provides:
  - "downloads/lead-magnet-content.md — complete 8-12 page lead magnet PDF content (325 lines)"
  - "downloads/asset-manifest.md — single-source-of-truth reference for all Phase 1 asset URLs/paths"
  - "3 Kit email sequence templates ready to paste into Kit (lead-magnet-delivery, post-purchase-starter, post-purchase-full-kit)"
  - "Kit tag names defined for all 3 subscriber segments"

affects:
  - "02-infrastructure: needs to serve downloads/ folder from Cloudflare Pages; needs domain to replace yourdomain.com placeholders"
  - "03-email-automation: uses asset-manifest.md as handoff document for entire sequence wiring"
  - "04-frontend: needs Stripe Payment Link URLs to replace placeholders in lead-magnet-content.md CTA page"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Gap engineering: lead magnet prompts are simplified single-use versions (not identical to Full Kit prompts)"
    - "yourdomain.com placeholder convention: all PDF URLs use this prefix for Phase 2 find-replace"
    - "Notion templates delivered as .md file downloads (not public Notion page URLs)"

key-files:
  created:
    - downloads/lead-magnet-content.md
    - downloads/asset-manifest.md
  modified: []

key-decisions:
  - "Notion templates referenced by file path in asset manifest, not Notion URLs — consistent with Plan 01-02 decision to deliver as markdown files"
  - "Asset manifest uses yourdomain.com placeholder convention throughout — Phase 2 does single find-replace after domain is established"
  - "Lead magnet prompts are fresh simplified versions, not copies from Full Kit — Instagram hook sequence, email subject lines, PAS ad, landing page hero, product launch email"
  - "Full Kit ToC reproduced verbatim on gap page (Category 1-8 with exact names and prompt counts from ai-prompt-kit-full-content.md)"

patterns-established:
  - "Gap page pattern: name all 8 categories by exact name with a 1-line gap description each"
  - "Email template pattern: {{subscriber.first_name}} for Kit personalization merge tag"
  - "Kit sequence naming: kebab-case (lead-magnet-delivery, post-purchase-starter, post-purchase-full-kit)"
  - "Kit tag naming: kebab-case (lead-magnet-subscriber, purchased-starter, purchased-full-kit)"

# Metrics
duration: 7min
completed: 2026-02-25
---

# Phase 1 Plan 03: Lead Magnet + Asset Manifest Summary

**Gap-engineered lead magnet PDF content (5 prompts with real example outputs, 8-category gap page) and complete Phase 3 email wiring reference with 3 Kit sequences and all asset paths.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-25T13:00:31Z
- **Completed:** 2026-02-25T13:08:02Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Lead magnet PDF content complete: 325-line document following exact 9-section psychological architecture (cover, credibility, 5 prompts, gap page, CTA)
- 5 complete prompts with real example outputs for concrete fictional businesses (Clearline, Momentum Fitness, ProposalKit, unnamed course business, template pack business)
- Gap page names all 8 categories by exact name with 1-line gap description each, Full Kit Table of Contents reproduced, CTA with $27/$47 pricing
- Asset manifest catalogues all Phase 1 assets with file paths, URL patterns, Kit tag names, and 3 complete email body templates ready for Kit paste

## Task Commits

Each task was committed atomically:

1. **Task 1: Write lead magnet PDF content with gap engineering** - `544aae4` (feat)
2. **Task 2: Write asset manifest for Phase 3 Kit email wiring** - `bd9e07a` (feat)

**Plan metadata:** (pending — docs commit)

## Files Created/Modified
- `downloads/lead-magnet-content.md` — Complete lead magnet PDF content: cover, why copy fails, 5 prompts with example outputs, gap page (8 categories, Full Kit ToC), CTA ($27/$47)
- `downloads/asset-manifest.md` — All Phase 1 asset paths and URL patterns, product tier definitions, Kit tag names, 3 email sequence body templates, phase handoff notes

## Decisions Made
- **Notion templates referenced by file path, not Notion URL** — Consistent with Plan 01-02 decision to deliver templates as markdown files. File paths are `downloads/notion-*.md`. If Phase 2 decision requires public Notion URLs as well, the Notion template table in asset-manifest.md has a placeholder note.
- **yourdomain.com placeholder throughout asset manifest** — Phase 2 establishes the real domain and does a single find-replace. This prevents premature URL hardcoding across 3 phases.
- **Lead magnet prompts are fresh simplified versions** — Instagram Caption Hook Sequence, Email Subject Line Generator, Facebook PAS Ad, Landing Page Hero, Product Launch Email. None is copied from the Full Kit; all are simplified single-purpose versions that invite comparison with the full 500-prompt system.
- **Full Kit category names in gap page match Full Kit exactly** — Verified against downloads/ai-prompt-kit-full-content.md Table of Contents. All 8 category names (including "(Facebook, Google, LinkedIn)" qualifier on Ads) match.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Ready for Phase 2 (Infrastructure):**
- `downloads/` folder is committed to the repo and Cloudflare Pages will serve all files as static assets after deploy
- All `yourdomain.com` URL placeholders in `downloads/asset-manifest.md` need a single find-replace after Phase 2 establishes the real domain
- PDF files (`.pdf`) are noted as pending Canva design — these can be designed post-Phase 1 before Phase 3 goes live

**Ready for Phase 3 (Email Automation):**
- `downloads/asset-manifest.md` is the complete handoff document
- Kit sequence names are defined: `lead-magnet-delivery`, `post-purchase-starter`, `post-purchase-full-kit`
- Kit tag names are defined: `lead-magnet-subscriber`, `purchased-starter`, `purchased-full-kit`
- Email body copy for all 3 sequences is ready to paste into Kit

**Remaining Phase 1 work (Plan 01-04):**
- Plan 01-04 is the final plan in Phase 1 (to be confirmed)

## Self-Check: PASSED

- FOUND: downloads/lead-magnet-content.md (325 lines, 5 prompts, all 8 categories, $27/$47 pricing)
- FOUND: downloads/asset-manifest.md (169 lines, 3 PDF paths, 2 tiers, 3 Kit sequences)
- FOUND: .planning/phases/01-product-assets/01-03-SUMMARY.md
- FOUND: 544aae4 (Task 1 commit)
- FOUND: bd9e07a (Task 2 commit)

---
*Phase: 01-product-assets*
*Completed: 2026-02-25*
