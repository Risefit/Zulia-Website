"""Zulia Conservancy — Lodge sites prospectus. Builds HTML in the website's theme and prints to PDF."""
import json, math, os, base64, html
from shapely.geometry import LineString, Point, Polygon

ROOT = '/home/claude/zulia-website'
OUT = '/home/claude/zulia-maps/out'; os.makedirs(OUT, exist_ok=True)
sites = json.load(open('lodge_sites.json'))
feats = json.load(open('osm.json'))
zul = json.load(open(f'{ROOT}/public/geo/zulia.json'))
def poly(n): return Polygon(next(f for f in zul['features'] if f['properties']['name'].startswith(n))['geometry']['coordinates'][0])
ZULIA, OVERLAP, KIDEPO = poly('Zulia Central'), poly('Dual'), poly('Kidepo Valley')
SUMMIT = (33.9844, 4.1239)

def font(name):
    return base64.b64encode(open(f'{ROOT}/node_modules/@fontsource/{name}','rb').read()).decode()
FONTS = f"""
@font-face{{font-family:'Bodoni Moda';font-weight:400;src:url(data:font/woff2;base64,{font('bodoni-moda/files/bodoni-moda-latin-400-normal.woff2')}) format('woff2')}}
@font-face{{font-family:'Bodoni Moda';font-weight:400;font-style:italic;src:url(data:font/woff2;base64,{font('bodoni-moda/files/bodoni-moda-latin-400-italic.woff2')}) format('woff2')}}
@font-face{{font-family:'Bodoni Moda';font-weight:500;src:url(data:font/woff2;base64,{font('bodoni-moda/files/bodoni-moda-latin-500-normal.woff2')}) format('woff2')}}
@font-face{{font-family:'Albert Sans';font-weight:400;src:url(data:font/woff2;base64,{font('albert-sans/files/albert-sans-latin-400-normal.woff2')}) format('woff2')}}
@font-face{{font-family:'Albert Sans';font-weight:500;src:url(data:font/woff2;base64,{font('albert-sans/files/albert-sans-latin-500-normal.woff2')}) format('woff2')}}
@font-face{{font-family:'Albert Sans';font-weight:600;src:url(data:font/woff2;base64,{font('albert-sans/files/albert-sans-latin-600-normal.woff2')}) format('woff2')}}
"""
MARK = open(f'{ROOT}/public/mark.svg').read()
MARK_LIGHT = open(f'{ROOT}/public/mark-light.svg').read()
CONTOURS = base64.b64encode(open(f'{ROOT}/public/contours.svg','rb').read()).decode()

# ---------------- copy ----------------
ZONES = {
 'massif': ('The summit massif', 'Mount Zulia itself: the roof of the Kidepo landscape, where the air is thin and cool and the horizon runs to three countries.'),
 'west': ('The Himan foothills', 'The western approach, where the Himan River comes off the mountain and the only road in the reserve arrives. Sunset country, with the massif at your back.'),
 'central': ('The central plateau', 'The high, empty middle of the reserve south of the summit: granite domes standing over grassland, with the Kidepo plains opening to the south.'),
 'east': ('The eastern escarpment', 'The Lotukei hills and the edge of the Turkana escarpment, where Zulia drops away towards Kenya and the sun comes up out of the Rift.'),
}
SITES = {
 1: ('massif', 'The Summit Eyrie', "A hundred metres from the top of Mount Zulia, on the shoulder of the highest ground in the whole Kidepo system. Every direction is open: Kidepo's plains to the south-west, the Didinga hills of South Sudan to the north, the Turkana escarpment falling to Kenya in the east. At 2,190 metres the nights are cold enough for a fire and the mornings begin with cloud in the valleys below you. This is the flagship: a small, exclusive mountain lodge reached on foot or by air, the kind of place people cross the world for once."),
 2: ('west', 'The River Bluff', "A granite shoulder standing 190 metres above the Himan River, which runs round its foot only half a kilometre away. Open on every side, with the full western face of the massif rising behind it and the long view down the Kidepo valley in front. The road is two kilometres off: close enough to build, far enough not to hear. Of all thirty sites this is the one that balances view, water and access most completely, and the natural first lodge."),
 3: ('east', 'The Escarpment Edge', "Two kilometres from the Kenyan border at the south-eastern corner of the reserve, on a hill that looks straight down the Rift. At dawn the light comes up out of the Turkana lowlands a thousand metres below. Remote even by Zulia's standards, which is the point: a place for a wilderness camp that no road reaches, approached by foot or helicopter, with the Lotukei hills and the whole eastern wall of the reserve to walk."),
 4: ('central', 'Kidepo Overlook', "A dome in the heart of the reserve, 350 metres above the valley floor, with the Kidepo plains spreading south and west like a sea. Nearly every compass point is open. There is no road within nine kilometres and no settlement at all: elephant country, with the game moving beneath you between the river and the hills in the dry season. For an operator who wants the classic high plains view without another light anywhere in it."),
 5: ('west', 'The Gateway Hill', "Where Zulia begins. A rounded hill 350 metres from the road at Himan, with a stream at its foot and the Himan River a short walk away. It is the easiest site in the reserve to build and supply, and the view is still enormous: the massif filling the eastern sky and the valley running away to the south. The right place for the mid-range camp and for the base from which walking and riding safaris set out."),
 6: ('east', 'Loliboch Spring', "A twin to the Escarpment Edge, a kilometre to its north-east and a little lower, with a stream only 300 metres below the summit. The same vast eastward view into Kenya, the same silence. The pair of hills between them would make a small camp and a fly-camp, or a lodge with a walk-in sleep-out. Water close, ground open, the border ridge at your door."),
 7: ('east', 'The High Dome', "The tallest free-standing dome on the eastern side: 230 metres of granite rising clear of everything around it, eleven kilometres east of the summit. The 360-degree view is complete, taking in the massif, the escarpment and the Lotukei hills in one sweep. Properly remote, with no road for sixteen kilometres, which makes it an expedition camp or a helicopter lodge rather than a first build, but there is no better viewpoint on that side of the reserve."),
 8: ('central', 'The Dual-Zone Kopje', "A big, bold kopje 240 metres above the plain, exactly where the Kidepo flats meet the first rise of the hills and nine kilometres south-west of the summit. The view is perfect on every side and the game country below is the best in the reserve. It sits inside the part of Zulia that is also Kidepo Valley National Park, so it needs UWA as well as NFA, but for a partner already working with both it is an exceptional position."),
 9: ('central', 'The Southern Shoulder', "A gentler hill on the southern edge of the plateau, a kilometre and a half from a stream, with the plains opening to the south and the massif ten kilometres to the north. Less dramatic than its neighbours and easier for it: a workable slope, open ground, and a position that reads the whole southern half of the reserve. Well suited to a tented camp that moves with the seasons."),
 10: ('west', 'Himan Crest', "On the western rim above the town of Himan, a kilometre from the road and three from the river crossing. A steep little summit with a view back into the reserve and out across the Kaabong side. The closest site of all to the outside world, which makes it the natural place for a visitor centre, a community-facing camp or a trailhead lodge rather than the deep-wilderness product."),
 11: ('east', 'The Border Hill', "The lowest of the eastern sites at 1,270 metres, a kilometre from the Kenyan boundary and right on the lip of the escarpment. It looks down rather than across: into the Turkana basin and the dry lake country beyond. An extraordinary sunrise and a different landscape from everything else in the reserve. Remote, dry and best thought of as a seasonal or fly-camp site."),
 12: ('east', 'Plateau Rim', "A steep knoll nine kilometres east of the summit with a full-circle view, where the central plateau begins to tilt east. Water is four kilometres away, which counts against it for a permanent lodge, but as a walking-safari night stop on a route from the summit to the escarpment it is close to ideal."),
 13: ('east', 'The Boundary Spring', "A low hill tucked hard against the eastern boundary with a stream and a river both within 750 metres: the best-watered of the eastern sites. Lower and more sheltered than the escarpment tops, a place for a permanent camp that serves the whole eastern circuit."),
 14: ('central', 'The Southern Buttress', "Seven kilometres south of the summit, a granite buttress on the mountain's southern flank with the plateau in front and the peak behind. Steep, but sited for the long views and the cool nights of the high ground."),
 15: ('central', 'The Plateau Camp', "Open ground on the southern plateau with a stream 650 metres away and a comfortable slope. Not the highest view, but a practical lodge site in the middle of the game country."),
 16: ('central', 'The Southern Dome', "The southernmost of the plateau domes, five kilometres from the Kidepo River, with the plains on three sides. The view south across the park is uninterrupted."),
 17: ('west', 'The Himan Terrace', "A lower shoulder above the Himan River on the western side, a kilometre and a half from the road. Sheltered, easy to reach and well-watered; an alternative to the Gateway Hill for the mid-range camp."),
 18: ('west', 'The Town Kopje', "A kopje immediately above Himan with the road at its foot: the most accessible site in the reserve, suited to community-run accommodation, a ranger base or a day-visitor facility."),
 19: ('east', 'The Eastern Shoulder', "A high shoulder ten kilometres east of the summit, with a near-complete horizon. Dry and remote; a walking-route night stop rather than a lodge."),
 20: ('east', 'The South-East Hill', "A hill in the far south-east corner above the Loliboch stream, with the escarpment and the Kenyan hills close. The deepest wilderness position in the reserve."),
 21: ('east', 'The Lotukei Dome', "A tall dome on the eastern side with 240 metres of relief and a stream close below. Steep and remote, with a spectacular eastern view."),
 22: ('central', 'The Western Plateau', "A rise on the plateau seven kilometres south-west of the summit, open on most sides, with the Himan headwaters nearby. A good intermediate camp between the western foothills and the high ground."),
 23: ('east', 'The Escarpment Prow', "The most dramatic drop in the whole reserve: 540 metres straight down into Kenya from a prow of granite. It sits on the boundary line itself and would need careful survey, but as a viewpoint it has no equal."),
 24: ('east', 'The Eastern Terrace', "A terrace on the escarpment side with the Loliboch stream two kilometres away and a long drop to the east. A quieter alternative to the dome sites nearby."),
 25: ('central', 'The Plains Kopje', "A modest kopje at the edge of the plains inside the dual-management zone, close to the Kidepo River's tributaries. Low, warm and in the heart of the dry-season game concentration."),
 26: ('massif', 'The North Face', "On the northern side of the massif, four and a half kilometres from the summit, looking north over the Lolabo River into South Sudan. A different, wilder aspect of the mountain, with the Didinga hills on the skyline."),
 27: ('massif', 'The Lolabo Foot', "At the northern foot of the mountain near the Lolabo River and the track from the north. Low and accessible, suited to a base camp for the northern ascent of Mount Zulia."),
 28: ('massif', 'The Eastern Spur', "A spur on the east side of the massif with the summit close above and a 570-metre fall to the east. A mountain-walkers' night stop on the summit circuit."),
 29: ('east', 'The Lotukei Ridge', "A steep ridge on the eastern side with a wide horizon and deep valleys on either hand. For the fit and the adventurous."),
 30: ('massif', 'The Summit Approach', "On the summit ridge itself at 2,120 metres, a kilometre east of the top. Where the summit trail arrives at the sky; a place for a shelter rather than a lodge."),
}

# ---------------- mini maps ----------------
def deg_to_xy(lon, lat, cx, cy, half_km, size):
    kx = half_km / 111.0 / math.cos(math.radians(cy)); ky = half_km / 111.0
    return (size / 2 + (lon - cx) / kx * size / 2, size / 2 - (lat - cy) / ky * size / 2)

def minimap(s, idx, size=300, half_km=3.5):
    cx, cy = s['lon'], s['lat']
    box = Polygon([(cx - 0.06, cy - 0.06), (cx + 0.06, cy - 0.06), (cx + 0.06, cy + 0.06), (cx - 0.06, cy + 0.06)])
    P = lambda lon, lat: deg_to_xy(lon, lat, cx, cy, half_km, size)
    def path(coords): return 'M' + ' L'.join('%.1f,%.1f' % P(x, y) for x, y in coords)
    out = [f'<svg viewBox="0 0 {size} {size}" width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">',
           f'<rect width="{size}" height="{size}" fill="#1f1d1a"/>']
    for g, fill, stroke, dash in [(KIDEPO, '#c9bf8a', '#c9bf8a', '6 4'), (OVERLAP, '#a0c8e0', 'none', ''), (ZULIA, '#ef8a3c', '#ef8a3c', '')]:
        if g.intersects(box):
            fo = {'#c9bf8a': .12, '#a0c8e0': .14, '#ef8a3c': .1}[fill]
            out.append(f'<path d="{path(g.exterior.coords)}" fill="{fill}" fill-opacity="{fo}" stroke="{stroke}" stroke-width="{2 if fill == "#ef8a3c" else 1}" stroke-dasharray="{dash}"/>')
    labels = []
    for k, t, pts in feats:
        g = LineString(pts) if len(pts) > 1 else Point(pts[0])
        if not g.intersects(box): continue
        name = t.get('name')
        if name and ('N.p' in name or 'possibly' in name): name = None
        if name == 'KHiman': name = 'Himan'
        if 'waterway' in t:
            out.append(f'<path d="{path(pts)}" fill="none" stroke="{"#6fb7e0" if t["waterway"] == "river" else "#4f8fb0"}" stroke-width="{2 if t["waterway"] == "river" else .9}" stroke-linejoin="round"/>')
            if name and t['waterway'] == 'river': labels.append((pts[len(pts) // 2], name, '#6fb7e0'))
        elif 'highway' in t:
            h = t['highway']; col = '#f0c070' if h in ('primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'service') else '#c9a070'
            out.append(f'<path d="{path(pts)}" fill="none" stroke="{col}" stroke-width="{1.6 if col == "#f0c070" else 1.1}" stroke-dasharray="{"" if h != "path" else "2 3"}"/>')
        elif t.get('natural') == 'peak':
            x, y = P(*pts[0]); out.append(f'<path d="M{x:.1f},{y - 5:.1f}L{x + 4.5:.1f},{y + 3.5:.1f}L{x - 4.5:.1f},{y + 3.5:.1f}Z" fill="#f4efe6" opacity=".9"/>')
            if name: labels.append((pts[0], name.replace('Mount Lotholia', 'Mount Zulia'), '#f4efe6'))
        elif t.get('place') in ('town', 'village') and name:
            x, y = P(*pts[0]); out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="#e9e1d2" opacity=".8"/>'); labels.append((pts[0], name, '#e9e1d2'))
    seen = set()
    for (lon, lat), name, col in labels:
        if name in seen: continue
        seen.add(name); x, y = P(lon, lat)
        if 6 < x < size - 6 and 6 < y < size - 6:
            out.append(f'<text x="{x + 6:.1f}" y="{y + 4:.1f}" font-family="Albert Sans" font-size="9" fill="{col}" opacity=".85" style="paint-order:stroke" stroke="#1f1d1a" stroke-width="2.5">{html.escape(name)}</text>')
    # other sites nearby
    for j, o in enumerate(sites):
        if j == idx: continue
        x, y = P(o['lon'], o['lat'])
        if 0 < x < size and 0 < y < size:
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="#f6d9c2" opacity=".7"/><text x="{x + 6:.1f}" y="{y + 3:.1f}" font-family="Albert Sans" font-size="8" fill="#f6d9c2">{j + 1}</text>')
    x, y = size / 2, size / 2
    out.append(f'<circle cx="{x}" cy="{y}" r="14" fill="none" stroke="#ef8a3c" stroke-width="1" opacity=".6"/><circle cx="{x}" cy="{y}" r="7" fill="#ef8a3c" stroke="#1f1d1a" stroke-width="1.5"/>')
    # scale 1 km
    km = size / 2 / half_km
    out.append(f'<rect x="{size - 14 - km:.1f}" y="{size - 16}" width="{km:.1f}" height="3" fill="#f4efe6" opacity=".8"/><text x="{size - 14:.1f}" y="{size - 20}" text-anchor="end" font-family="Albert Sans" font-size="8" fill="#f4efe6" opacity=".7">1 km</text>')
    # north
    out.append(f'<text x="12" y="18" font-family="Albert Sans" font-size="9" fill="#f4efe6" opacity=".7">N ↑</text>')
    out.append('</svg>')
    return '\n'.join(out)

def overview(width=720, height=640):
    xs = [33.78, 34.16]; ys = [3.88, 4.25]
    def P(lon, lat): return ((lon - xs[0]) / (xs[1] - xs[0]) * width, (ys[1] - lat) / (ys[1] - ys[0]) * height)
    def path(coords): return 'M' + ' L'.join('%.1f,%.1f' % P(x, y) for x, y in coords)
    out = [f'<svg viewBox="0 0 {width} {height}" width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg"><rect width="{width}" height="{height}" fill="#1f1d1a"/>']
    out.append(f'<path d="{path(KIDEPO.exterior.coords)}" fill="#c9bf8a" fill-opacity=".12" stroke="#c9bf8a" stroke-width="1" stroke-dasharray="6 4"/>')
    out.append(f'<path d="{path(OVERLAP.exterior.coords)}" fill="#a0c8e0" fill-opacity=".14"/>')
    out.append(f'<path d="{path(ZULIA.exterior.coords)}" fill="#ef8a3c" fill-opacity=".1" stroke="#ef8a3c" stroke-width="2"/>')
    for k, t, pts in feats:
        if len(pts) < 2: continue
        if 'waterway' in t: out.append(f'<path d="{path(pts)}" fill="none" stroke="{"#6fb7e0" if t["waterway"] == "river" else "#4f8fb0"}" stroke-width="{1.4 if t["waterway"] == "river" else .5}"/>')
        elif 'highway' in t and t['highway'] != 'path': out.append(f'<path d="{path(pts)}" fill="none" stroke="#f0c070" stroke-width="{1.4 if t["highway"] in ("primary", "secondary") else .8}"/>')
    x, y = P(*SUMMIT); out.append(f'<path d="M{x:.1f},{y - 8:.1f}L{x + 7:.1f},{y + 5:.1f}L{x - 7:.1f},{y + 5:.1f}Z" fill="#ef8a3c"/><text x="{x + 11:.1f}" y="{y + 4:.1f}" font-family="Albert Sans" font-size="11" fill="#f4efe6">Mount Zulia 2,149 m</text>')
    for i, s in enumerate(sites):
        x, y = P(s['lon'], s['lat']); top = i < 5; mid = i < 12
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{8 if top else 6 if mid else 4.5}" fill="{"#ef8a3c" if top else "#f6d9c2" if mid else "#9fd27a"}" stroke="#1f1d1a" stroke-width="1.2"/>')
        out.append(f'<text x="{x + (10 if mid else 7):.1f}" y="{y + 4:.1f}" font-family="Albert Sans" font-size="{11 if mid else 9}" font-weight="600" fill="{"#f6d9c2" if mid else "#9fd27a"}" style="paint-order:stroke" stroke="#1f1d1a" stroke-width="2.5">{i + 1}</text>')
    for lon, lat, name in [(33.87, 4.095, 'Himan'), (33.80, 3.93, 'KIDEPO VALLEY NP'), (34.12, 4.2, 'KENYA'), (33.83, 4.22, 'SOUTH SUDAN')]:
        x, y = P(lon, lat); out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-family="Albert Sans" font-size="10" letter-spacing="1" fill="#f4efe6" opacity=".55">{name}</text>')
    km10 = 10 / 111 / (xs[1] - xs[0]) * width
    out.append(f'<rect x="{width - 20 - km10:.1f}" y="{height - 22}" width="{km10:.1f}" height="3" fill="#f4efe6" opacity=".8"/><text x="{width - 20:.1f}" y="{height - 27}" text-anchor="end" font-family="Albert Sans" font-size="9" fill="#f4efe6" opacity=".7">10 km</text>')
    out.append('</svg>'); return '\n'.join(out)

# ---------------- document ----------------
def km(m): return f'{m / 1000:.1f} km'
def card(i, s, full=True):
    n = i + 1; zone, title, text = SITES[n]
    tier = 'A' if n <= 5 else 'B' if n <= 12 else 'C'
    facts = [('Elevation', f"{s['elev']} m"), ('Rises above surroundings', f"{s['relief']} m"), ('Drop to valley floor', f"{s['drop']} m"),
             ('Open horizon', f"{s['open']}%"), ('Nearest water', km(min(s['d_river'], s['d_stream']))), ('Nearest road or track', km(s['d_road'])),
             ('From the summit', km(s['d_summit'])), ('From the boundary', km(s['d_boundary']))]
    flag = '<span class="flag">Dual-management zone · UWA and NFA</span>' if s['overlap'] else ''
    coords = f"{s['lat']:.4f}° N, {s['lon']:.4f}° E"
    return f'''<article class="site tier-{tier} {'full' if full else 'brief'}">
  <div class="map">{minimap(s, i, 200 if full else 120, 3.5 if full else 3)}</div>
  <div class="body">
    <div class="eyebrow"><span class="num">Site {n:02d}</span> · {ZONES[zone][0]} {flag}</div>
    <h3>{html.escape(title)}</h3>
    <p class="coords">{coords}</p>
    <p class="text">{html.escape(text)}</p>
    <dl class="facts">{''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in (facts if full else facts[:4]))}</dl>
  </div>
</article>'''

zones_html = ''.join(f'<div class="zone"><h4>{v[0]}</h4><p>{v[1]}</p><p class="zone-sites">Sites {", ".join(str(k) for k, (z, _, _) in SITES.items() if z == key)}</p></div>' for key, v in ZONES.items())
cards_full = ''.join(card(i, s, True) for i, s in enumerate(sites[:12]))
cards_brief = ''.join(card(i, s, False) for i, s in enumerate(sites[12:], 12))

doc = f'''<!doctype html><html><head><meta charset="utf-8"><title>Zulia — Thirty places to wake up</title>
<style>
{FONTS}
:root{{--granite:#2a2824;--kopje:#8a6a4b;--olive:#8f8a57;--palm:#35503a;--sand:#e9e1d2;--bone:#f4efe6;--ink:#1c1b18;--dawn:#ef8a3c;--ember:#c75f27}}
@page{{size:A4;margin:0}}
@page flow{{size:A4;margin:16mm 0 14mm}}
html{{background:#f4efe6}}
.flow{{page:flow}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:'Albert Sans',system-ui,sans-serif;color:var(--ink);background:var(--bone);font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
h1,h2,h3,h4,.display{{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;letter-spacing:-.01em;line-height:1.05;margin:0}}
.page{{width:210mm;min-height:297mm;padding:18mm 16mm 16mm;position:relative;page-break-after:always;overflow:hidden}}
.page:last-child{{page-break-after:auto}}
.contours{{position:absolute;inset:0;background:url(data:image/svg+xml;base64,{CONTOURS}) center/1400px auto;opacity:.28;pointer-events:none}}
.dark{{background:var(--granite);color:var(--bone)}}
.dark .contours{{opacity:.35}}
.rel{{position:relative}}
.brand{{display:flex;align-items:center;gap:10px}}
.brand svg{{width:38px;height:38px}}
.brand .name{{font-family:'Bodoni Moda';font-size:17pt;line-height:1}}
.brand .sub{{font-size:7pt;letter-spacing:.14em;opacity:.7;display:block;margin-top:2px}}
.cover{{display:flex;flex-direction:column;justify-content:space-between}}
.cover h1{{font-size:54pt;max-width:150mm;margin-top:38mm}}
.cover .lede{{font-size:13pt;max-width:120mm;margin-top:10mm;color:rgba(244,239,230,.85)}}
.cover .meta{{font-size:9pt;color:rgba(244,239,230,.6)}}
.glow{{position:absolute;left:-20%;right:-20%;bottom:-10%;height:55%;background:radial-gradient(ellipse at 50% 100%,rgba(239,138,60,.35),transparent 60%);pointer-events:none}}
.eyebrow{{font-size:8pt;letter-spacing:.16em;text-transform:uppercase;color:var(--kopje)}}
.dark .eyebrow{{color:var(--dawn)}}
h2{{font-size:28pt;margin:4mm 0 5mm}}
.intro p{{max-width:150mm;font-size:11pt}}
.two{{columns:2;column-gap:10mm}}
.zone{{break-inside:avoid;margin-bottom:6mm}}
.zone h4{{font-size:15pt;margin-bottom:2mm}}
.zone p{{margin:0 0 1.5mm}}
.zone-sites{{font-size:8.5pt;color:var(--kopje);letter-spacing:.04em}}
.legend{{display:flex;gap:6mm;font-size:8.5pt;margin-top:3mm;color:rgba(244,239,230,.8)}}
.legend i{{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px}}
.site{{display:grid;grid-template-columns:200px 1fr;gap:6mm;align-items:start;break-inside:avoid;padding:4mm 0;border-top:1px solid rgba(28,27,24,.15)}}
.site.brief{{grid-template-columns:120px 1fr;padding:3mm 0;gap:5mm}}
.site .map svg{{display:block;border-radius:2px}}
.site h3{{font-size:18pt;margin:.5mm 0 .5mm}}
.site.brief h3{{font-size:15pt}}
.site .num{{font-weight:600;color:var(--ember)}}
.coords{{font-size:8.5pt;color:var(--kopje);margin:0 0 2.5mm;letter-spacing:.03em}}
.text{{margin:0 0 2mm;color:rgba(28,27,24,.85);font-size:9.5pt;line-height:1.45}}
.site.brief .text{{font-size:9.5pt;margin-bottom:2mm}}
.facts{{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5mm 4mm;margin:0;font-size:7.5pt;line-height:1.3}}
.site.brief .facts{{grid-template-columns:repeat(4,1fr)}}
.facts dt{{color:var(--kopje);letter-spacing:.02em}}
.facts dd{{margin:0;font-family:'Bodoni Moda';font-size:12pt;line-height:1.1}}
.site.brief .facts dd{{font-size:11pt}}
.flag{{display:inline-block;margin-left:3mm;padding:1px 7px;border:1px solid var(--dawn);border-radius:999px;color:var(--ember);font-size:7pt;letter-spacing:.08em}}
.foot{{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;justify-content:space-between;font-size:7.5pt;color:rgba(28,27,24,.55)}}
.dark .foot{{color:rgba(244,239,230,.5)}}
.method{{font-size:9.5pt;max-width:160mm}}
.method li{{margin-bottom:1.5mm}}
.tiers{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6mm;margin:6mm 0}}
.tier{{border-top:2px solid var(--dawn);padding-top:3mm}}
.tier b{{font-family:'Bodoni Moda';font-weight:400;font-size:18pt;display:block}}
</style></head><body>

<section class="page dark cover"><div class="contours"></div><div class="glow"></div>
  <div class="rel brand">{MARK_LIGHT}<span><span class="name">Zulia Conservancy</span><span class="sub">UGANDA</span></span></div>
  <div class="rel"><div class="eyebrow">Lodge sites · desk study · October 2026</div>
    <h1>Thirty places to wake up</h1>
    <p class="lede">A ranked shortlist of hilltops, bluffs and kopjes across the Zulia reserve where a lodge or camp could stand, chosen for the view, the water and the ground, and written for the people who will build them.</p></div>
  <div class="rel meta">Zulia Conservancy (Uganda) Limited · NFA Licence No. 30 · zuliaconservancy.org · Confidential: for prospective partners</div>
</section>

<section class="page"><div class="contours"></div>
  <div class="rel intro">
    <div class="eyebrow">How to read this</div>
    <h2>Chosen for the morning view</h2>
    <p>Every site in this document was found the same way. We took the 30-metre terrain model of the whole reserve, found every hill that stands clear of its surroundings, and scored each one for what a guest will feel standing on it at first light: how much of the horizon is open, how far the eye can travel, how high the ground rises above the valley. Then we asked the practical questions: can you build on the top, how far is water, how far is a track, and is the site inside the part of the reserve that is also Kidepo Valley National Park.</p>
    <p>The numbers are a ranking of viewpoints, not a build order. Site 1 is the finest place to stand in the Kidepo landscape; Site 5 is probably the first lodge. The two are nine kilometres apart and belong to the same plan.</p>
    <div class="tiers">
      <div class="tier"><b>Sites 1–5</b>The flagship positions. Exceptional in every direction; each one a reason to come.</div>
      <div class="tier"><b>Sites 6–12</b>Strong lodge and camp sites, several of them better first builds than the top five.</div>
      <div class="tier"><b>Sites 13–30</b>Night stops, fly-camps, trailheads and alternatives, listed so that nothing is lost.</div>
    </div>
    <div class="eyebrow">Four landscapes</div>
    <div class="two" style="margin-top:3mm">{zones_html}</div>
    <p class="method" style="margin-top:4mm"><i>All positions are desk-based, from terrain data and OpenStreetMap, on the NFA 2021 boundary. Every one needs ground-truthing, a water assessment and agreement with NFA (and UWA where marked) before anything is pegged. Coordinates are WGS 84.</i></p>
  </div>
  <div class="foot"><span>Zulia Conservancy · Lodge sites</span><span>2</span></div>
</section>

<section class="page dark"><div class="contours"></div>
  <div class="rel"><div class="eyebrow">The shortlist</div><h2>Where they are</h2>
  <div style="margin-top:4mm">{overview()}</div>
  <div class="legend"><span><i style="background:#ef8a3c"></i>Sites 1–5</span><span><i style="background:#f6d9c2"></i>Sites 6–12</span><span><i style="background:#9fd27a"></i>Sites 13–30</span><span><i style="background:#6fb7e0"></i>Rivers and streams</span><span><i style="background:#f0c070"></i>Roads and tracks</span><span><i style="background:#a0c8e0;opacity:.6"></i>Dual-management zone</span></div>
  </div>
  <div class="foot"><span>Zulia Conservancy · Lodge sites</span><span>3</span></div>
</section>

<section class="page flow" style="min-height:0;page-break-after:auto;padding-top:0"><div class="contours"></div>
  <div class="rel"><div class="eyebrow">Sites 1–12</div><h2>The places themselves</h2>
  {cards_full}
  <div class="eyebrow" style="margin-top:10mm">Sites 13–30</div><h2>The rest of the shortlist</h2>
  {cards_brief}
  <p class="method" style="margin-top:8mm"><b>Method.</b> Terrain: AWS Terrain Tiles (SRTM/NASADEM class, ~30 m). Candidates: local maxima with at least 60 m of relief within 1 km. Score = 0.6 × openness (share of 36 compass directions with a clear line of sight beyond 3 km) + 0.6 × mean horizon distance (as % of 10 km) + relief (capped at 150 m) ÷ 1.5, less penalties for summit slope over 20%, river more than 2.5 km away, and proximity to the boundary; 1.2 km minimum separation between sites. Features from OpenStreetMap (© OpenStreetMap contributors, ODbL). Boundary: NFA 2021 via WDPA 40604.</p>
  </div>
</section>
</body></html>'''
open(f'{OUT}/sites.html', 'w').write(doc)
print('html', len(doc))
