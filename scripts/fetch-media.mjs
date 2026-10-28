// Downloads the Creative Commons wildlife photos referenced in src/lib/site.ts into public/media
// and rewrites the manifest to use local paths. Run on a machine with normal internet access.
import fs from "node:fs";
const p = "src/lib/site.ts"; let src = fs.readFileSync(p, "utf8");
const re = /commons\("([^"]+)"(?:,\s*(\d+))?\)/g; let m; const jobs = [];
while ((m = re.exec(src))) jobs.push({ file: m[1], width: m[2] ?? "1600", call: m[0] });
fs.mkdirSync("public/media/wild", { recursive: true });
for (const j of jobs) {
  const slug = j.file.toLowerCase().replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const out = `public/media/wild/${slug}.jpg`;
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(j.file)}?width=${j.width}`;
  const r = await fetch(url, { headers: { "User-Agent": "zuliaconservancy.org media fetch" } });
  if (!r.ok) { console.error("failed", j.file, r.status); continue; }
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  src = src.replace(j.call, `"/media/wild/${slug}.jpg"`);
  console.log("saved", out);
}
fs.writeFileSync(p, src);
