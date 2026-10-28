# zuliaconservancy.org

Website for Zulia Conservancy (Uganda) Limited. Next.js 15 (App Router), Tailwind 4, d3-geo for the maps. No database, no CMS: content lives in the page files and `src/lib/site.ts`.

## Run it

```
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run fetch-media  # optional: download the Creative Commons wildlife photos into public/media
npm run film         # optional: re-render the two-minute film (needs `npm run dev` running)
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** the repo. Framework is detected as Next.js; no settings to change.
3. **Password-protect it** until the licence position is confirmed: Project → Settings → Deployment Protection → *Vercel Authentication* (team members only) or *Password Protection* (Pro plan) and set a password to share with Christo, NFA and AWF.
4. Domain: Project → Settings → Domains → add `zuliaconservancy.org` and `www.zuliaconservancy.org`, then set the DNS records Vercel shows at the registrar.
5. Forms: create a free form at formspree.io (or similar), then Project → Settings → Environment Variables → `NEXT_PUBLIC_FORM_ENDPOINT` = the form URL. Until that is set, the Donate and Contact forms open the visitor's email client addressed to `amauganda@gmail.com`.
6. When ready to go public: remove `robots: { index: false }` from `src/app/layout.tsx` and turn off deployment protection.

## Where things are

| What | Where |
|---|---|
| Name, contact details, social links, facts, photo manifest | `src/lib/site.ts` |
| Pages | `src/app/*/page.tsx` — home, about, what-we-do, concession, opportunities (+ adventure), film, donate, contact |
| Animated Africa → Uganda → Zulia map | `src/components/ZoomMap.tsx` (data in `public/geo/`) |
| Trail concept map | `src/components/TrailMap.tsx` (routes are illustrative; edit the `routes` array) |
| Two-minute film | `src/components/Film.tsx`; script and storyboard in `docs/FILM.md`; render in `public/media/zulia-film.mp4` |
| Logo | `public/mark.svg` (dark on light), `public/mark-light.svg` (light on dark). Contours generated from a synthetic peak; the summit triangle is the dawn orange. |
| Design tokens | `src/app/globals.css` under `@theme` — granite, kopje, olive, palm, sand, bone, dawn, ember |
| Concession boundary | `public/geo/zulia.json` (NFA 2021 via WDPA 40604, rewound for d3) and `public/Zulia_Concession.kml` |

## Media and licences

- Landscape photographs and aerial footage: Zulia Conservancy's own. Add more to `public/media/` and reference them in `src/lib/site.ts`.
- Wildlife photographs are Creative Commons BY-SA works from Wikimedia Commons, credited in captions and the footer. They are hot-linked by default; `npm run fetch-media` downloads them locally and rewrites the manifest. Keep the credits.
- Fonts are self-hosted via `@fontsource` (Bodoni Moda, Albert Sans); no Google Fonts calls.

## Before going public

Things the site asserts that should be confirmed first: that NFA Licence No. 30 has passed its probationary period and is in its continuation phase; the NEMA ESIA status; and that any wording about hunting and ranching matches what UWA has actually licensed. See the investment memo for the detail.
