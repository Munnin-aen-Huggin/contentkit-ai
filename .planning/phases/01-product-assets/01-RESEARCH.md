# Phase 1: Product Assets - Research

**Researched:** 2026-02-24
**Domain:** Digital product creation — PDF prompt packs, Notion templates, lead magnet PDFs, file hosting
**Confidence:** MEDIUM-HIGH

---

## Summary

Phase 1 produces three categories of deliverable assets: (1) two PDF prompt packs (Starter 200+ and Full Kit 500+), (2) four Notion templates (30-day calendar, 90-day calendar, brand strategy workspace, campaign planner), and (3) one lead magnet PDF ("5 AI Prompts That Replace a $5K Copywriter"). No CONTEXT.md exists, so all decisions below reflect best-practice research rather than locked user choices.

The core execution challenge is volume and quality at scale: 500+ individually structured prompts with context, variables, and expected output descriptions is a significant content creation effort. The Notion templates require careful construction so they duplicate cleanly for buyers with fresh accounts. The lead magnet requires deliberate "gap engineering" — showing enough value to prove the product works, while stopping short of full implementation to motivate purchase.

The downstream delivery mechanism (Stripe Payment Links + Kit automation) constrains what "documenting asset URLs" means in practice: PDFs hosted on Cloudflare Pages as static files, Notion templates published as public duplicatable pages, and download links embedded in Kit automation emails triggered by Stripe purchase webhooks.

**Primary recommendation:** Create the PDF assets in Canva (export as PDF), host them as static files on the same Cloudflare Pages project that hosts the sales site, and publish Notion templates as public pages with "Allow duplicate as template" enabled. Deliver assets via Kit sequences triggered by Stripe webhook, not by Stripe's native post-payment redirect alone.

---

## Standard Stack

### Core — Asset Creation

| Tool | Purpose | Why Use It |
|------|---------|------------|
| Canva | PDF design for prompt packs and lead magnet | Brand fonts/colors, professional layouts, direct PDF export, no-code |
| Notion | Template creation and publishing | Buyer-facing UX, built-in "Duplicate as template" feature, no hosting needed |
| Cloudflare Pages | Static file hosting for PDFs | Already decided; PDF files deploy alongside HTML as static assets |

### Core — Delivery

| Tool | Purpose | Why Use It |
|------|---------|------------|
| Stripe Payment Links | Purchase trigger | Already decided; `checkout.session.completed` webhook fires to Kit |
| Kit (ConvertKit) | Post-purchase email with download links | Already decided; native Stripe integration, visual automation builder |

### Supporting

| Tool | Version/Tier | Purpose | When to Use |
|------|-------------|---------|-------------|
| Google Docs | Free | Draft prompt content before Canva layout | Writing/editing stage before design |
| Notion free tier | Free | Build and test templates | Use a separate Notion account to test duplication |
| Canva free or Pro | Either | PDF export works on free tier | Pro adds brand kit; not strictly required |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Canva | Google Docs export as PDF | Faster but less professional-looking; better for plain-text heavy docs |
| Cloudflare Pages static PDF | Cloudflare R2 bucket | R2 gives more control over large files but adds setup cost and complexity; static Pages is sufficient for PDFs under 25MB |
| Kit automation email | Stripe's built-in post-payment redirect to download page | Stripe redirect works but doesn't capture email for future sequences; Kit captures subscriber and can re-send |

---

## Architecture Patterns

### Recommended File Structure (Cloudflare Pages project)

```
project-root/
├── index.html               # sales page
├── /downloads/              # PDF assets (committed to repo)
│   ├── ai-prompt-kit-starter.pdf
│   ├── ai-prompt-kit-full.pdf
│   └── 5-ai-prompts-lead-magnet.pdf
├── /thank-you/
│   └── index.html           # post-purchase confirmation page (Stripe redirect target)
└── /assets/
    └── ...                  # images, css
```

PDF download URLs then become:
- `https://yourdomain.com/downloads/ai-prompt-kit-starter.pdf`
- `https://yourdomain.com/downloads/ai-prompt-kit-full.pdf`
- `https://yourdomain.com/downloads/5-ai-prompts-lead-magnet.pdf`

These URLs are what get embedded in Kit automation emails.

### Pattern 1: Prompt Entry Structure

Every prompt in the PDF must follow a consistent three-field structure. This is what PROD-02 requires and what creates perceived value and usability.

**What:** Each prompt entry = Context block + Variables block + Expected Output block

**When to use:** Every single one of the 500+ prompts, without exception. Consistency is the product quality signal.

**Example entry format:**

```
PROMPT TITLE: Benefit-Driven Facebook Ad — Problem/Agitate/Solve

CONTEXT:
Use when writing a Facebook or Instagram ad for a product that solves a
specific pain point. Works best when you know your customer's #1 frustration.

PROMPT:
Act as a direct-response copywriter. Write a Facebook ad using the
Problem/Agitate/Solve framework for [PRODUCT NAME]. The target audience is
[TARGET AUDIENCE DESCRIPTION]. Their biggest frustration is [PAIN POINT].
The ad should be [AD LENGTH: short (under 100 words) / medium (100-200 words)
/ long (200+ words)]. End with a single clear CTA: [DESIRED ACTION].

VARIABLES TO CUSTOMIZE:
- [PRODUCT NAME] — your product or service name
- [TARGET AUDIENCE DESCRIPTION] — who this ad targets (e.g., "freelance designers")
- [PAIN POINT] — their specific frustration (e.g., "chasing unpaid invoices")
- [AD LENGTH] — choose short / medium / long
- [DESIRED ACTION] — what you want them to do (e.g., "Start free trial")

EXPECTED OUTPUT:
A 3-paragraph Facebook ad. Para 1 names the problem. Para 2 makes it feel
urgent. Para 3 introduces the solution and ends with the CTA. Tone:
conversational, direct, no jargon.
```

### Pattern 2: PDF Document Structure (Prompt Pack)

**What:** Professional PDF with navigation sections a buyer can jump to

**Structure:**
```
Page 1:  Cover — title, tagline, version
Page 2:  How to Use This Pack (3 paragraphs)
Page 3:  Table of Contents (8 categories, page numbers)
Page 4+: Category sections, each starting with a category header page
         then prompt entries (2-3 per page at readable size)
Last:    "What's Next" page pointing to complementary resources
```

**Category order (matches PROD-01 requirements):**
1. Ads (Facebook, Google, LinkedIn)
2. Emails (welcome, nurture, sales, re-engagement)
3. Social Media (posts, captions, threads)
4. Landing Pages (hero copy, feature bullets, CTA blocks)
5. SEO (meta descriptions, blog outlines, pillar content)
6. Brand Strategy (positioning, voice, messaging hierarchy)
7. Product Launch (pre-launch, launch day, post-launch)
8. Video Scripts (YouTube, Reels, VSL)

**Starter tier (PROD-07):** Same format, same 8 categories, but 25 prompts per category instead of 62+. Remove the most advanced/niche prompts within each category, keeping the most universally applicable ones.

### Pattern 3: Notion Template Architecture

**What:** Four separate Notion pages, each a self-contained workspace, each published as a public duplicatable template

**Four templates, four separate public URLs:**

1. **30-Day Content Calendar**
   - Database with properties: Title (text), Date (date), Status (select: Idea/Drafting/Scheduled/Published), Platform (multi-select: Instagram/LinkedIn/Email/YouTube), Content Type (select: Post/Reel/Thread/Email/Video), Prompt Used (text)
   - Views: Calendar (by Date), Table (all entries), Board (by Status)
   - Pre-filled with 30 sample entries as placeholders

2. **90-Day Content Calendar**
   - Same database structure as 30-day
   - Add: Quarter (select: Q1/Q2/Q3/Q4), Theme/Campaign (text), Goal (text)
   - Views: Calendar, Table, Gallery (by Platform), Timeline (by Date range)
   - Pre-filled with 90 sample entries organized by week

3. **Brand Strategy Workspace**
   - Page-based (not database-primary) with nested sections:
     - Brand Foundation (mission, vision, values)
     - Target Audience (ICP table with demographics/psychographics)
     - Competitive Landscape (comparison table)
     - Brand Voice (tone adjectives, do/don't examples)
     - Visual Identity (colors, fonts, logo notes)
     - Core Messaging (tagline, elevator pitch, key proof points)

4. **Campaign Planner**
   - Database with properties: Campaign Name, Launch Date, Status, Budget (number), Goal (select), Platform, Owner, Linked Content (relation to content calendar if desired — skip relation to avoid duplication issues)
   - Views: Table, Board (by Status), Calendar (by Launch Date)
   - Sub-pages: Campaign Brief template, Results Tracker

### Pattern 4: Lead Magnet PDF Structure ("5 AI Prompts That Replace a $5K Copywriter")

**What:** 8-12 page PDF that delivers 5 working prompts with real example outputs, then closes with a gap that motivates purchase

**Psychological architecture:**

```
Page 1: Cover
Page 2: "Why Most Marketing Copy Fails" (the credibility setup)
Page 3: Prompt #1 — the easiest win (low effort, fast result)
         - The prompt itself
         - Screenshot or quoted example output
         - "What this replaces: $X/hr freelancer for X hours"
Page 4: Prompt #2 — email subject lines
Page 5: Prompt #3 — Facebook ad copy
Page 6: Prompt #4 — landing page hero section
Page 7: Prompt #5 — product launch email
Page 8: "What You Can't Do With Just 5 Prompts" (the gap)
         - Name the 8 categories buyers need
         - Note that ad-hoc prompts lack the structure buyers need
         - Show the table of contents of the full kit
Page 9: CTA — introduce the product, price, what's inside, link
```

**Gap engineering rule:** Each of the 5 prompts should be genuinely useful but cover only one narrow use case each. The gap page explicitly names the 7 other categories (or 3 other prompt types in each category) that the freebie doesn't cover.

### Anti-Patterns to Avoid

- **Generic filler prompts:** Prompts that say "Write a social media post about [TOPIC]" with no context or structure are worthless and damage perceived value. Every prompt must be specific enough to produce a meaningfully better output than typing the question directly.
- **Linked database views in Notion templates:** Do not use Linked Views of databases in Notion templates — when a buyer duplicates the page, linked views point back to the original creator's database, not a new copy. Use only inline full databases.
- **PDF files not committed to the repo:** PDFs must exist as actual files in the git repo so Cloudflare Pages deploys them. Do not reference external URLs (Dropbox, Google Drive) in emails — those can break.
- **Single Stripe redirect as the delivery mechanism:** Stripe's post-payment redirect page can be used as a confirmation page, but it should not be the only delivery mechanism. Kit email is the canonical delivery because it works even if the buyer closes the tab before seeing the redirect.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF professional layout | Custom HTML-to-PDF pipeline | Canva design + PDF export | HTML-to-PDF rendering is inconsistent across engines; Canva handles typography, bleed, and export correctly |
| Notion template hosting | Custom template gallery/page | Notion's native publish + "Duplicate as template" | Notion handles versioning, duplication, and the buyer UX |
| Post-purchase email trigger | Custom webhook receiver + email sender | Kit + Stripe integration | Kit's native Stripe app handles the webhook; no custom code needed |
| File access control | Auth-gated download page | Public Cloudflare Pages URL + Kit email as the "key" | For a $27-$47 product, obscurity (unlisted URL in email) is sufficient protection; custom auth is over-engineering |
| Lead magnet opt-in form | Custom HTML form + backend | Kit's built-in embed form | Kit forms handle submission, double opt-in, and automation trigger |

**Key insight:** Every component of this phase has a purpose-built tool that handles the hard parts. The work is content creation and configuration, not infrastructure.

---

## Common Pitfalls

### Pitfall 1: Notion Linked Views Break on Duplication
**What goes wrong:** If your Notion template contains a "Linked View" of a database (vs. an inline database), when a buyer duplicates the page they get a view that points to your original database — they can see your data, and you can see their entries.
**Why it happens:** Linked views are references, not copies. The duplication copies the view block but not the underlying database.
**How to avoid:** Build all databases as inline databases within the template page. Never use "Linked View of database." Test by duplicating into a fresh Notion account before publishing.
**Warning signs:** When you test duplication, if the database already has entries you didn't add in the new account, it's pointing to the original.

### Pitfall 2: PDF File Size Too Large for Cloudflare Pages
**What goes wrong:** Cloudflare Pages has a 25MB limit per file and a 20,000 file limit per deployment. A 500-prompt PDF with Canva design assets can exceed 25MB.
**Why it happens:** High-resolution images and embedded fonts inflate file size.
**How to avoid:** In Canva, export PDF with "Compress file" option checked, or use "PDF Standard" quality rather than "PDF Print." Target under 10MB for fast email delivery. If the file exceeds 25MB, use Cloudflare R2 as the storage layer instead.
**Warning signs:** Canva export shows file size estimate; check before finalizing.

### Pitfall 3: Stripe Webhook Requires Live Mode for Kit Automation
**What goes wrong:** Kit's Stripe integration only fires automations on live (real) purchases. Test mode purchases in Stripe do NOT trigger Kit automations.
**Why it happens:** Kit's integration listens to Stripe's `checkout.session.completed` event in live mode only.
**How to avoid:** To test the full delivery flow, you must complete a real live purchase (even at $0.01 or using a coupon code for 100% off). Set up a test product in Stripe at $0.01 to validate the Kit automation before going live.
**Warning signs:** Kit automation shows no entries even after "test" purchases.

### Pitfall 4: Prompt Volume Underestimation
**What goes wrong:** Writing 500 structured prompts (each with context, variables block, and expected output) takes far longer than expected. Each prompt at the quality level required takes 5-10 minutes to write and test.
**Why it happens:** 500 prompts sounds manageable but 500 × 8 minutes = ~67 hours of content work.
**How to avoid:** Use AI assistance to generate first drafts at scale, then review and refine. Divide into 8 category sprints. Write 25 prompts, check quality bar, then scale. The Starter tier (200 prompts) should be completed and validated first — it's a subset of the Full Kit.
**Warning signs:** Prompts start to look formulaic or interchangeable across categories.

### Pitfall 5: Lead Magnet Gap Too Shallow or Too Deep
**What goes wrong:** Either (a) the 5 prompts in the lead magnet are so basic they don't prove the product's value, or (b) they're so complete the buyer feels they don't need to purchase.
**Why it happens:** Finding the gap requires intentional design, not just picking 5 random prompts.
**How to avoid:** Each of the 5 prompts should cover exactly one sub-task in one category, with a real example output. The gap page must name the other 7 categories by name and show the table of contents of the full kit. The prompt shown should NOT be identical to any prompt in the final product — it should be a simplified version that invites comparison.
**Warning signs:** If someone asks "why should I buy if I can just use these 5?", the gap isn't clear enough.

### Pitfall 6: Notion Template Not Tested with Fresh Account
**What goes wrong:** The template works in the creator's account but breaks for buyers — missing databases, broken views, or properties that don't transfer.
**Why it happens:** Some Notion features behave differently across account types or when first duplicated.
**How to avoid:** Create a second, separate Notion account (use a different email). Navigate to the published template URL while logged into the fresh account. Click "Duplicate." Verify all databases, views, and pre-filled content appear correctly.
**Warning signs:** Views show empty when they should have sample entries, or relation properties show errors.

---

## Code Examples

### Stripe Post-Payment Redirect Configuration

Set in Stripe Dashboard when creating the Payment Link:

```
After completion: Redirect to URL
URL: https://yourdomain.com/thank-you?session_id={CHECKOUT_SESSION_ID}
```

The `thank-you` page acknowledges purchase and tells the buyer to check their email.

### Kit + Stripe Webhook Setup

```
In Stripe Dashboard:
  Developers → Webhooks → Add endpoint
  Endpoint URL: [paste from Kit's Stripe app]
  Events to listen to: Select all events (Kit requires this)

In Kit Dashboard:
  Automate → Apps → Stripe → Install
  Copy webhook URL → paste into Stripe
  Create Visual Automation:
    Entry point: Purchase → Stripe → [Product Name]
    Add tag: "purchased-starter-kit" OR "purchased-full-kit"
    Add to sequence: "post-purchase-delivery"
```

### Kit Email with Download Links (Sequence Email 1)

```
Subject: Here's your AI Marketing Prompt Kit [download inside]

Hi {{subscriber.first_name}},

Thank you for your purchase! Here are your download links:

[Download Your Prompt Pack PDF]
https://yourdomain.com/downloads/ai-prompt-kit-[starter|full].pdf

[Open Your Notion Templates]
- 30-Day Content Calendar: https://notion.so/[public-page-id]
- 90-Day Content Calendar: https://notion.so/[public-page-id]
- Brand Strategy Workspace: https://notion.so/[public-page-id]
- Campaign Planner: https://notion.so/[public-page-id]

To duplicate any Notion template: open the link, click "Duplicate"
in the top right, and select your workspace.

Questions? Reply to this email.
```

### Notion Template Publishing Steps

```
1. Build the template page in Notion
2. Click "Share" in top right
3. Select "Publish" tab
4. Click "Publish to web"
5. Confirm "Allow duplicate as template" toggle is ON (default: on)
6. Copy the public URL
7. Test: Open URL in a private/incognito browser window logged into
   a different Notion account → click "Duplicate" → confirm it works
```

### Canva PDF Export Settings

```
Design → Share → Download
File type: PDF Standard (not PDF Print — smaller file size)
Check: Flatten PDF (reduces file size)
Check: Compress file
Target output: under 10MB per file
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| Deliver digital products via email attachment | Host on CDN, email contains link | No attachment size limits, buyer can re-download anytime |
| Gumroad for digital product delivery | Stripe Payment Links + Kit automation | More margin, full ownership of buyer relationship, decided in prior decisions |
| Generic prompts list ("write a tweet about X") | Structured prompts with context + variables + expected output | Buyers can actually use prompts without guessing; perceived value is higher |
| Notion templates as static screenshots | Live Notion templates with "Duplicate as template" | Buyer gets a working, editable workspace, not just a reference image |

**Current standard for prompt packs in 2025-2026:**
The market has moved to structured prompts. Bare-bones lists of prompts sell for $0-$5. Prompt packs with context, variables, and expected outputs — essentially prompt engineering guides — sell for $27-$97. The three-field format (Context + Prompt with variables + Expected Output) is the current quality standard.

---

## Open Questions

1. **PDF hosting vs. R2 for file security**
   - What we know: Cloudflare Pages serves PDFs as static files at a public URL; anyone with the URL can download
   - What's unclear: Whether the project requires any download protection (e.g., token-gated URLs)
   - Recommendation: For a $27-$47 product, a non-indexed URL delivered only via Kit email is standard practice. Add R2 + signed URLs only if piracy becomes a demonstrated problem.

2. **Number of Notion workspace templates vs. pages**
   - What we know: The success criteria lists "30-day content calendar, 90-day content calendar, brand strategy workspace, and campaign planner" — that's 4 templates, but the requirements say "three Notion templates"
   - What's unclear: Whether the 30-day and 90-day calendars should be one template (with a toggle or separate views) or two separate duplicatable pages
   - Recommendation: Build them as two separate templates. Buyers prefer distinct pages for each use case; it also increases perceived product count.

3. **Prompt generation tooling**
   - What we know: 500 structured prompts require significant content creation; AI can draft them at scale
   - What's unclear: Which AI model produces the best first-draft prompts for marketing use cases
   - Recommendation: Use Claude or GPT-4o to generate first drafts in bulk using a template prompt, then manually review for quality. Budget 1-2 hours of review per 100 prompts.

4. **Starter vs. Full Kit differentiation clarity**
   - What we know: Starter = 200+ prompts at $27; Full Kit = 500+ prompts + all Notion templates at $47
   - What's unclear: Whether Starter should include any Notion templates (even a limited version) or be strictly prompts-only
   - Recommendation: Keep Starter as prompts-only. Notion templates are the upsell lever that justifies the $20 difference. Mention this clearly on the sales page.

---

## Sources

### Primary (HIGH confidence)
- [Notion Help — Duplicate public pages](https://www.notion.com/help/duplicate-public-pages) — template publishing steps, duplicate button behavior
- [Stripe Documentation — After a payment link payment](https://docs.stripe.com/payment-links/post-payment) — post-payment redirect options, webhook events, fulfillment flow
- [Kit Help — Kit + Stripe integration](https://help.kit.com/en/articles/2632323-kit-stripe) — webhook setup, automation entry points, live-mode requirement

### Secondary (MEDIUM confidence)
- [NotionApps — Notion Database Properties Explained](https://www.notionapps.com/blog/notion-database-properties-explained) — content calendar database structure and properties
- [Visme — How to Create a Lead Magnet PDF](https://visme.co/blog/lead-magnet-pdf/) — lead magnet structure and gap psychology
- [Founderpath — 200 AI Marketing Prompts](https://founderpath.com/blog/ai-prompt-marketing-business) — prompt pack format, category depth, entry structure
- [Landmark Labs — How to Duplicate Notion Databases](https://www.landmarklabs.co/notion-tutorials/duplicate-notion-databases) — linked view duplication behavior, database copying gotchas
- [NotionApps — Notion Data Sources 2025](https://www.notionapps.com/blog/notion-data-sources-update-2025) — 50,000 block limit, individual data source duplication limitations

### Tertiary (LOW confidence — verify before relying)
- Cloudflare Pages 25MB per-file limit — sourced from community forums, not official limits documentation. Verify at [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages) before finalizing file hosting approach.
- Canva "Compress file" export option — verified via search results; exact UI label may vary by Canva version.

---

## Metadata

**Confidence breakdown:**
- Standard stack (tools): HIGH — Canva, Notion, Cloudflare Pages, Kit, Stripe are all well-documented
- Prompt structure format: HIGH — three-field format (context + variables + expected output) is documented in multiple current sources
- Notion template architecture: HIGH — official Notion docs confirm duplicate-as-template behavior; linked view pitfall confirmed by multiple community sources
- Kit + Stripe integration: HIGH — official Kit documentation confirms webhook setup and live-mode requirement
- PDF file size limits: LOW — sourced from community posts, not official Cloudflare docs
- Lead magnet gap psychology: MEDIUM — industry-standard pattern documented across multiple marketing sources

**Research date:** 2026-02-24
**Valid until:** 2026-05-24 (90 days — tools are stable; Notion UI may change slightly but core features are consistent)
