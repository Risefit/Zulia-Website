"""Zulia Conservancy document brand: fonts, mark, vector contour backdrop and base CSS (shared by all generated PDFs)."""
import base64, html, re as _re, os
ROOT = '/home/claude/zulia-website'
OUT = '/home/claude/zulia-maps/out'; os.makedirs(OUT, exist_ok=True)

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
import re as _re
_c = open(f'{ROOT}/public/contours.svg').read()
CONTOUR_PATHS = _re.search(r'<g[^>]*>(.*)</g>', _c, _re.S).group(1)
_cid=[0]
def _blend(bg, fg, a):
    bg=[int(bg[i:i+2],16) for i in (1,3,5)]; fg=[int(fg[i:i+2],16) for i in (1,3,5)]
    return '#%02x%02x%02x' % tuple(round(bg[i]*(1-a)+fg[i]*a) for i in range(3))
def contour_bg(dark=False):
    """Vector contour backdrop. No patterns, masks or group opacity (macOS Preview rasterises those):
    the contour path is drawn directly, clipped into horizontal bands whose stroke colour is pre-blended
    to fade down the page, as on the website."""
    _cid[0]+=1; u=_cid[0]
    bg = '#2a2824' if dark else '#f4efe6'; fg = '#f4efe6' if dark else '#8a6a4b'; top = 0.16 if dark else 0.26
    W_, H_ = 793.7, 1122.5; scale = 1400/1200; th = 700*scale
    bands = 8; out=[f'<svg class="contours" xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 {W_} {H_}" preserveAspectRatio="none"><defs>']
    for i in range(bands):
        out.append(f'<clipPath id="b{u}_{i}"><rect x="0" y="{H_*i/bands:.2f}" width="{W_}" height="{H_/bands+0.5:.2f}"/></clipPath>')
    out.append(f'<g id="cpath{u}">{CONTOUR_PATHS}</g></defs>')
    for i in range(bands):
        f = (i+0.5)/bands; alpha = top * (1.0 if f < 0.1 else max(0.0, 1 - (f-0.1)/0.9)) ** 1.1
        col = _blend(bg, fg, alpha)
        if alpha < 0.01: continue
        out.append(f'<g clip-path="url(#b{u}_{i})" fill="none" stroke="{col}" stroke-width="0.7" stroke-linejoin="round">')
        y0, y1 = H_*i/bands, H_*(i+1)/bands
        for ty in (0, th):
            if ty > y1 or ty + th < y0: continue
            out.append(f'<use href="#cpath{u}" transform="translate(0,{ty:.2f}) scale({scale:.5f})"/>')
        out.append('</g>')
    out.append('</svg>'); return ''.join(out)
MARK = open(f'{ROOT}/public/mark.svg').read()
MARK_LIGHT = open(f'{ROOT}/public/mark-light.svg').read()


BASE_CSS = r'''
{FONTS}
:root{--granite:#2a2824;--kopje:#8a6a4b;--olive:#8f8a57;--palm:#35503a;--sand:#e9e1d2;--bone:#f4efe6;--ink:#1c1b18;--dawn:#ef8a3c;--ember:#c75f27}
@page{size:A4;margin:0}

*{box-sizing:border-box}
body{margin:0;font-family:'Albert Sans',system-ui,sans-serif;color:var(--ink);background:var(--bone);font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,h4,.display{font-family:'Bodoni Moda',Georgia,serif;font-weight:400;letter-spacing:-.01em;line-height:1.05;margin:0}
.page{width:210mm;min-height:297mm;padding:18mm 16mm 16mm;position:relative;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:auto}
.contours{position:absolute;left:0;top:0;width:210mm;height:297mm;pointer-events:none}
.dark{background:var(--granite);color:var(--bone)}
.rel{position:relative}

.brand{display:flex;align-items:center;gap:10px}
.brand svg{width:38px;height:38px}
.brand .name{font-family:'Bodoni Moda';font-size:17pt;line-height:1}
.brand .sub{font-size:7pt;letter-spacing:.14em;opacity:.7;display:block;margin-top:2px}
.cover{display:flex;flex-direction:column;justify-content:space-between}
.cover h1{font-size:54pt;max-width:150mm;margin-top:38mm}
.cover .lede{font-size:13pt;max-width:120mm;margin-top:10mm;color:rgba(244,239,230,.85)}
.cover .meta{font-size:9pt;color:rgba(244,239,230,.6)}
.glow{position:absolute;left:-20%;right:-20%;bottom:-10%;height:55%;background:radial-gradient(ellipse at 50% 100%,rgba(239,138,60,.35),transparent 60%);pointer-events:none}
.eyebrow{font-size:8pt;letter-spacing:.16em;text-transform:uppercase;color:var(--kopje)}
.dark .eyebrow{color:var(--dawn)}
h2{font-size:28pt;margin:4mm 0 5mm}
.intro p{max-width:150mm;font-size:11pt}
.two{columns:2;column-gap:10mm}
.zone{break-inside:avoid;margin-bottom:6mm}
.zone h4{font-size:15pt;margin-bottom:2mm}
.zone p{margin:0 0 1.5mm}
.zone-sites{font-size:8.5pt;color:var(--kopje);letter-spacing:.04em}
.legend{display:flex;gap:6mm;font-size:8.5pt;margin-top:3mm;color:rgba(244,239,230,.8)}
.legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px}
.site:first-child{border-top:none}
.site{display:grid;grid-template-columns:200px 1fr;gap:6mm;align-items:start;break-inside:avoid;padding:4mm 0;border-top:1px solid rgba(28,27,24,.15)}
.site.brief{grid-template-columns:120px 1fr;padding:3mm 0;gap:5mm}
.site .map svg{display:block;border-radius:2px}
.site h3{font-size:18pt;margin:.5mm 0 .5mm}
.site.brief h3{font-size:15pt}
.site .num{font-weight:600;color:var(--ember)}
.coords{font-size:8.5pt;color:var(--kopje);margin:0 0 2.5mm;letter-spacing:.03em}
.text{margin:0 0 2mm;color:rgba(28,27,24,.85);font-size:9.5pt;line-height:1.45}
.site.brief .text{font-size:9.5pt;margin-bottom:2mm}
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5mm 4mm;margin:0;font-size:7.5pt;line-height:1.3}
.site.brief .facts{grid-template-columns:repeat(4,1fr)}
.facts dt{color:var(--kopje);letter-spacing:.02em}
.facts dd{margin:0;font-family:'Bodoni Moda';font-size:12pt;line-height:1.1}
.site.brief .facts dd{font-size:11pt}
.flag{display:inline-block;margin-left:3mm;padding:1px 7px;border:1px solid var(--dawn);border-radius:999px;color:var(--ember);font-size:7pt;letter-spacing:.08em}
.foot{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;justify-content:space-between;font-size:7.5pt;color:rgba(28,27,24,.55)}
.dark .foot{color:rgba(244,239,230,.5)}
.method{font-size:9.5pt;max-width:160mm}
.method li{margin-bottom:1.5mm}
.tiers{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6mm;margin:6mm 0}
.tier{border-top:2px solid var(--dawn);padding-top:3mm}
.tier b{font-family:'Bodoni Moda';font-weight:400;font-size:18pt;display:block}
'''

def brand_header(dark=True):
    return f'<div class="rel brand">{MARK_LIGHT if dark else MARK}<span><span class="name">Zulia Conservancy</span><span class="sub">UGANDA</span></span></div>'
def page(inner, n, dark=False, footer='Zulia Conservancy'):
    return f'<section class="page{" dark" if dark else ""}">{contour_bg(dark)}<div class="rel">{inner}</div><div class="foot"><span>{footer}</span><span>{n}</span></div></section>'
def img_b64(path):
    ext = os.path.splitext(path)[1].lower().strip('.'); mime = 'jpeg' if ext in ('jpg','jpeg') else ext
    return f'data:image/{mime};base64,' + base64.b64encode(open(path,'rb').read()).decode()
