# Asset Manifest — ContentKit AI Phase 1

Generated: 2026-02-25
Status: LIVE — All assets deployed to GitHub Pages. Product files also uploaded to Lemon Squeezy for automatic delivery on purchase.
Domain: getcontentkit.com
Payment processor: Stripe (Payment Links, live mode)

---

## Checkout URLs (Stripe Payment Links)

| Product | Price | Checkout URL |
|---------|-------|-------------|
| Starter Kit | $27 | https://buy.stripe.com/cNidRa7JQaRMbqWaXK9ws00 |
| Full Kit | $47 | https://buy.stripe.com/5kQ8wQ8NUe3Y2Uq7Ly9ws01 |

Note: Stripe redirects to thank-you.html after purchase. These URLs go in "Buy Now" buttons on the sales page.

---

## PDF Assets (GitHub Pages hosted)

These files are committed to the repo and served as static files by GitHub Pages.

| Asset | Local Content File | Local PDF Path (post-design) | Live URL (after Phase 2 deploy) | File Status |
|-------|-------------------|------------------------------|--------------------------------|-------------|
| Full Kit PDF | downloads/ai-prompt-kit-full-content.md | downloads/ai-prompt-kit-full.pdf | https://getcontentkit.com/downloads/ai-prompt-kit-full.pdf | [x] Generated — md-to-pdf (Plan 01-04) |
| Starter Kit PDF | downloads/ai-prompt-kit-starter-content.md | downloads/ai-prompt-kit-starter.pdf | https://getcontentkit.com/downloads/ai-prompt-kit-starter.pdf | [x] Generated — md-to-pdf (Plan 01-04) |
| Lead Magnet PDF | downloads/lead-magnet-content.md | downloads/5-ai-prompts-lead-magnet.pdf | https://getcontentkit.com/downloads/5-ai-prompts-lead-magnet.pdf | [x] Generated — md-to-pdf (Plan 01-04) |

Note: PDFs were generated programmatically from content .md files using md-to-pdf (Plan 01-04).
Files are in downloads/ and ready to commit to the repo for Cloudflare Pages hosting.

---

## Notion Templates (delivered as downloadable markdown files)

These templates were created as markdown files in Plan 01-02. They are immediately usable as product deliverables and are also importable into Notion. Phase 2 will determine if public Notion URLs are needed or if the markdown files are the delivery format.

| Template | Local File Path | Live URL (after Phase 2 deploy) | Verified |
|----------|-----------------|--------------------------------|----------|
| 30-Day Content Calendar | downloads/notion-30-day-content-calendar.md | https://getcontentkit.com/downloads/notion-30-day-content-calendar.md | [x] File exists |
| 90-Day Content Calendar | downloads/notion-90-day-content-calendar.md | https://getcontentkit.com/downloads/notion-90-day-content-calendar.md | [x] File exists |
| Brand Strategy Workspace | downloads/notion-brand-strategy-workspace.md | https://getcontentkit.com/downloads/notion-brand-strategy-workspace.md | [x] File exists |
| Campaign Planner | downloads/notion-campaign-planner.md | https://getcontentkit.com/downloads/notion-campaign-planner.md | [x] File exists |

Note: If Phase 2 decision requires separate public Notion page URLs (for in-browser preview before download), those URLs will be added here. Current status: file-based delivery.

---

## Product Tiers — What Each Buyer Receives

### Starter — $27
Email delivers:
- Download link: https://getcontentkit.com/downloads/ai-prompt-kit-starter.pdf
- Note: Starter does NOT include Notion templates (that's the Full Kit upsell)

Kit tag to apply: `purchased-starter`
Kit sequence: `post-purchase-starter`

### Full Kit — $47
Email delivers:
- Download link: https://getcontentkit.com/downloads/ai-prompt-kit-full.pdf
- Notion 30-Day Calendar: https://getcontentkit.com/downloads/notion-30-day-content-calendar.md
- Notion 90-Day Calendar: https://getcontentkit.com/downloads/notion-90-day-content-calendar.md
- Notion Brand Strategy Workspace: https://getcontentkit.com/downloads/notion-brand-strategy-workspace.md
- Notion Campaign Planner: https://getcontentkit.com/downloads/notion-campaign-planner.md

Kit tag to apply: `purchased-full-kit`
Kit sequence: `post-purchase-full-kit`

---

## Lead Magnet

| Asset | URL | Kit Sequence |
|-------|-----|-------------|
| Lead Magnet PDF | https://getcontentkit.com/downloads/5-ai-prompts-lead-magnet.pdf | `lead-magnet-delivery` (Day 0) |

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
https://getcontentkit.com/downloads/5-ai-prompts-lead-magnet.pdf

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
https://getcontentkit.com/downloads/ai-prompt-kit-starter.pdf

This pack works with any AI tool — ChatGPT, Claude, Gemini.
Start with Category 1 (Ads) or Category 2 (Emails) — those get results fastest.

Want the full 500+ prompt pack plus four Notion templates for content planning?
Upgrade to the Full Kit: https://getcontentkit.com/[upgrade-page-placeholder]

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
https://getcontentkit.com/downloads/ai-prompt-kit-full.pdf

━━━ YOUR NOTION TEMPLATES ━━━
Click each link to download your template files:

• 30-Day Content Calendar → https://getcontentkit.com/downloads/notion-30-day-content-calendar.md
• 90-Day Content Calendar → https://getcontentkit.com/downloads/notion-90-day-content-calendar.md
• Brand Strategy Workspace → https://getcontentkit.com/downloads/notion-brand-strategy-workspace.md
• Campaign Planner → https://getcontentkit.com/downloads/notion-campaign-planner.md

To use in Notion: Open the file, copy the content, create a new Notion page, paste as Markdown.

━━━━━━━━━━━━━━━━━━━━━━━━━

Tip: Start with the 30-Day Content Calendar and Category 3 (Social Media prompts)
— you can fill an entire month of content in one afternoon.

Questions? Reply to this email.
ContentKit AI
```

---

## Phase Handoff Notes

Phase 2 (Infrastructure): COMPLETE
- GitHub Pages live at https://getcontentkit.com/
- Lemon Squeezy store and checkout URLs created
- Domain placeholders replaced with real URLs

Phase 3 (Email Automation) needs:
- This manifest for Kit email templates
- Kit tag names: `lead-magnet-subscriber`, `purchased-starter`, `purchased-full-kit`
- Kit sequence names: `lead-magnet-delivery`, `post-purchase-starter`, `post-purchase-full-kit`
- Lemon Squeezy webhook (`order_created`) → Kit tag subscriber (via Zapier or LS built-in integration)
- Note: Product file delivery is handled by Lemon Squeezy automatically — Kit handles lead magnet + nurture only

Phase 4 (Front-End) needs:
- Starter checkout URL: https://buy.stripe.com/cNidRa7JQaRMbqWaXK9ws00
- Full Kit checkout URL: https://buy.stripe.com/5kQ8wQ8NUe3Y2Uq7Ly9ws01
- Lead magnet PDF URL: https://getcontentkit.com/downloads/5-ai-prompts-lead-magnet.pdf
- Upgrade page URL to replace `[upgrade-page-placeholder]` in post-purchase-starter email
