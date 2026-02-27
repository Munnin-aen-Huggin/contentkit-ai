# Tracking Setup — Google Ads + Meta Pixel

## Overview

All conversion tracking must be live BEFORE any ad spend. This document covers account creation, pixel installation, and Stripe redirect configuration.

---

## 1. Google Ads Setup

### Create Account
1. Go to [ads.google.com](https://ads.google.com) and sign in with your Google account
2. Choose "Switch to Expert Mode" (skip Smart Campaign setup)
3. Click "Create an account without a campaign" at the bottom
4. Set billing country, time zone, and currency (USD)
5. Submit — your account is now created

### Get Your Conversion ID
1. Go to **Tools & Settings > Conversions** (under Measurement)
2. Click **+ New conversion action** > **Website**
3. Enter your domain: `getcontentkit.com`
4. Set up a manual conversion:
   - **Category:** Purchase
   - **Conversion name:** ContentKit Purchase
   - **Value:** Use different values for each conversion (dynamic)
   - **Count:** Every conversion
5. Copy the **Conversion ID** (format: `AW-XXXXXXXXXX`)
6. Copy the **Conversion Label** (format: random string)

### Replace Placeholders in Code
Search and replace across ALL HTML files:
- `AW-XXXXXXXXXX` → your actual Conversion ID (appears in gtag config AND conversion event)
- `AW-XXXXXXXXXX/CONVERSION_LABEL` → your Conversion ID/Label combo (appears in thank-you.html only)

### Files Containing Google Ads Tags
- `index.html` — gtag base + begin_checkout event
- `thank-you.html` — gtag base + Purchase conversion event
- `blog/index.html` — gtag base
- `blog/ai-marketing-prompts.html` — gtag base + begin_checkout
- `blog/ai-email-marketing-prompts.html` — gtag base + begin_checkout
- `blog/ai-social-media-prompts.html` — gtag base + begin_checkout
- `blog/ai-copywriting-prompts-free.html` — gtag base + begin_checkout
- `blog/chatgpt-marketing-templates.html` — gtag base + begin_checkout

---

## 2. Meta Pixel Setup

### Create Pixel
1. Go to [business.facebook.com](https://business.facebook.com)
2. Create a Business Manager account if you don't have one
3. Go to **Events Manager** (left sidebar)
4. Click **Connect Data Sources** > **Web** > **Meta Pixel**
5. Name your pixel: `ContentKit AI Pixel`
6. Enter your website URL: `getcontentkit.com`
7. Copy the **Pixel ID** (format: 15-16 digit number)

### Replace Placeholders in Code
Search and replace across ALL HTML files:
- `PIXEL_ID_HERE` → your actual Pixel ID (appears in fbq init AND noscript img)

### Verify Pixel Installation
1. Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
2. Visit your live site — the extension should show:
   - `PageView` event firing on every page
   - `InitiateCheckout` firing when buy buttons are clicked
   - `Lead` firing on email form submit (index.html only)
   - `Purchase` firing on thank-you.html

### Files Containing Meta Pixel
Same list as Google Ads above — all pages have both tracking scripts.

---

## 3. Stripe Payment Link Redirect Configuration

To track which tier was purchased, configure Stripe to redirect to thank-you.html with a tier parameter.

### Starter Kit Payment Link
1. Go to Stripe Dashboard > Payment Links
2. Find/edit the Starter Kit link (`bJefZi8NU2lgfHc9TG9ws06`)
3. Under **After payment** > **Confirmation page**:
   - Select **Don't show confirmation page** (redirect instead)
   - Redirect URL: `https://getcontentkit.com/thank-you.html?tier=starter`

### Full Kit Payment Link
1. Find/edit the Full Kit link (`4gM8wQ0ho7FA3Yu1na9ws05`)
2. Under **After payment** > **Confirmation page**:
   - Redirect URL: `https://getcontentkit.com/thank-you.html?tier=full`

### Test the Redirect
1. Use Stripe test mode to make a test purchase
2. Verify you land on `thank-you.html?tier=starter` (or `?tier=full`)
3. Open browser console — verify conversion events fire with correct values ($147 or $499)

---

## 4. Verification Checklist

- [ ] Google Ads account created
- [ ] Conversion ID obtained and replaced in all files
- [ ] Conversion Label obtained and replaced in thank-you.html
- [ ] Meta Pixel created
- [ ] Pixel ID obtained and replaced in all files
- [ ] Stripe Starter Kit redirect configured with `?tier=starter`
- [ ] Stripe Full Kit redirect configured with `?tier=full`
- [ ] Test purchase fires correct conversion values
- [ ] Meta Pixel Helper confirms PageView on all pages
- [ ] Meta Pixel Helper confirms InitiateCheckout on buy button click
- [ ] Meta Pixel Helper confirms Purchase on thank-you.html
- [ ] Google Ads shows conversions being tracked (may take 24-48 hours)
- [ ] Plausible dashboard shows Purchase events with revenue data

---

## 5. Placeholder Reference

| Placeholder | Where Used | Replace With |
|---|---|---|
| `AW-XXXXXXXXXX` | All HTML files (gtag config) | Google Ads Conversion ID |
| `AW-XXXXXXXXXX/CONVERSION_LABEL` | thank-you.html only | Conversion ID/Label |
| `PIXEL_ID_HERE` | All HTML files (fbq init + noscript) | Meta Pixel ID |
