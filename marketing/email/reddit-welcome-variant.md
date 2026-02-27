# Reddit Welcome Variant — 3-Email Mini-Sequence

**Trigger:** New subscriber with `utm_source=reddit`
**ConvertKit Tag:** `source-reddit`
**Sequence Name:** Reddit Welcome Variant
**Total Emails:** 3 (Day 0, Day 2, Day 4)

---

## Email 1 — Welcome + Delivery (Day 0, Immediate)

**Subject Line:** Here's that free guide (no catch)

**Preview Text:** 5 AI prompts you can use right now

**Body:**

Hey,

You found us through a conversation about [marketing/freelancing/AI tools] on Reddit — glad something in that thread was actually useful for once.

Here's the free guide you grabbed:

**[Download: 5 High-Converting AI Marketing Prompts (PDF)]({download_link})**

No hoops. No "webinar" to sit through. Just open it and start using the prompts.

A few things worth knowing:

- These 5 prompts are pulled directly from ContentKit AI
- They work in ChatGPT, Claude, or any LLM
- Each one has a specific use case (cold emails, landing pages, ad copy, social posts, blog intros)

Use them. See if they actually save you time. That's the whole point.

Talk soon,
{sender_name}

P.S. — If you reply to this email, I actually read it. Not a bot.

---

**ConvertKit Implementation Notes:**
- Deliver immediately on confirmation
- Use conditional merge tag for subreddit topic if captured via UTM (`utm_content` or `utm_campaign` can carry subreddit name)
- Fallback text for topic bracket: "marketing/freelancing/AI tools"
- Attach or link the lead magnet PDF directly — no intermediate landing page

---

## Email 2 — Value Follow-Up (Day 2)

**Subject Line:** One prompt most people skip

**Preview Text:** This is the one that actually moves the needle

**Body:**

Quick follow-up.

If you downloaded the guide but haven't tried Prompt #3 yet — that's the one I'd start with. It's a positioning prompt that helps you write copy that sounds like *you* instead of like a chatbot threw up a LinkedIn post.

Most people skip it because it looks simple. That's exactly why it works.

Here's how to get the most out of it:

1. Open ChatGPT or Claude
2. Paste the prompt exactly as written
3. Fill in the bracket fields with your actual product/service details
4. Run it — then run it again with one variable changed

That second run is where the good stuff happens. You start seeing angles you wouldn't have found on your own.

The free guide has 5 prompts like this.

The full ContentKit AI has 500+, organized by channel (email, ads, social, SEO, landing pages). Same format — paste, fill in, run.

Not pushing it on you. Just want you to know it exists if you burn through the free ones and want more.

{sender_name}

---

**ConvertKit Implementation Notes:**
- Send 2 days after Email 1
- No CTA button — keep it text-only for deliverability and to match Reddit's low-hype expectations
- Track opens to gauge engagement before sending Email 3

---

## Email 3 — Soft Pitch (Day 4)

**Subject Line:** Reddit-only: 20% off the full kit

**Preview Text:** 500+ prompts, one-time purchase

**Body:**

Last one from me for a while.

You grabbed the free guide a few days ago. If you used even one of those prompts and thought "okay, this actually works" — here's the full picture:

**ContentKit AI — 500+ AI Marketing Prompts**

- Every channel: email sequences, ad copy, social posts, SEO content, landing pages, cold outreach
- Organized by use case so you find what you need in seconds
- Works with ChatGPT, Claude, Gemini — any LLM
- One-time purchase. No subscription. No upsell ladder.

Since you came from Reddit, this is yours:

**Use code REDDIT20 at checkout for 20% off.**

**[Get ContentKit AI →]({sales_page_link}?utm_source=reddit&utm_medium=email&utm_campaign=reddit_welcome&discount=REDDIT20)**

No deadline. No fake scarcity. The code works when you're ready.

If it's not for you, totally fine. The free guide is yours to keep either way.

{sender_name}

---

**ConvertKit Implementation Notes:**
- Send 4 days after Email 1
- Apply `REDDIT20` discount code in ConvertKit commerce or link to Gumroad/Stripe with coupon pre-applied
- After this email, move subscriber to main nurture sequence (tag: `reddit-welcome-complete`)
- If subscriber clicks the purchase link, suppress further pitch emails (add tag: `clicked-offer`)
- If subscriber purchases, add tag `customer` and remove from all promotional sequences

---

## Sequence-Level Technical Notes

**ConvertKit Setup:**
- Create a Visual Automation triggered by tag `source-reddit`
- Entry condition: subscriber does NOT have tag `customer`
- Use delays of 2 days and 2 days between emails
- Exit condition: subscriber gains tag `customer` at any point

**UTM Tagging Rule:**
- On signup form, capture `utm_source` via hidden field
- If `utm_source` = `reddit`, auto-apply tag `source-reddit`
- Optionally capture `utm_content` to store subreddit name for personalization

**Performance Tracking:**
- Track open rates per email (target: 55%+ for Email 1, 40%+ for Email 2, 35%+ for Email 3)
- Track click rate on Email 3 CTA (target: 8%+)
- Track coupon redemption rate for REDDIT20
- Compare conversion rate against default welcome sequence
