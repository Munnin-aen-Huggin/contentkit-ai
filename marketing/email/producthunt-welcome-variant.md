# Product Hunt Welcome Variant — 2-Email Sequence

**Trigger:** New subscriber with `utm_source=producthunt`
**ConvertKit Tag:** `source-producthunt`
**Sequence Name:** Product Hunt Welcome Variant
**Total Emails:** 2 (Day 0, Day 1)

---

## Email 1 — Welcome + Immediate Value (Day 0, Immediate)

**Subject Line:** ContentKit AI — your download + quick context

**Preview Text:** What's inside and how to use it today

**Body:**

Hey {first_name},

You probably saw us on Product Hunt — here's why makers love this kit.

First, your free guide:

**[Download: 5 High-Converting AI Marketing Prompts (PDF)]({download_link})**

Now the context, since you're likely evaluating this alongside 10 other tools today:

**What ContentKit AI is:**
A library of 500+ copy-paste AI prompts built specifically for marketing. Email sequences, ad copy, landing pages, social content, SEO, cold outreach — all organized by channel and use case.

**What it is not:**
Not a SaaS. Not a monthly subscription. Not an AI wrapper. It's a reference toolkit you buy once and use inside ChatGPT, Claude, or whatever LLM you already have open.

**Time math:**
An average marketing email takes 30-45 minutes to write from scratch. With ContentKit, you paste a prompt, fill in your specifics, and get a solid first draft in under 3 minutes. Across a week of marketing tasks, that's 5-8 hours back.

The free guide has 5 prompts so you can test the format yourself. They're fully functional — not watered-down teasers.

Try one right now. You'll know in 3 minutes if this approach works for your workflow.

{sender_name}
Founder, ContentKit AI

---

**ConvertKit Implementation Notes:**
- Deliver immediately on confirmation
- Use first name merge tag with fallback to "Hey" (no "Hey there" or "Hey friend")
- Link directly to PDF — no landing page gate
- Keep formatting clean: short paragraphs, bold headers, no images

---

## Email 2 — Direct Offer (Day 1)

**Subject Line:** Full kit — 500+ prompts, one purchase

**Preview Text:** The ROI breakdown for ContentKit AI

**Body:**

{first_name},

One follow-up since you grabbed the free guide yesterday.

If the prompts worked for you, here's the full kit:

**ContentKit AI — 500+ AI Marketing Prompts**

| What You Get | Details |
|---|---|
| Prompt count | 500+ across every marketing channel |
| Channels covered | Email, ads, social, SEO, landing pages, cold outreach, product launches |
| Format | Copy-paste into any LLM (ChatGPT, Claude, Gemini) |
| Pricing | One-time purchase. No subscription. |
| Updates | Lifetime access to new prompts as they're added |

**ROI math for builders:**

- Average freelance copywriter: $100-300/hr
- Average time to write one marketing asset: 30-45 min
- ContentKit reduces that to 3-5 min per asset
- If you create 20 marketing assets/month, that's ~10 hours saved
- At even $50/hr for your time, that's $500/month in time value
- ContentKit pays for itself on the first day you use it

**[Get ContentKit AI →]({sales_page_link}?utm_source=producthunt&utm_medium=email&utm_campaign=ph_welcome)**

No trial period because there's nothing to trial — it's a file you own. No recurring charges. If you ship products, you already know the value of owning your tools instead of renting them.

{sender_name}

---

**ConvertKit Implementation Notes:**
- Send exactly 24 hours after Email 1
- Table formatting: ConvertKit supports HTML tables — use inline styles for consistent rendering across email clients
- After this email, move subscriber to main nurture sequence (tag: `ph-welcome-complete`)
- If subscriber purchases, add tag `customer` and remove from all promotional sequences
- Do NOT send a third email — Product Hunt users will unsubscribe if the cadence feels like a drip campaign

---

## Sequence-Level Technical Notes

**ConvertKit Setup:**
- Create a Visual Automation triggered by tag `source-producthunt`
- Entry condition: subscriber does NOT have tag `customer`
- Single delay of 1 day between emails
- Exit condition: subscriber gains tag `customer` at any point
- Automation should be marked high priority — Product Hunt traffic is time-sensitive and decays fast

**UTM Tagging Rule:**
- On signup form, capture `utm_source` via hidden field
- If `utm_source` = `producthunt`, auto-apply tag `source-producthunt`
- Optionally capture `utm_campaign` to identify specific launch day vs. evergreen PH traffic

**Performance Tracking:**
- Track open rates per email (target: 60%+ for Email 1, 45%+ for Email 2)
- Track click rate on Email 2 CTA (target: 12%+)
- Track conversion rate from click to purchase
- Compare against default welcome sequence and Reddit variant
- Monitor unsubscribe rate closely — if above 2% on Email 2, revisit timing or copy

**Important — Timing Sensitivity:**
- Product Hunt traffic spikes on launch day and drops sharply after 48 hours
- This sequence is designed to convert within that window
- Do not extend this to a 3+ email sequence — the buyer intent is highest in the first 24 hours
- If a subscriber doesn't convert from this sequence, they enter the standard nurture track where longer relationship-building makes sense
