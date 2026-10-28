// Records /film?record=1 to an MP4. Usage: node scripts/record-film.mjs http://localhost:3011 public/media/zulia-film.mp4
import { chromium } from "playwright"; // npm i -D playwright && npx playwright install chromium
import { execSync } from "node:child_process";
import fs from "node:fs";
const [base = "http://localhost:3011", out = "public/media/zulia-film.mp4"] = process.argv.slice(2);
const dir = "/tmp/film-rec"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir, size: { width: 1920, height: 1080 } } });
const page = await ctx.newPage();
await page.goto(`${base}/film?record=1`, { waitUntil: "networkidle" });
await page.waitForTimeout(122500);
await ctx.close(); await browser.close();
const webm = fs.readdirSync(dir).find((f) => f.endsWith(".webm"));
execSync(`ffmpeg -y -v error -i ${dir}/${webm} -ss 0.5 -t 121 -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -movflags +faststart -r 30 ${out}`, { stdio: "inherit" });
console.log("wrote", out);
