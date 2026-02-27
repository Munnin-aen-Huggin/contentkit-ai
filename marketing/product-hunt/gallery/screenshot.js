#!/usr/bin/env node

/**
 * Screenshot all 5 Product Hunt gallery HTML templates at 1270x760px.
 *
 * Usage:
 *   cd /Users/wilfredshammah/Desktop/dp/marketing/product-hunt/gallery
 *   npx puppeteer browsers install chrome
 *   node screenshot.js
 *
 * Requires puppeteer to be installed (npm install puppeteer).
 */

const { execSync } = require("child_process");
const path = require("path");

// Dynamically resolve puppeteer from npx cache or node_modules
let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  // Fallback: find puppeteer via npx resolution
  const puppeteerPath = execSync("node -e \"console.log(require.resolve('puppeteer'))\"", {
    env: { ...process.env, NODE_PATH: execSync("npm root -g", { encoding: "utf8" }).trim() },
    encoding: "utf8",
  }).trim();
  puppeteer = require(path.dirname(puppeteerPath));
}

const GALLERY_DIR = __dirname;
const WIDTH = 1270;
const HEIGHT = 760;

const slides = [
  { html: "01-hero.html", png: "01-hero.png" },
  { html: "02-categories.html", png: "02-categories.png" },
  { html: "03-before-after.html", png: "03-before-after.png" },
  { html: "04-social-proof.html", png: "04-social-proof.png" },
  { html: "05-pricing.html", png: "05-pricing.png" },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  for (const slide of slides) {
    const filePath = path.join(GALLERY_DIR, slide.html);
    const fileUrl = `file://${filePath}`;

    console.log(`Screenshotting ${slide.html} ...`);
    await page.goto(fileUrl, { waitUntil: "networkidle0" });

    const outPath = path.join(GALLERY_DIR, slide.png);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`  -> saved ${slide.png}`);
  }

  await browser.close();
  console.log("\nDone. All 5 gallery PNGs created.");
})();
