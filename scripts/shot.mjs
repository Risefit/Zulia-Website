// Screenshot pages with Playwright: node scripts/shot.mjs <url> <out> [width] [fullPage] [waitMs]
import pw from "/opt/npm-tools/node_modules/playwright/index.js"; const { chromium } = pw;
const [url, out, w = "1400", full = "1", wait = "1500"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 900 } });
page.on("console", (m) => { if (m.type() === "error") console.log("console:", m.text()); });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(+wait);
if (full === "1") { // trigger lazy images
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
}
await page.screenshot({ path: out, fullPage: full === "1" });
await browser.close();
console.log("saved", out);
