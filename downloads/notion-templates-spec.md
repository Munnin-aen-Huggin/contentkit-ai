# Notion Template Build Guide

> **CRITICAL — Read Before Building Anything**
>
> All databases in every template must be **INLINE databases** (created directly on the page via `/database`).
> **NEVER** use "Linked View of Database." If you use a linked view:
> - Buyers who duplicate the template will see YOUR data entries
> - You will see entries that buyers add in their duplicated copy
> - The template is broken from the moment it's published
>
> Test for this in the duplication verification step. If it's wrong, rebuild.

---

## Before You Start

- Open Notion **in a browser** (not the desktop app — the Share button behavior can differ)
- Create a new blank page in your workspace for each template
- Name each page **exactly** as specified below — this becomes the public page title that buyers see
- Build one template completely before starting the next
- After building each template: publish it, test it, paste the public URL into the URL Registry at the bottom of this document
- Estimated total time: 2–3 hours for all four templates

---

## Template 1: 30-Day Content Calendar

**Page title:** `30-Day Content Calendar — AI Marketing Kit`

### Step 1: Create the page

1. In your Notion sidebar, click `+ New Page`
2. Name it exactly: `30-Day Content Calendar — AI Marketing Kit`
3. Leave the page body blank — you will add the database next

### Step 2: Create the database

1. Inside the page body, type `/database` and select **"Database - Inline"** (NOT "Linked View of Database")
2. Name the database: `Content Calendar`
3. The default "Name" property is your first property — rename it to `Post Title` (click the column header → Rename)

### Step 3: Add all properties (in this exact order)

| # | Property Name | Type | Options / Notes |
|---|--------------|------|-----------------|
| 1 | Post Title | Title (default) | Already exists — just rename from "Name" |
| 2 | Publish Date | Date | Type: Date. No time needed. |
| 3 | Status | Select | Add options exactly: **Idea** (gray), **Drafting** (yellow), **Scheduled** (blue), **Published** (green) |
| 4 | Platform | Multi-select | Add options: Instagram, LinkedIn, Twitter/X, Facebook, YouTube, Email, TikTok, Pinterest |
| 5 | Content Type | Select | Add options: Post, Reel/Short, Thread, Email, Video, Carousel, Story |
| 6 | Prompt Used | Text | Label exactly: "Prompt Used" |
| 7 | Notes | Text | Label exactly: "Notes" |

**How to add a property:** Click `+` at the far right of the property header row → Select type → Name it.

### Step 4: Create views

1. **Table view (already exists as default):** Click the view name to rename it to `Table`. Sort by `Publish Date` ascending (click `Filter → Sort → Publish Date → Ascending`).

2. **Calendar view:**
   - Click `+ Add a view` → Select `Calendar`
   - Name it: `Calendar`
   - Set "Show calendar by" to: `Publish Date`

3. **Board view:**
   - Click `+ Add a view` → Select `Board`
   - Name it: `Board`
   - Set "Group by" to: `Status`
   - In Board view properties settings, show: `Title` and `Platform` (hide others)

### Step 5: Pre-fill 30 sample entries

Enter the following 30 rows. Use the current month's dates (substitute your actual current month — buyers will clear and replace these with their own content):

| Post Title | Publish Date | Status | Platform | Content Type |
|-----------|-------------|--------|----------|--------------|
| 5 Mistakes New Entrepreneurs Make | Day 1 | Published | LinkedIn | Post |
| Behind-the-Scenes: How We Plan Our Content | Day 2 | Published | Instagram | Reel/Short |
| The One Email Tactic That Doubled Our Open Rate | Day 3 | Published | Email | Email |
| How to Write a Hook That Stops the Scroll | Day 4 | Published | Twitter/X | Thread |
| Why Your Instagram Reels Aren't Getting Views | Day 5 | Published | Instagram | Reel/Short |
| 3 Tools We Use Every Day to Save 10 Hours a Week | Day 6 | Scheduled | LinkedIn | Post |
| The Marketing Mistake Most Founders Repeat | Day 7 | Scheduled | Twitter/X | Thread |
| How to Build a Brand People Remember | Day 8 | Scheduled | LinkedIn | Post |
| Our Content Creation Workflow (Step-by-Step) | Day 9 | Scheduled | Instagram | Carousel |
| 7 AI Prompts for Writing Better Ad Copy | Day 10 | Scheduled | LinkedIn | Post |
| What a $47 Product Taught Us About Pricing | Day 11 | Scheduled | Twitter/X | Thread |
| How to Turn One Blog Post Into 10 Pieces of Content | Day 12 | Scheduled | LinkedIn | Post |
| The Email Welcome Sequence That Converts | Day 13 | Drafting | Email | Email |
| Canva Templates vs. Custom Design: What Actually Wins | Day 14 | Drafting | Instagram | Carousel |
| 10 Hooks for Your Next Social Media Post | Day 15 | Drafting | Twitter/X | Thread |
| How to Write a Landing Page in Under an Hour | Day 16 | Drafting | LinkedIn | Post |
| The 3-Part Framework for Writing Sales Emails | Day 17 | Drafting | Email | Email |
| Before-and-After: Our Website Redesign | Day 18 | Drafting | Instagram | Reel/Short |
| What We Learned From Our First 100 Customers | Day 19 | Drafting | LinkedIn | Post |
| How We Use AI to Write 30 Days of Content in One Session | Day 20 | Drafting | YouTube | Video |
| 5 Reels Ideas You Can Film in 10 Minutes | Day 21 | Drafting | Instagram | Reel/Short |
| The Simple Formula for a High-Converting CTA | Day 22 | Idea | LinkedIn | Post |
| Why Consistency Beats Creativity in Content Marketing | Day 23 | Idea | Twitter/X | Thread |
| What No One Tells You About Building an Audience | Day 24 | Idea | LinkedIn | Post |
| Our Biggest Content Flop (and What We Learned) | Day 25 | Idea | Instagram | Reel/Short |
| How to Write Subject Lines People Actually Open | Day 26 | Idea | Email | Email |
| The Content Calendar System That Finally Stuck | Day 27 | Idea | LinkedIn | Post |
| 5 Things to Post When You Have Nothing to Say | Day 28 | Idea | Instagram | Carousel |
| How to Repurpose Your Best Content Across Platforms | Day 29 | Idea | LinkedIn | Post |
| Monthly Review: What Worked, What Didn't | Day 30 | Idea | Twitter/X | Thread |

**For the Prompt Used and Notes fields:** Leave these blank — they are for the buyer to fill in as they use the kit.

---

## Template 2: 90-Day Content Calendar

**Page title:** `90-Day Content Calendar — AI Marketing Kit`

### Step 1: Create the page

1. In your Notion sidebar, click `+ New Page`
2. Name it exactly: `90-Day Content Calendar — AI Marketing Kit`

### Step 2: Create the database

1. In the page body, type `/database` → Select **"Database - Inline"**
2. Name the database: `90-Day Content Calendar`

### Step 3: Add all properties

Start with the same 7 properties as the 30-Day Calendar:

| # | Property Name | Type | Options |
|---|--------------|------|---------|
| 1 | Post Title | Title (default) | Rename from "Name" |
| 2 | Publish Date | Date | Date type |
| 3 | Status | Select | Idea (gray), Drafting (yellow), Scheduled (blue), Published (green) |
| 4 | Platform | Multi-select | Instagram, LinkedIn, Twitter/X, Facebook, YouTube, Email, TikTok, Pinterest |
| 5 | Content Type | Select | Post, Reel/Short, Thread, Email, Video, Carousel, Story |
| 6 | Prompt Used | Text | — |
| 7 | Notes | Text | — |

Then add these **three additional properties**:

| # | Property Name | Type | Options |
|---|--------------|------|---------|
| 8 | Quarter | Select | Q1 (default color), Q2, Q3, Q4 |
| 9 | Theme / Campaign | Text | — |
| 10 | Goal | Select | Brand Awareness, Lead Generation, Engagement, Sales Conversion, Retention |

### Step 4: Create views

1. **Table view (default):** Rename to `Table`. Sort by `Publish Date` ascending.

2. **Calendar view:** `+ Add a view` → Calendar → Name: `Calendar` → Show by: `Publish Date`

3. **Gallery view:**
   - `+ Add a view` → Gallery → Name: `Gallery`
   - Set card preview: None (no cover image)
   - Group by: `Platform`
   - Show on card: `Post Title`, `Publish Date` (hide others)

4. **Timeline view:**
   - `+ Add a view` → Timeline → Name: `Timeline`
   - Date property — Start: `Publish Date`, End: `Publish Date` (single-day tasks)
   - Group by: None (or Platform if preferred)

### Step 5: Pre-fill 90 sample entries

Distribute entries across 13 weeks. Use Q1 for entries 1–45 and Q2 for entries 46–90 (or substitute with your current and next quarter).

**Weeks 1–4 (Q1, Brand Awareness focus) — 28 entries:**

| Post Title | Quarter | Goal | Platform | Content Type | Status |
|-----------|---------|------|----------|--------------|--------|
| Why Every Business Needs a Content Strategy | Q1 | Brand Awareness | LinkedIn | Post | Published |
| 5 Mistakes That Kill Your Social Media Growth | Q1 | Brand Awareness | Instagram | Reel/Short | Published |
| The 30-Second Elevator Pitch Formula | Q1 | Brand Awareness | Twitter/X | Thread | Published |
| How to Define Your Brand Voice in One Afternoon | Q1 | Brand Awareness | LinkedIn | Post | Published |
| What Is a Content Calendar (And Why You Need One) | Q1 | Brand Awareness | LinkedIn | Post | Scheduled |
| 7 Questions to Find Your Ideal Customer | Q1 | Brand Awareness | Twitter/X | Thread | Scheduled |
| How to Write Content Your Audience Actually Wants | Q1 | Brand Awareness | LinkedIn | Post | Scheduled |
| Behind the Brand: Our Story | Q1 | Brand Awareness | Instagram | Reel/Short | Scheduled |
| The Fastest Way to Build Brand Recognition | Q1 | Brand Awareness | LinkedIn | Post | Scheduled |
| 3 Brands That Nail Their Messaging (And What to Copy) | Q1 | Brand Awareness | Twitter/X | Thread | Drafting |
| How to Make Your Business Impossible to Ignore | Q1 | Brand Awareness | LinkedIn | Post | Drafting |
| What Makes a Great About Page | Q1 | Brand Awareness | Email | Email | Drafting |
| Your Brand Is Not Your Logo | Q1 | Brand Awareness | Instagram | Carousel | Drafting |
| How to Show Up Consistently Without Burning Out | Q1 | Brand Awareness | LinkedIn | Post | Drafting |

**Weeks 5–7 (Q1, Lead Generation focus) — 21 entries:**

| Post Title | Quarter | Goal | Platform | Content Type | Status |
|-----------|---------|------|----------|--------------|--------|
| The Free Lead Magnet Formula That Actually Works | Q1 | Lead Generation | LinkedIn | Post | Drafting |
| How to Build an Email List From Scratch | Q1 | Lead Generation | YouTube | Video | Idea |
| 5 Opt-in Page Mistakes (And How to Fix Them) | Q1 | Lead Generation | LinkedIn | Post | Idea |
| The Welcome Email Sequence That Converts Subscribers | Q1 | Lead Generation | Email | Email | Idea |
| What to Offer as a Lead Magnet in Your Industry | Q1 | Lead Generation | Twitter/X | Thread | Idea |
| How to Drive Traffic to Your Lead Magnet | Q1 | Lead Generation | LinkedIn | Post | Idea |
| The Pop-Up Form That Gets 15% Opt-In Rates | Q1 | Lead Generation | Instagram | Carousel | Idea |
| Quiz Lead Magnets: Do They Still Work? | Q1 | Lead Generation | Twitter/X | Thread | Idea |
| From Visitor to Subscriber: Our Full Funnel | Q1 | Lead Generation | YouTube | Video | Idea |
| Writing Lead Magnet Headlines That Convert | Q1 | Lead Generation | LinkedIn | Post | Idea |
| How to Promote Your Lead Magnet Without Paid Ads | Q1 | Lead Generation | Twitter/X | Thread | Idea |
| The 2-Page Landing Page That Outperforms Everything | Q1 | Lead Generation | LinkedIn | Post | Idea |
| How Often Should You Email Your List | Q1 | Lead Generation | Email | Email | Idea |
| Lead Magnet vs. Free Trial: Which Wins? | Q1 | Lead Generation | LinkedIn | Post | Idea |
| Our Highest-Converting Opt-In Page (Breakdown) | Q1 | Lead Generation | Instagram | Reel/Short | Idea |
| Building Your List Before You Have a Product | Q1 | Lead Generation | Twitter/X | Thread | Idea |
| 3 Lead Magnet Types Ranked by Conversion Rate | Q1 | Lead Generation | LinkedIn | Post | Idea |
| How to Repurpose Your Lead Magnet Into 20 Posts | Q1 | Lead Generation | LinkedIn | Post | Idea |
| The Email That Gets 50% of Subscribers to Reply | Q1 | Lead Generation | Email | Email | Idea |
| From Lead Magnet to First Sale: The Exact Sequence | Q1 | Lead Generation | YouTube | Video | Idea |
| Tools We Use to Grow Our Email List | Q1 | Lead Generation | LinkedIn | Post | Idea |

**Weeks 8–10 (Q2, Engagement focus) — 21 entries:**

| Post Title | Quarter | Goal | Platform | Content Type | Status |
|-----------|---------|------|----------|--------------|--------|
| The Comment Strategy That Grows Your Following | Q2 | Engagement | Instagram | Reel/Short | Idea |
| How to Write Posts That Get Shared | Q2 | Engagement | LinkedIn | Post | Idea |
| Community Building 101 for Solo Brands | Q2 | Engagement | LinkedIn | Post | Idea |
| Ask Me Anything: Behind Our Business | Q2 | Engagement | Instagram | Story | Idea |
| The Thread Format That Gets 10x Engagement | Q2 | Engagement | Twitter/X | Thread | Idea |
| Poll: What Content Do You Want More Of? | Q2 | Engagement | LinkedIn | Post | Idea |
| Why Comments Beat Likes as an Engagement Signal | Q2 | Engagement | LinkedIn | Post | Idea |
| 5 Conversation Starters for Your Next Post | Q2 | Engagement | Twitter/X | Thread | Idea |
| How We Respond to Every Comment (And Why It Matters) | Q2 | Engagement | Instagram | Reel/Short | Idea |
| The Carousel Format That Gets Saved 3x More | Q2 | Engagement | Instagram | Carousel | Idea |
| User-Generated Content: How to Get It Without Asking | Q2 | Engagement | LinkedIn | Post | Idea |
| The Reply Strategy for Growing on Twitter/X | Q2 | Engagement | Twitter/X | Thread | Idea |
| How to Build a Loyal Audience in 90 Days | Q2 | Engagement | YouTube | Video | Idea |
| What Makes People Share Your Content | Q2 | Engagement | LinkedIn | Post | Idea |
| The Email That Gets the Most Replies | Q2 | Engagement | Email | Email | Idea |
| How to Turn Followers Into a Community | Q2 | Engagement | LinkedIn | Post | Idea |
| Engagement Pods: Why We Stopped Using Them | Q2 | Engagement | Twitter/X | Thread | Idea |
| Instagram Stories Strategy for Business Accounts | Q2 | Engagement | Instagram | Story | Idea |
| The DM Strategy for Building Relationships at Scale | Q2 | Engagement | Instagram | Reel/Short | Idea |
| How to Make Your Audience Feel Heard | Q2 | Engagement | LinkedIn | Post | Idea |
| The Weekly Newsletter Format That Gets 50% Open Rates | Q2 | Engagement | Email | Email | Idea |

**Weeks 11–13 (Q2, Sales Conversion focus) — 20 entries:**

| Post Title | Quarter | Goal | Platform | Content Type | Status |
|-----------|---------|------|----------|--------------|--------|
| How to Write a Sales Page That Converts Cold Traffic | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| The 5-Email Sales Sequence That Works Every Time | Q2 | Sales Conversion | Email | Email | Idea |
| Objection Handling: "It's Too Expensive" | Q2 | Sales Conversion | Twitter/X | Thread | Idea |
| Social Proof 101: How to Get and Use Testimonials | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| The Launch Email That Generated $10K in 24 Hours | Q2 | Sales Conversion | Email | Email | Idea |
| How to Use Urgency Without Being Manipulative | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| Before and After: Customer Results Showcase | Q2 | Sales Conversion | Instagram | Carousel | Idea |
| The Offer Stack That Justifies a Premium Price | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| How to Write a CTA That Actually Gets Clicked | Q2 | Sales Conversion | Twitter/X | Thread | Idea |
| FAQ Post: Your Top 10 Questions Answered | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| Case Study: How [Customer] Got [Result] | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| The Guarantee That Removes Buyer Risk | Q2 | Sales Conversion | Email | Email | Idea |
| Price Anchoring: How to Make Your Price Feel Small | Q2 | Sales Conversion | Twitter/X | Thread | Idea |
| The Countdown Email Sequence for Flash Sales | Q2 | Sales Conversion | Email | Email | Idea |
| Why Your Sales Page Isn't Converting (Checklist) | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| The One-Line Description That Sells Your Product | Q2 | Sales Conversion | Twitter/X | Thread | Idea |
| Webinar vs. Sales Call: Which Converts Better | Q2 | Sales Conversion | YouTube | Video | Idea |
| 3 Pricing Psychology Tricks That Work | Q2 | Sales Conversion | LinkedIn | Post | Idea |
| The Re-Engagement Email for Inactive Subscribers | Q2 | Sales Conversion | Email | Email | Idea |
| Q2 Wrap-Up: What We Sold and What We Learned | Q2 | Sales Conversion | LinkedIn | Post | Idea |

---

## Template 3: Brand Strategy Workspace

**Page title:** `Brand Strategy Workspace — AI Marketing Kit`

### Step 1: Create the page

1. Click `+ New Page` in sidebar
2. Name it exactly: `Brand Strategy Workspace — AI Marketing Kit`

### Step 2: Add the instruction callout at the top

1. In the page body, type `/callout` → press Enter
2. Choose an icon (lightbulb or star works well)
3. Enter this text inside the callout:
   > Fill in each section for your brand. Use the AI prompts from Category 6 (Brand Strategy) in your prompt pack to generate first drafts quickly. Start with Section 1 and work through each section in order.

### Step 3: Build each section

**Note:** All tables in this template use Notion's **Simple Table** blocks (type `/simple table`), NOT databases. Simple tables are plain formatting blocks that copy cleanly.

---

#### Section 1: Brand Foundation

Type `/h2` → `1. Brand Foundation`

Add the following as regular text blocks below the heading:

- **Mission:** `We help [WHO] achieve [WHAT] by [HOW].`
- **Vision:** `In 5 years, [YOUR COMPANY] is known for...`
- **Core Values:**
  Type `/bulleted list` and add 5 placeholder values:
  - Authenticity — we say what we mean and do what we say
  - Customer Obsession — every decision starts with the customer's outcome
  - Clarity — we communicate simply and directly
  - Consistency — we show up the same way every day
  - Results — we measure what matters and cut what doesn't

---

#### Section 2: Target Audience (Ideal Customer Profile)

Type `/h2` → `2. Target Audience (Ideal Customer Profile)`

Type `/simple table` → Create a 2-column, 9-row table:

| Attribute | Detail |
|-----------|--------|
| Age Range | 35–45 |
| Location | Remote / Work from home |
| Job Title / Role | Marketing Manager or Founder |
| Income Level | $75K–$120K per year |
| Goals | Grow pipeline with less budget; stop relying on agencies |
| Frustrations | Agency quotes too expensive; can't justify the ROI |
| Buying Triggers | See a peer achieving results; see a clear before/after |
| Where They Hang Out Online | LinkedIn + newsletters + Twitter/X |
| Preferred Content Format | Long-form posts, email digests, practical how-to videos |

---

#### Section 3: Competitive Landscape

Type `/h2` → `3. Competitive Landscape`

Type `/simple table` → Create a 5-column, 4-row table:

| Competitor | Strength | Weakness | Price Point | Their Positioning |
|-----------|---------|---------|-------------|-------------------|
| [Competitor A] | Strong SEO, large content library | Generic advice, no personalization | Free + $99/mo | "Everything you need for content marketing" |
| [Competitor B] | Beautiful templates, strong social proof | Templates feel generic after 30 days | $47 one-time | "Content calendars for creators" |
| [Competitor C] | Community-driven, active forum | Slow product updates, dated UI | $29/mo | "Marketing community and tools" |

---

#### Section 4: Brand Voice

Type `/h2` → `4. Brand Voice`

Add these as regular text blocks:

- **Tone Adjectives:** Direct, Warm, Authoritative, Practical, Honest
- **We Sound Like:** A knowledgeable friend who has done this before and gives you the real answer, not the safe one.
- **We Do NOT Sound Like:** A corporate press release or an overhyped sales pitch.

Type `/simple table` → Create a 2-column, 6-row table:

| DO | DON'T |
|----|-------|
| Use short sentences | Use jargon or buzzwords |
| Name specific outcomes | Make vague promises |
| Address the reader directly ("you") | Speak in the third person ("one should...") |
| Use real numbers and examples | Use round numbers that feel made-up |
| Show personality | Be stiff or formal |

---

#### Section 5: Visual Identity

Type `/h2` → `5. Visual Identity`

Add as regular text blocks:

- **Primary Color:** #______ *(Fill in your brand hex code)*
- **Secondary Color:** #______ *(Fill in your accent color)*
- **Font — Headlines:** *(e.g., Montserrat Bold, Playfair Display, or system default)*
- **Font — Body:** *(e.g., Inter, Open Sans, or system default)*
- **Logo Notes:** *(Describe your logo or paste an image block here)*

---

#### Section 6: Core Messaging

Type `/h2` → `6. Core Messaging`

Add as regular text blocks:

- **Tagline:** *(Your one-line brand statement — 5–10 words)*
- **Elevator Pitch (30 sec):** *(2–3 sentences: who you help, what outcome you deliver, why you're different)*
- **Key Proof Points:**
  Type `/bulleted list` and add 3 placeholder bullets:
  - Customers achieve [SPECIFIC RESULT] within [TIME PERIOD]
  - Used by [NUMBER] [TYPE OF CUSTOMER] in [CONTEXT]
  - [DIFFERENTIATOR] — the only [PRODUCT TYPE] that [UNIQUE CLAIM]
- **Hero Statement (for landing page):** *(One punchy sentence that goes above the fold — should communicate the end result, not the product features)*

---

## Template 4: Campaign Planner

**Page title:** `Campaign Planner — AI Marketing Kit`

### Step 1: Create the page

1. Click `+ New Page` in sidebar
2. Name it exactly: `Campaign Planner — AI Marketing Kit`

### Step 2: Create the Campaigns database

1. In the page body, type `/database` → Select **"Database - Inline"**
2. Name the database: `Campaigns`

### Step 3: Add all properties

| # | Property Name | Type | Options |
|---|--------------|------|---------|
| 1 | Campaign Name | Title (default) | Rename from "Name" |
| 2 | Launch Date | Date | Date type |
| 3 | End Date | Date | Date type |
| 4 | Status | Select | Idea (gray), Planning (blue), Active (green), Paused (yellow), Complete (purple), Cancelled (red) |
| 5 | Goal | Select | Brand Awareness, Lead Generation, Sales Conversion, Retention/Loyalty, Product Launch |
| 6 | Platform | Multi-select | Instagram, LinkedIn, Twitter/X, Facebook, YouTube, Email, TikTok, Pinterest |
| 7 | Budget | Number | Format: Dollar ($) |
| 8 | Owner / Lead | Text | — |
| 9 | Notes | Text | — |

### Step 4: Create views

1. **Table view (default):** Rename to `Table`. Sort by `Launch Date` ascending.

2. **Board view:**
   - `+ Add a view` → Board → Name: `Board`
   - Group by: `Status`

3. **Calendar view:**
   - `+ Add a view` → Calendar → Name: `Calendar`
   - Show calendar by: `Launch Date`

### Step 5: Pre-fill 5 sample campaigns

| Campaign Name | Launch Date | End Date | Status | Goal | Platform | Budget |
|--------------|-------------|----------|--------|------|----------|--------|
| Q1 Brand Awareness Push | Jan 1 | Jan 31 | Complete | Brand Awareness | LinkedIn, Instagram | $500 |
| Spring Email List Growth | Feb 1 | Feb 28 | Active | Lead Generation | Email, Instagram | $250 |
| Product Launch — AI Prompt Kit | Mar 15 | Mar 31 | Planning | Product Launch | LinkedIn, Twitter/X, Email | $1,000 |
| Summer Retargeting Campaign | Jun 1 | Jun 30 | Idea | Sales Conversion | Facebook, Instagram | $750 |
| Q3 Re-Engagement Sequence | Jul 15 | Aug 15 | Idea | Retention/Loyalty | Email | $0 |

### Step 6: Create sub-pages

**IMPORTANT:** Create these as sub-pages of the `Campaign Planner — AI Marketing Kit` page, NOT inside the Campaigns database. To do this: click into the page (outside the database) and type `/page`.

**Sub-page 1: Campaign Brief Template**

Page title: `Campaign Brief Template`

Add this content:

```
# Campaign Brief Template

## Campaign Name
[Name of campaign]

## Objective
[What does this campaign need to achieve? Be specific: "Generate 200 new email subscribers" not "grow our list"]

## Target Audience
[Who is this campaign for? Include: demographics, current awareness level, what they believe now vs. what you want them to believe]

## Key Messages
- Message 1: [Primary value proposition or hook]
- Message 2: [Supporting proof point]
- Message 3: [Call to action theme]

## Budget
- Total budget: $[amount]
- Allocation: [e.g., 60% ads, 30% content production, 10% tools]

## Timeline
- Campaign start: [date]
- Campaign end: [date]
- Key milestones: [list any internal deadlines, launch dates, review checkpoints]

## Success Metrics
| Metric | Target | Tracking Method |
|--------|--------|----------------|
| [e.g., Email subscribers added] | [e.g., 200] | [e.g., Kit dashboard] |
| [e.g., Landing page conversion rate] | [e.g., 30%] | [e.g., Cloudflare Analytics] |
| [e.g., Revenue generated] | [e.g., $2,000] | [e.g., Stripe dashboard] |

## Assets Needed
- [ ] Landing page copy
- [ ] Email sequence (how many emails?)
- [ ] Ad creative (how many variants?)
- [ ] Social posts (which platforms, how many?)
- [ ] Lead magnet or offer asset
```

**Sub-page 2: Results Tracker**

Page title: `Results Tracker`

Type `/simple table` → Create a 4-column table:

| Metric | Target | Actual | Notes |
|--------|--------|--------|-------|
| Impressions | — | — | — |
| Clicks | — | — | — |
| CTR (Click-Through Rate) | — | — | — |
| Leads / Opt-ins | — | — | — |
| Conversions / Sales | — | — | — |
| CPA (Cost Per Acquisition) | — | — | — |
| Revenue Generated | — | — | — |
| Email Open Rate | — | — | — |
| Email Click Rate | — | — | — |
| Return on Ad Spend (ROAS) | — | — | — |

---

## Publishing Each Template

**Do this immediately after building each template, before starting the next one.**

### Publishing Steps (repeat for each template)

- [ ] 1. Click the **Share** button (top right of the Notion page)
- [ ] 2. Click the **Publish** tab (not "Share to web" — look for the Publish tab)
- [ ] 3. Click **"Publish to web"**
- [ ] 4. Confirm the **"Allow duplicate as template"** toggle is **ON** (it should default to on)
- [ ] 5. Copy the public URL (it will look like `https://notion.so/your-workspace/page-title-[hash]`)
- [ ] 6. Paste the URL into the **URL Registry** table at the bottom of this document

**What the published page looks like to buyers:** They see the full page with all databases and content, plus a "Duplicate" button in the top right corner. They click Duplicate, choose their workspace, and get an independent copy.

---

## Testing with a Fresh Notion Account

**Do this after all four templates are published.**

1. Open a **private/incognito browser window**
2. Go to [notion.so](https://notion.so) and log in with a **DIFFERENT** Notion account (create one with a secondary email if needed — free accounts work)
3. For each template, open its public URL in the fresh account
4. Click **"Duplicate"** (top right corner)
5. Select a workspace → confirm the duplicate appears in the fresh workspace
6. Open the duplicated page and verify:
   - All databases are present with the sample entries you added
   - All views are present (Table, Calendar, Board, etc.)
   - No errors appear on any view
7. **Critical data isolation test:** In the duplicated database, add a new row with any title. Then switch back to your original creator account — confirm that new row does **NOT** appear in your original database.
   - If the row DOES appear: the template is using a Linked View. You must rebuild that database as an inline database.
   - If the row does NOT appear: the template is correctly isolated. Mark it as Tested.
8. After verifying all four templates, mark each as Tested in the URL Registry below

---

## URL Registry

Fill in after publishing each template:

| Template | Public URL | Status |
|----------|------------|--------|
| 30-Day Content Calendar | [paste URL here] | [ ] Tested |
| 90-Day Content Calendar | [paste URL here] | [ ] Tested |
| Brand Strategy Workspace | [paste URL here] | [ ] Tested |
| Campaign Planner | [paste URL here] | [ ] Tested |

---

*These four URLs are the exact links that will be pasted into Kit automation delivery emails sent to buyers after purchase.*
