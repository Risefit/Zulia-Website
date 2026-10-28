import json, math, zipfile, re, os
from shapely.geometry import Polygon, Point, LineString, shape
from shapely.ops import nearest_points
import pyproj
from shapely.ops import transform as stransform

feats = json.load(open('osm.json'))
cands = json.load(open('zulia_candidates.json'))
zul = json.load(open('/home/claude/zulia-website/public/geo/zulia.json'))
def poly(name):
    f = next(f for f in zul['features'] if f['properties']['name'].startswith(name))
    return Polygon(f['geometry']['coordinates'][0])
ZULIA, OVERLAP, KIDEPO = poly('Zulia Central'), poly('Dual'), poly('Kidepo Valley')
summit = next(f for f in zul['features'] if f['properties']['name'].startswith('Mount'))['geometry']['coordinates']
to_m = pyproj.Transformer.from_crs('EPSG:4326', 'EPSG:32636', always_xy=True).transform
ZM = stransform(to_m, ZULIA)

def esc(s): return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def coords(pts): return ' '.join(f'{x:.5f},{y:.5f},0' for x, y in pts)

# ---------- styles ----------
styles = {
 'road_primary': ('ff2a6bd1', 4.0), 'road_secondary': ('ff3a8ae6', 3.2), 'road_minor': ('ff7fb3f0', 2.4),
 'track': ('ff3c8ef0', 2.4), 'path': ('ff4fd0ff', 1.8),
 'river': ('ffd6a24c', 3.0), 'stream': ('ffe0b77a', 1.6),
 'ridge': ('ff6a6aa0', 1.6), 'cliff': ('ff3030c0', 2.2),
 'boundary_adm': ('ff8f8f8f', 1.2), 'boundary_pa': ('ff40a040', 2.0),
 'zulia': ('ff3c8aef', 3.0, '4056c84a'), 'overlap': ('ff8ac0e0', 1.5, '50a0d0f0'), 'kidepo': ('ffc9bf8a', 1.5, '2080a0a0'),
 'contour': ('80a8a8a8', 0.8), 'contour100': ('c0808080', 1.3),
}
def style_xml():
    out = []
    for k, v in styles.items():
        col, w = v[0], v[1]
        extra = f'<PolyStyle><color>{v[2]}</color></PolyStyle>' if len(v) > 2 else ''
        dash = ''
        out.append(f'<Style id="{k}"><LineStyle><color>{col}</color><width>{w}</width></LineStyle>{extra}</Style>')
    icons = {
     'peak': ('http://maps.google.com/mapfiles/kml/shapes/triangle.png', 'ffffffff', 0.9),
     'village': ('http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png', 'ff9fc7ff', 0.7),
     'town': ('http://maps.google.com/mapfiles/kml/shapes/placemark_square.png', 'ff9fc7ff', 0.9),
     'spring': ('http://maps.google.com/mapfiles/kml/shapes/water.png', 'ffffd080', 0.9),
     'cave': ('http://maps.google.com/mapfiles/kml/shapes/caution.png', 'ffffffff', 0.8),
     'poi': ('http://maps.google.com/mapfiles/kml/shapes/info-i.png', 'ffffffff', 0.8),
     'summit': ('http://maps.google.com/mapfiles/kml/shapes/triangle.png', 'ff3c8aef', 1.3),
     'siteA': ('http://maps.google.com/mapfiles/kml/paddle/A.png', 'ffffffff', 1.3),
     'siteB': ('http://maps.google.com/mapfiles/kml/paddle/B.png', 'ffffffff', 1.1),
     'siteC': ('http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png', 'ff3c8aef', 0.9),
     'airstrip': ('http://maps.google.com/mapfiles/kml/shapes/airports.png', 'ffffffff', 1.0),
    }
    for k, (href, col, sc) in icons.items():
        out.append(f'<Style id="{k}"><IconStyle><color>{col}</color><scale>{sc}</scale><Icon><href>{href}</href></Icon></IconStyle><LabelStyle><scale>0.8</scale></LabelStyle></Style>')
    return '\n'.join(out)

def pm_line(name, pts, style, desc=''):
    return f'<Placemark><name>{esc(name)}</name><description><![CDATA[{desc}]]></description><styleUrl>#{style}</styleUrl><LineString><tessellate>1</tessellate><coordinates>{coords(pts)}</coordinates></LineString></Placemark>'
def pm_poly(name, pts, style, desc=''):
    return f'<Placemark><name>{esc(name)}</name><description><![CDATA[{desc}]]></description><styleUrl>#{style}</styleUrl><Polygon><tessellate>1</tessellate><outerBoundaryIs><LinearRing><coordinates>{coords(pts)}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>'
def pm_pt(name, lon, lat, style, desc=''):
    return f'<Placemark><name>{esc(name)}</name><description><![CDATA[{desc}]]></description><styleUrl>#{style}</styleUrl><Point><coordinates>{lon:.5f},{lat:.5f},0</coordinates></Point></Placemark>'
def folder(name, items, open_=0, visible=1, desc=''):
    return f'<Folder><name>{esc(name)}</name><open>{open_}</open><visibility>{visible}</visibility><description><![CDATA[{desc}]]></description>' + '\n'.join(items) + '</Folder>'

def tagdesc(t):
    return '<br/>'.join(f'{k}: {esc(v)}' for k, v in sorted(t.items()))

# ---------- classify OSM ----------
KEYS = ['roads', 'tracks', 'paths', 'rivers', 'streams', 'springs', 'peaks', 'ridges', 'settlements', 'landuse', 'admin', 'other']
F_IN = {k: [] for k in KEYS}; F_OUT = {k: [] for k in KEYS}
INSIDE = ZULIA.buffer(0.003)
class _F:
    def __getitem__(self, k): return F_IN[k] if _cur[0] else F_OUT[k]
F = _F(); _cur = [True]
waterlines = []
roadlines = []
for k, t, pts in feats:
    name = t.get('name', '')
    line = LineString(pts) if len(pts) > 1 else None
    if line is not None and not line.intersects(ZULIA.buffer(0.03)) and 'boundary' not in t:
        continue  # keep things near the reserve only
    geom = line if line is not None else Point(pts[0])
    _cur[0] = geom.intersects(INSIDE)
    if 'highway' in t:
        h = t['highway']
        if h in ('primary', 'trunk'): st, grp = 'road_primary', 'roads'
        elif h in ('secondary', 'tertiary'): st, grp = 'road_secondary', 'roads'
        elif h in ('unclassified', 'residential', 'service'): st, grp = 'road_minor', 'roads'
        elif h == 'track': st, grp = 'track', 'tracks'
        else: st, grp = 'path', 'paths'
        F[grp].append(pm_line(name or h, pts, st, tagdesc(t)))
        if grp in ('roads', 'tracks'): roadlines.append(line)
    elif 'waterway' in t:
        w = t['waterway']; inter = t.get('intermittent') == 'yes'
        if w == 'river': F['rivers'].append(pm_line(name or 'river' + (' (seasonal)' if inter else ''), pts, 'river', tagdesc(t)))
        else: F['streams'].append(pm_line(name or 'stream', pts, 'stream', tagdesc(t)))
        waterlines.append((w, line))
    elif 'natural' in t:
        n = t['natural']
        if n == 'peak': F['peaks'].append(pm_pt((name or 'peak') + (f" {t['ele']} m" if t.get('ele') else ''), *pts[0], 'peak', tagdesc(t)))
        elif n == 'spring': F['springs'].append(pm_pt(name or 'spring', *pts[0], 'spring', tagdesc(t)))
        elif n == 'ridge': F['ridges'].append(pm_line(name or 'ridge', pts, 'ridge', tagdesc(t)))
        elif n == 'cliff': F['ridges'].append(pm_line(name or 'cliff', pts, 'cliff', tagdesc(t)))
        elif n == 'cave_entrance': F['other'].append(pm_pt(name or 'cave', *pts[0], 'cave', tagdesc(t)))
        elif n in ('water', 'wetland'): F['springs'].append(pm_poly(name or n, pts, 'kidepo', tagdesc(t)) if len(pts) > 2 else pm_pt(name or n, *pts[0], 'spring'))
        elif len(pts) > 2: F['landuse'].append(pm_poly(name or n, pts, 'kidepo', tagdesc(t)))
        else: F['other'].append(pm_pt(name or n, *pts[0], 'poi', tagdesc(t)))
    elif 'place' in t:
        p = t['place']
        F['settlements'].append(pm_pt(name or p, *pts[0], 'town' if p == 'town' else 'village', tagdesc(t)))
    elif 'boundary' in t:
        if t['boundary'] == 'protected_area': F['admin'].append(pm_line(name or 'protected area', pts, 'boundary_pa', tagdesc(t)))
        else: F['admin'].append(pm_line(name or 'administrative boundary', pts, 'boundary_adm', tagdesc(t)))
    elif 'landuse' in t:
        if len(pts) > 2: F['landuse'].append(pm_poly((name or t['landuse']), pts, 'kidepo', tagdesc(t)))
    elif 'aeroway' in t:
        F['other'].append(pm_line(name or t['aeroway'], pts, 'road_primary', tagdesc(t)) if len(pts) > 1 else pm_pt(name or t['aeroway'], *pts[0], 'airstrip', tagdesc(t)))
    else:
        if len(pts) == 1: F['other'].append(pm_pt(name or 'poi', *pts[0], 'poi', tagdesc(t)))
        elif len(pts) > 2 and pts[0] == pts[-1]: F['landuse'].append(pm_poly(name or 'area', pts, 'kidepo', tagdesc(t)))
        else: F['other'].append(pm_line(name or 'feature', pts, 'ridge', tagdesc(t)))

# ---------- lodge candidates ----------
rivers_m = [stransform(to_m, l) for w, l in waterlines if w == 'river' and l is not None]
streams_m = [stransform(to_m, l) for w, l in waterlines if w != 'river' and l is not None]
roads_m = [stransform(to_m, l) for l in roadlines if l is not None]
def dmin(pt, lines): return min((l.distance(pt) for l in lines), default=9e9)
ranked = []
for c in cands:
    p = Point(c['lon'], c['lat'])
    if not ZULIA.buffer(0.002).contains(p): continue
    pm = stransform(to_m, p)
    dr, ds, drd = dmin(pm, rivers_m), dmin(pm, streams_m), dmin(pm, roads_m)
    inside_overlap = OVERLAP.contains(p)
    d_boundary = ZM.exterior.distance(pm)
    d_summit = stransform(to_m, Point(summit)).distance(pm)
    # buildability: summit slope measured over 60 m; 0–35% fine for a lodge on stilts/terraces
    slope_pen = 0 if c['slope'] <= 20 else (c['slope'] - 20) * 1.2
    water_pen = 0 if dr < 2500 else min(30, (dr - 2500) / 200)
    relief_score = min(c['relief'], 150) / 1.5
    score = c['open'] * 0.6 + c['horizon'] * 0.6 + relief_score - slope_pen - water_pen - (10 if d_boundary < 800 else 0)
    ranked.append(dict(c, d_river=round(dr), d_stream=round(ds), d_road=round(drd), d_boundary=round(d_boundary), d_summit=round(d_summit), overlap=inside_overlap, score=round(score, 1)))
ranked.sort(key=lambda r: -r['score'])
# min separation 1.2 km
chosen = []
for r in ranked:
    pm = stransform(to_m, Point(r['lon'], r['lat']))
    if all(pm.distance(stransform(to_m, Point(c['lon'], c['lat']))) > 1200 for c in chosen):
        chosen.append(r)
    if len(chosen) >= 30: break
site_items = []
for i, r in enumerate(chosen):
    rank = i + 1
    st = 'siteA' if rank <= 5 else 'siteB' if rank <= 12 else 'siteC'
    name = f"Site {rank:02d} · {r['elev']} m"
    desc = (f"<b>Rank {rank}</b> — score {r['score']}<br/>"
            f"Elevation {r['elev']} m · rises {r['relief']} m above 1 km surroundings, {r['drop']} m above the valley floor (1.5 km)<br/>"
            f"360° view: {r['open']}% of directions open beyond 3 km · mean horizon {r['horizon']}% of 10 km<br/>"
            f"Summit slope ≈ {r['slope']}% over 60 m<br/>"
            f"Nearest river {r['d_river']/1000:.1f} km · nearest stream {r['d_stream']/1000:.1f} km · nearest road/track {r['d_road']/1000:.1f} km<br/>"
            f"Reserve boundary {r['d_boundary']/1000:.1f} km · Mount Zulia summit {r['d_summit']/1000:.1f} km<br/>"
            f"{'<b>Inside the Kidepo NP dual-management zone — needs UWA as well as NFA</b>' if r['overlap'] else 'NFA-only zone'}<br/>"
            f"<i>Desk assessment from 30 m terrain data and OpenStreetMap. Verify on the ground.</i>")
    site_items.append(pm_pt(name, r['lon'], r['lat'], st, desc))
json.dump(chosen, open('lodge_sites.json', 'w'), indent=1)

# ---------- contours (if present) ----------
contour_items, contour100 = [], []
if os.path.exists('zulia_contours20.txt'):
    zb = ZULIA.buffer(0.01)
    for line in open('zulia_contours20.txt'):
        L, cs = line.rstrip('\n').split('|', 1)
        pts = []; x = y = 0
        if '.' in cs:
            pts = [tuple(map(float, c.split(','))) for c in cs.split(' ')]
        else:
            for i, c in enumerate(cs.split(' ')):
                a, b = map(int, c.split(','))
                if i == 0: x, y = a, b
                else: x += a; y += b
                pts.append((x / 1e5, y / 1e5))
        ls = LineString(pts)
        if not ls.intersects(zb): continue
        (contour100 if int(L) % 100 == 0 else contour_items).append(pm_line(f'{L} m', pts, 'contour100' if int(L) % 100 == 0 else 'contour'))

def feature_folders(D):
    names = [('roads','Roads'),('tracks','Tracks'),('paths','Footpaths'),('rivers','Rivers'),('streams','Streams (mostly seasonal)'),('springs','Springs and water'),('peaks','Peaks'),('ridges','Ridges and cliffs'),('settlements','Settlements'),('landuse','Land use and vegetation (OSM)'),('admin','Administrative and protected-area boundaries (OSM)'),('other','Other features')]
    return [folder(lbl, D[k], 0, 0 if k in ('landuse','admin') else 1) for k, lbl in names if D[k]]

# ---------- assemble ----------
bz = list(ZULIA.exterior.coords); bo = list(OVERLAP.exterior.coords); bk = list(KIDEPO.exterior.coords)
doc = f'''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
<name>Zulia Conservancy — concession and map layers</name>
<description><![CDATA[Zulia Central Forest Reserve, Kaabong. Layers built 28 Oct 2026 from OpenStreetMap (© OpenStreetMap contributors, ODbL) and AWS Terrain Tiles (SRTM/NASADEM-class, 30 m). Boundary: NFA 2021 via WDPA 40604. Toggle folders on and off in the Places panel. Lodge sites are a desk ranking, not a survey.]]></description>
<open>1</open>
{style_xml()}
{folder('Boundaries', [pm_poly('Zulia CFR — licensed area (925 km²)', bz, 'zulia'), pm_poly('Dual-management zone (inside Kidepo Valley NP, 410 km²)', bo, 'overlap'), pm_poly('Kidepo Valley National Park', bk, 'kidepo'), pm_pt('Mount Zulia (Lotholia) 2,149 m', summit[0], summit[1], 'summit'), pm_pt('Reserve centroid', 33.95012, 4.02613, 'poi', '4.026°N 33.950°E'), pm_pt('Apoka / Kidepo airstrip (HUKD)', 33.7483, 3.7183, 'airstrip', '23 km from the western boundary, 41 km from the centroid'), pm_pt('Kidepo International Airport (under construction, 2026)', 33.7425, 3.7383, 'airstrip', '3,600 m runway planned. 21 km from the reserve boundary, 39 km from the centroid.')], 1)}
{folder('Lodge site candidates (ranked)', site_items, 1, 1, 'Hilltops and bluffs ranked for 360° views, relief, buildable summit, proximity to the river and distance from the boundary. A = top five, B = 6–12, dots = 13–30. Click a pin for its figures.')}
{folder('Inside the reserve', feature_folders(F_IN), 1, 1, 'OpenStreetMap features that touch the licensed area.')}
{folder('Surroundings (outside the reserve)', feature_folders(F_OUT), 0, 1, 'Everything mapped around the reserve: Kaabong side villages, roads, the Kidepo valley. Untick this folder to simplify the view.')}
{folder('Contours 100 m', contour100, 0, 1) if contour100 else ''}
{folder('Contours 20 m', contour_items, 0, 0) if contour_items else ''}
</Document></kml>'''
open('Zulia_Maps.kml', 'w').write(doc)
with zipfile.ZipFile('Zulia_Maps.kmz', 'w', zipfile.ZIP_DEFLATED) as z: z.writestr('doc.kml', doc)
print('inside', {k: len(v) for k, v in F_IN.items()}, 'outside', {k: len(v) for k, v in F_OUT.items()}, 'sites', len(chosen), 'contours', len(contour_items), len(contour100))
for r in chosen[:12]: print(r)
