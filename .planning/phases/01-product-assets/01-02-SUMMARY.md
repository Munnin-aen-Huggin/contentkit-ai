---
phase: 01-product-assets
plan: "02"
subsystem: content
tags: [notion, templates, content-calendar, brand-strategy, campaign-planner]

# Dependency graph
requires: []
provides:
  - "downloads/notion-templates-spec.md — complete build guide for 4 Notion templates"
  - "4 Notion template public URLs (pending — user must build and publish)"
affects:
  - "01-product-assets — Notion template URLs are delivery assets for Kit emails"
  - "02-sales-funnel — template URLs embedded in post-purchase delivery emails"

# Tech tracking
tech-stack:
  added: [notion]
  patterns:
    - "Notion inline databases only (never linked views) — prevents buyer data bleed on duplication"
    - "Simple Table blocks for page-based templates — lighter than databases where rows aren't needed"

key-files:
  created:
    - "downloads/notion-templates-spec.md"
  modified: []

key-decisions:
  - "Inline databases only in all Notion templates — linked views cause buyer data bleed on duplication"
  - "Brand Strategy Workspace uses Simple Table blocks instead of databases — page-based document, not data-entry tool"
  - "4 separate templates, not combined — increases perceived product count and buyer clarity per use case"

patterns-established:
  - "Template spec pattern: page title exact → database inline → properties ordered → views named → pre-fill entries → publish checklist"

# Metrics
duration: 10min
completed: 2026-02-24
---

# Phase 1 Plan 02: Notion Template Build Spec Summary

**566-line step-by-step build guide for 4 Notion templates covering 30-Day Calendar, 90-Day Calendar, Brand Strategy Workspace, and Campaign Planner — with 30+90 pre-filled sample entries, data isolation test, and URL Registry**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-02-24T22:15:05Z
- **Completed:** 2026-02-24T22:25:00Z
- **Tasks:** 1 of 2 (Task 2 is a checkpoint:human-action — awaiting user)
- **Files modified:** 1

## Accomplishments

- Created `downloads/notion-templates-spec.md` with exact build instructions for all 4 Notion templates
- Specified every property name, type, option value, and view configuration so the user makes no decisions while building
- Pre-filled 30 sample content entries for Template 1 and 90 sample entries for Template 2 (organized by quarter and goal)
- Included critical inline-database warning prominently at the top (the #1 buyer-facing failure mode)
- Added data isolation test (add a row in duplicated DB, confirm it doesn't appear in creator account)
- URL Registry table ready to receive 4 public Notion template URLs after user publishes

## Task Commits

1. **Task 1: Write Notion template build specification** - `29339cf` (feat)

**Plan metadata:** pending (awaiting Task 2 checkpoint completion)

## Files Created/Modified

- `downloads/notion-templates-spec.md` — 566-line Notion template build guide covering all 4 templates, publishing checklist, duplication test, and URL Registry

## Decisions Made

- Inline databases only (never linked views) — linked views cause buyer data bleed; this is the #1 failure mode documented in research
- Brand Strategy Workspace uses Notion Simple Table blocks (not databases) — a page-based document where rows aren't added/removed doesn't need database overhead, and Simple Tables copy more cleanly
- 4 separate templates with separate public URLs rather than a combined workspace — increases perceived product count and gives buyers one focused page per use case

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**Task 2 requires manual Notion work.** The user must:

1. Follow `downloads/notion-templates-spec.md` section by section to build all 4 templates in Notion
2. Publish each template with "Allow duplicate as template" toggle ON
3. Fill in the URL Registry table at the bottom of the spec file with all 4 public URLs
4. Test duplication from a fresh Notion account (incognito + secondary email)
5. Verify data isolation (new rows in duplicated DB do not appear in creator account)

**Estimated time:** 2–3 hours for all four templates.

**Resume signal:** Type "templates done" and paste the 4 public Notion template URLs.

## Next Phase Readiness

- `downloads/notion-templates-spec.md` is ready — user can begin building immediately
- Once Task 2 is complete (URLs collected and verified), this plan is fully done
- The 4 Notion template URLs are required by Phase 2 (Kit email delivery sequences)
- No blockers for Task 2 beyond user time to build in Notion GUI

---
*Phase: 01-product-assets*
*Completed: 2026-02-24 (Task 1 only — Task 2 checkpoint pending)*
