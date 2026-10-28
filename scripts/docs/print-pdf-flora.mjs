import pw from "/opt/npm-tools/node_modules/playwright/index.js"; const { chromium } = pw;
const b = await chromium.launch(); const p = await b.newPage();
await p.goto("file:///home/claude/zulia-maps/out/flora.html", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
await p.pdf({ path: "/home/claude/zulia-maps/out/Zulia_Living_Landscape.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
await b.close(); console.log("pdf ok");
