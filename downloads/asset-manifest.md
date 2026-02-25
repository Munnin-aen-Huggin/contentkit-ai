# Asset Manifest — ContentKit AI Phase 1

Generated: 2026-02-25
Status: PDFs are local content files ready for Canva design. Notion templates delivered as markdown files (downloadable product assets). URLs become live after Phase 2 deploys to Cloudflare Pages.
Domain placeholder: yourdomain.com (replace with real domain after Phase 2)

---

## PDF Assets (Cloudflare Pages hosted)

These files will be committed to the repo at the paths below and served as static files by Cloudflare Pages.

| Asset | Local Content File | Local PDF Path (post-design) | Live URL (after Phase 2 deploy) | File Status |
|-------|-------------------|------------------------------|--------------------------------|-------------|
| Full Kit PDF | downloads/ai-prompt-kit-full-content.md | downloads/ai-prompt-kit-full.pdf | https://yourdomain.com/downloads/ai-prompt-kit-full.pdf | [x] Generated — md-to-pdf (Plan 01-04) |
| Starter Kit PDF | downloads/ai-prompt-kit-starter-content.md | downloads/ai-prompt-kit-starter.pdf | https://yourdomain.com/downloads/ai-prompt-kit-starter.pdf | [x] Generated — md-to-pdf (Plan 01-04) |
| Lead Magnet PDF | downloads/lead-magnet-content.md | downloads/5-ai-prompts-lead-magnet.pdf | https://yourdomain.com/downloads/5-ai-prompts-lead-magnet.pdf | [x] Generated — md-to-pdf (Plan 01-04) |

Note: PDFs were generated programmatically from content .md files using md-to-pdf (Plan 01-04).
Files are in downloads/ and ready to commit to the repo for Cloudflare Pages hosting.

---

## Notion Templates (delivered as downloadable markdown files)

These templates were created as markdown files in Plan 01-02. They are immediately usable as product deliverables and are also importable into Notion. Phase 2 will determine if public Notion URLs are needed or if the markdown files are the delivery format.

| Template | Local File Path | Live URL (after Phase 2 deploy) | Verified |
|----------|-----------------|--------------------------------|----------|
| 30-Day Content Calendar | downloads/notion-30-day-content-calendar.md | https://yourdomain.com/downloads/notion-30-day-content-calendar.md | [x] File exists |
| 90-Day Content Calendar | downloads/notion-90-day-content-calendar.md | https://yourdomain.com/downloads/notion-90-day-content-calendar.md | [x] File exists |
| Brand Strategy Workspace | downloads/notion-brand-strategy-workspace.md | https://yourdomain.com/downloads/notion-brand-strategy-workspace.md | [x] File exists |
| Campaign Planner | downloads/notion-campaign-planner.md | https://yourdomain.com/downloads/notion-campaign-planner.md | [x] File exists |

Note: If Phase 2 decision requires separate public Notion page URLs (for in-browser preview before download), those URLs will be added here. Current status: file-based delivery.

---

## Product Tiers — What Each Buyer Receives

### Starter — $27
Email delivers:
- Download link: https://yourdomain.com/downloads/ai-prompt-kit-starter.pdf
- Note: Starter does NOT include Notion templates (that's the Full Kit upsell)

Kit tag to apply: `purchased-starter`
Kit sequence: `post-purchase-starter`

### Full Kit — $47
Email delivers:
- Download link: https://yourdomain.com/downloads/ai-prompt-kit-full.pdf
- Notion 30-Day Calendar: https://yourdomain.com/downloads/notion-30-day-content-calendar.md
- Notion 90-Day Calendar: https://yourdomain.com/downloads/notion-90-day-content-calendar.md
- Notion Brand Strategy Workspace: https://yourdomain.com/downloads/notion-brand-strategy-workspace.md
- Notion Campaign Planner: https://yourdomain.com/downloads/notion-campaign-planner.md

Kit tag to apply: `purchased-full-kit`
Kit sequence: `post-purchase-full-kit`

---

## Lead Magnet

| Asset | URL | Kit Sequence |
|-------|-----|-------------|
| Lead Magnet PDF | https://yourdomain.com/downloads/5-ai-prompts-lead-magnet.pdf | `lead-magnet-delivery` (Day 0) |

Kit tag to apply on opt-in: `lead-magnet-subscriber`

---

## Email Copy Templates (Kit sequences)

### Sequence: lead-magnet-delivery
**Email 1 (Day 0) — Subject:** Here are your 5 AI copywriting prompts [download inside]

Body template:
```
Hi {{subscriber.first_name}},

Here's your free guide: 5 AI Prompts That Replace a $5K Copywriter

[Download Your Free Guide]
https://yourdomain.com/downloads/5-ai-prompts-lead-magnet.pdf

These prompts work with ChatGPT, Claude, Gemini — or any AI writing tool you prefer.

More coming your way over the next few days,
ContentKit AI
```

---

### Sequence: post-purchase-starter
**Email 1 (Day 0) — Subject:** Your AI Marketing Prompt Kit is ready [download inside]

Body template:
```
Hi {{subscriber.first_name}},

Thank you for your purchase! Here's your download:

[Download Your Prompt Pack (200+ Prompts)]
https://yourdomain.com/downloads/ai-prompt-kit-starter.pdf

This pack works with any AI tool — ChatGPT, Claude, Gemini.
Start with Category 1 (Ads) or Category 2 (Emails) — those get results fastest.

Want the full 500+ prompt pack plus four Notion templates for content planning?
Upgrade to the Full Kit: https://yourdomain.com/[upgrade-page-placeholder]

Questions? Reply to this email.
ContentKit AI
```

---

### Sequence: post-purchase-full-kit
**Email 1 (Day 0) — Subject:** Your AI Marketing Prompt Kit is ready — all 500+ prompts + templates inside

Body template:
```
Hi {{subscriber.first_name}},

Thank you for your purchase! Everything is ready for you below.

━━━ YOUR DOWNLOADS ━━━

[Download Your Full Prompt Pack (500+ Prompts)]
https://yourdomain.com/downloads/ai-prompt-kit-full.pdf

━━━ YOUR NOTION TEMPLATES ━━━
Click each link to download your template files:

• 30-Day Content Calendar → https://yourdomain.com/downloads/notion-30-day-content-calendar.md
• 90-Day Content Calendar → https://yourdomain.com/downloads/notion-90-day-content-calendar.md
• Brand Strategy Workspace → https://yourdomain.com/downloads/notion-brand-strategy-workspace.md
• Campaign Planner → https://yourdomain.com/downloads/notion-campaign-planner.md

To use in Notion: Open the file, copy the content, create a new Notion page, paste as Markdown.

━━━━━━━━━━━━━━━━━━━━━━━━━

Tip: Start with the 30-Day Content Calendar and Category 3 (Social Media prompts)
— you can fill an entire month of content in one afternoon.

Questions? Reply to this email.
ContentKit AI
```

---

## Phase Handoff Notes

Phase 2 (Infrastructure) needs:
- The `downloads/` folder committed to the repo so Cloudflare Pages serves the files
- Real domain name — replace all `yourdomain.com` placeholders in this manifest
- Decision: confirm whether Notion templates are delivered as file downloads (current) or whether public Notion page URLs should also be created; update Notion template table accordingly

Phase 3 (Email Automation) needs:
- This entire manifest
- Real domain to finalize all download links (find-replace `yourdomain.com`)
- Kit tag names are ready: `lead-magnet-subscriber`, `purchased-starter`, `purchased-full-kit`
- Kit sequence names are ready: `lead-magnet-delivery`, `post-purchase-starter`, `post-purchase-full-kit`
- Email body templates above are ready to paste into Kit broadcast editor

Phase 4 (Front-End) needs:
- Stripe Payment Link URLs (created in Phase 2) to replace `← placeholder for Stripe Payment Link` in lead-magnet-content.md
- Lead magnet PDF URL for opt-in form confirmation page: https://yourdomain.com/downloads/5-ai-prompts-lead-magnet.pdf
- Upgrade page URL to replace `[upgrade-page-placeholder]` in post-purchase-starter email
