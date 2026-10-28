"""Zulia Conservancy — The living landscape: a desk review of the flora and fauna of Zulia and the Kidepo ecosystem."""
import sys, html
sys.path.insert(0, '/home/claude/zulia-maps')
from brand import *

MEDIA = f'{ROOT}/public/media'
UP = '/mnt/user-data/uploads/Zulia'
P = lambda f: img_b64(f'{MEDIA}/{f}')
U = lambda f: img_b64(f'{UP}/{f}')

# ---------------- figures ----------------
def veg_chart():
    rows = [('Dry Combretum savanna (N8, N10, N11, N12)', 586, 57, '#8f8a57'), ('Bushland (T2, T3, T6)', 138, 13, '#8a6a4b'), ('Chrysopogon grass steppe (S1)', 93, 9, '#c9bf8a'),
            ('Dry thicket (V3, V5 Acacia mellifera)', 78, 7.6, '#a08050'), ('Juniperus–Podocarpus dry montane forest', 62, 6, '#35503a'), ('Forest–savanna mosaic, high altitude', 62, 6, '#5a7a4a')]
    W_, H_ = 640, 230; out = [f'<svg viewBox="0 0 {W_} {H_}" width="{W_}" height="{H_}" xmlns="http://www.w3.org/2000/svg" font-family="Albert Sans">']
    y = 8
    for name, km, pc, col in rows:
        w = km / 586 * 240
        out.append(f'<rect x="300" y="{y}" width="{w:.1f}" height="22" fill="{col}"/><text x="292" y="{y+15}" text-anchor="end" font-size="11" fill="#1c1b18">{html.escape(name)}</text>'
                   f'<text x="{300+w+8:.1f}" y="{y+15}" font-size="11" fill="#1c1b18"><tspan font-family="Bodoni Moda" font-size="14">{km} km²</tspan>  {pc}%</text>')
        y += 32
    out.append('</svg>'); return ''.join(out)

def trend_chart():
    # three recovery stories on one panel, each on its own scale as a sparkline
    series = [
        ('Nubian giraffe', [(1992, 3), (2018, 48), (2022, 89), (2025, 163)], '#ef8a3c', 'from 3 to 163'),
        ('Elephant', [(2003, 400), (2012, 440), (2014, 480)], '#c9bf8a', '~400–550, now ranging out'),
        ('Lion', [(2009, 132), (2022, 12)], '#c75f27', '132 → 12'),
    ]
    W_, H_ = 640, 200; out = [f'<svg viewBox="0 0 {W_} {H_}" width="{W_}" height="{H_}" xmlns="http://www.w3.org/2000/svg" font-family="Albert Sans">']
    for i, (name, pts, col, note) in enumerate(series):
        x0 = 10 + i * 215; w = 190; h = 120; top = 30
        mx = max(v for _, v in pts); years = [y for y, _ in pts]; y0, y1 = min(years), max(years)
        sx = lambda yr: x0 + (yr - y0) / max(1, (y1 - y0)) * w; sy = lambda v: top + h - v / mx * h
        out.append(f'<text x="{x0}" y="18" font-family="Bodoni Moda" font-size="15" fill="#1c1b18">{name}</text><text x="{x0}" y="{top+h+18}" font-size="10" fill="#8a6a4b">{note}</text>')
        out.append(f'<line x1="{x0}" y1="{top+h}" x2="{x0+w}" y2="{top+h}" stroke="#1c1b18" stroke-opacity=".2"/>')
        out.append('<polyline fill="none" stroke="%s" stroke-width="2.2" stroke-linejoin="round" points="%s"/>' % (col, ' '.join(f'{sx(y):.1f},{sy(v):.1f}' for y, v in pts)))
        for y, v in pts:
            out.append(f'<circle cx="{sx(y):.1f}" cy="{sy(v):.1f}" r="3.5" fill="{col}" stroke="#f4efe6" stroke-width="1.2"/><text x="{sx(y):.1f}" y="{sy(v)-8:.1f}" text-anchor="middle" font-size="10" fill="#1c1b18">{v}</text><text x="{sx(y):.1f}" y="{top+h+32}" text-anchor="middle" font-size="9" fill="#1c1b18" opacity=".6">{y}</text>')
    out.append('</svg>'); return ''.join(out)

# ---------------- content ----------------
mammals = [
 # species, status in the Kidepo ecosystem, latest figure, source
 ('African savanna elephant', 'Present; dry-season concentration, ranges into Karenga CWA, Kenya and South Sudan', '440 (2012 total count); 407–552 (2014)', 'AED 2013; Wanyama et al. 2014'),
 ('African buffalo', 'Present; Kidepo is Uganda\'s main buffalo stronghold, herds of 3,000+', 'National 41,548 (2023–25), +8.8%/yr', 'UWA SoWR 2026'),
 ('Burchell\'s (plains) zebra', 'Present; one of only four Ugandan populations', 'National 20,942 (2023–25)', 'UWA SoWR 2026'),
 ('Nubian giraffe (CR)', 'Recovered from 3 in 1992; 14 translocated 2018', '163 (2025)', 'UWA SoWR 2026; Brown et al. 2025'),
 ('Common eland', 'Present, low; Uganda\'s third population', '127 in KVNP; 35 in Karenga CWA (2023–25)', 'UWA SoWR 2026'),
 ('Lelwel / Jackson\'s hartebeest', 'Present', '37 seen across the border in KGR 2022', 'Enjojo/KEA 2022; UWA GMP 2012'),
 ('Uganda kob', 'Reintroduced: 110 in 2017, 200 in 2023', 'Establishing', 'UWA SoWR 2026; Kazibwe 2023'),
 ('Greater kudu · Lesser kudu', 'Present; lesser kudu found nowhere else in Uganda', 'National 206 · 806 (2018–20)', 'UWA SoWR 2026'),
 ('Bright\'s gazelle', 'Rare / near-extirpated in KVNP', 'National 756, mostly Pian Upe', 'UWA SoWR 2026'),
 ('Oribi, bohor reedbuck, mountain reedbuck, bushbuck, common duiker, klipspringer, dik-dik', 'Present; dik-dik and Chandler\'s mountain reedbuck are Karamoja specials', 'Dik-dik national ~13,535 (2018)', 'UWA SoWR 2026; GMP 2012'),
 ('Warthog · bushpig', 'Present', '—', 'GMP 2012; Enjojo 2022'),
 ('Southern white rhino', 'Reintroduced 2026 after 43 years without rhino (last black rhino 1983)', '2 (early 2026); 4 moved from Ziwa, March 2026', 'UWA SoWR 2026; Reuters 2026'),
 ('Roan antelope · Beisa oryx · black rhino', 'Locally extinct (roan now only in Pian Upe, 352)', '—', 'UWA SoWR 2026; GMP 2012'),
]
carnivores = [
 ('Lion', '132 (2009) → 12 (2022): poisoning, snaring, trade in parts', 'UWA SoWR 2026'),
 ('Leopard', 'Present; no Kidepo-specific estimate (national NDF 328)', 'Mudumba et al. 2023'),
 ('Cheetah', 'Present at very low density; ~25 in 1971, ≤5 by 2000; Uganda\'s only cheetah', 'GMP 2012; WCS'),
 ('Spotted hyena · striped hyena · aardwolf', 'Present; striped hyena and aardwolf occur in no other Ugandan park', 'GMP 2012; WCS'),
 ('African wild dog', 'Thought extinct since the 1980s; a pair seen on the Narus River, 26 June 2023', 'UWA SoWR 2026'),
 ('Caracal · serval · bat-eared fox · black-backed and side-striped jackal', 'Present; caracal and bat-eared fox are Kidepo specials', 'GMP 2012; WCS'),
]
birds = [
 ('Species recorded', '472–476; second only to Queen Elizabeth NP'),
 ('Birds of prey', '56–58 species, including Verreaux\'s eagle, lammergeier, Egyptian vulture, secretary bird and pygmy falcon'),
 ('Dry-country specials', 'Over 100 species shared with northern Kenya and found in no other Ugandan park; 14 raptors unique to Kidepo in Uganda'),
 ('Flagships', 'Common ostrich (Uganda\'s only wild population; 140 counted across the border in 2022), Karamoja apalis, black-breasted barbet, Abyssinian ground hornbill, Clapperton\'s francolin'),
 ('Threatened vultures', 'White-backed, Rüppell\'s and hooded vultures all use the Kidepo landscape; poisoning is the main threat'),
 ('Ranking', 'Kidepo ranks first of 81 Sudanian-ecoregion protected areas for bird irreplaceability (IUCN)'),
]

cover = f'''<section class="page dark cover">{contour_bg(True)}<div class="glow"></div>
  {brand_header(True)}
  <div class="rel"><div class="eyebrow">Flora and fauna · desk review · October 2026</div>
    <h1>The living landscape</h1>
    <p class="lede">What is known about the plants and animals of Zulia and the wider Kidepo ecosystem, drawn from the published surveys, the NFA and UWA plans, and the 2022 aerial survey of the South Sudan side that KEA flew for the Enjojo Foundation.</p></div>
  <div class="rel meta">Zulia Conservancy (Uganda) Limited · NFA Licence No. 30 · zuliaconservancy.org · For partners and funders</div>
</section>'''

p2 = f'''<div class="eyebrow">In brief</div><h2>A reserve no one has counted</h2>
<div class="intro"><p>Zulia has never been surveyed. The National Forestry Authority's own master plan says so plainly: it "was not sampled for biodiversity by the recent inventory team", and the park plan next door notes that even the boundary was never marked. What we know comes from three directions: the vegetation maps of Langdale-Brown, Osmaston and Wilson (1964), the long record of surveys in Kidepo Valley National Park, 410 km² of which overlaps the reserve, and the 2022 aerial survey of Kidepo Game Reserve in South Sudan, the third side of the same ecosystem.</p>
<p>Put together, they describe a landscape that is intact, under-populated by animals relative to its habitat, and unusually valuable for what it holds: vegetation found nowhere else in Uganda's protected areas, the country's only cheetah, striped hyena, aardwolf, lesser kudu and wild ostrich, a bird list of 475 species, and the water tower for the entire Kidepo basin.</p></div>
<div class="tiers">
  <div class="tier"><b>6 vegetation types</b>in Zulia that occur in no other protected area in Uganda (NFA 2002)</div>
  <div class="tier"><b>86 · 475 · 692</b>mammal, bird and plant species recorded in Kidepo Valley NP (WCS/Makerere 2008)</div>
  <div class="tier"><b>3 → 163</b>Nubian giraffe in Kidepo, 1992 to 2025: what protection does here</div>
</div>
<div class="eyebrow">What this review draws on</div>
<div class="two" style="margin-top:3mm">
  <div class="zone"><h4>NFA Nature Conservation Master Plan, 2002</h4><p>The Zulia Forest Profile (Appendix 44): area, vegetation by type and area, condition scores, management history. The only Zulia-specific source.</p></div>
  <div class="zone"><h4>UWA Kidepo Valley NP General Management Plan, 2012–2022</h4><p>Species richness, vegetation, population history, the 2008 WCS/Makerere biodiversity inventory, zoning and the dual-management arrangement.</p></div>
  <div class="zone"><h4>UWA State of Wildlife Resources in Uganda, 2026</h4><p>The 2021–2025 national census results, species accounts (giraffe, lion, eland, rhino, wild dog), and the 1990–2024 land-cover analysis for Kidepo.</p></div>
  <div class="zone"><h4>Enjojo Foundation / KEA, Kidepo Game Reserve wet-season aerial survey, 2022</h4><p>Flown by KEA in a Cessna 206, 26–29 September 2022: 19.4 hours, 3,130 km, the South Sudan side of the ecosystem and the elephant corridor north to Boma–Badingilo.</p></div>
</div>
<p class="method"><i>Every figure carries its year and source; where UWA documents disagree (bird totals of 462–476) the range is given. Nothing here is a Zulia count: it is what the ecosystem holds, and what the reserve can be expected to hold once protected and watered.</i></p>'''

p3 = f'''<div class="eyebrow">The ground</div><h2>A corner of the Horn of Africa</h2>
<div class="intro"><p>Karamoja is the only part of Uganda in White's Somali–Masai regional centre of endemism, the dry-country flora of Ethiopia, Somalia and northern Kenya; many of its plants reach the western limit of their range here and occur nowhere else in the country. Kidepo is the only national park in that zone, and Zulia, on the Turkana escarpment at the country's extreme north-eastern tip, is its driest, highest and least-visited corner.</p>
<p>The reserve is 1,026 km² on the NFA's figure, rising from 1,040 m on the Kidepo basin to 2,148 m on Mount Zulia (Lotholia), with the Lomil hills and the escarpment falling away into Kenya. Rainfall is 400–800 mm a year in two short seasons; the rivers are sand rivers, flowing for weeks and holding water in pools and under the sand for the rest of the year. The headwaters of the Kidepo–Kapekenyang drainage lie inside the reserve.</p></div>
<figure><img src="{U('kidepo_valley-3970737149.jpg')}" alt="" style="height:36mm"><figcaption>The Kidepo landscape: granite hills, Combretum woodland on the slopes, grassland on the valley floor. Photo supplied; confirm rights before external use.</figcaption></figure>
<div class="eyebrow" style="margin-top:6mm">Vegetation of Zulia Forest Reserve</div>
{veg_chart()}
<p class="method" style="margin-top:2mm"><b>What makes it unique.</b> Areas from Langdale-Brown et al. (1964) via the NFA master plan; condition 5 of 5, "intact, mainly because of its remoteness". Zulia is the only forest reserve in Uganda with vegetation types Q7 (<i>Eragrostis–Loudetia</i> grass savanna), S1 (<i>Chrysopogon</i> grass steppe) and V5 (<i>Acacia mellifera</i> thicket), and the only one with the N10 <i>Boswellia–Fagara–Heeria</i> form of dry Combretum savanna. With N12 and R1 that is six types found nowhere else in the protected-area system, which is why the master plan selected it for Nature Reserve status unseen; the summit juniper forest is a relict that fire is slowly removing from the Kidepo hills.</p>'''

p4 = f'''<div class="eyebrow">Flora</div><h2>Plants: 692 species next door, none listed here</h2>
<div class="two">
<p>The WCS and Makerere University inventory of Kidepo Valley NP in November–December 2008 recorded 692 plant species, including 192 trees, second only to Queen Elizabeth among Uganda's parks. Kalema's 2005 survey of 412 higher plants found 86 trees, 60 shrubs, 167 herbs and 67 grasses; the dominant families are the grasses, legumes and Anacardiaceae, the commonest genera <i>Acacia</i>, <i>Sporobolus</i>, <i>Hyparrhenia</i>, <i>Combretum</i> and <i>Lannea</i>, and the commonest species red oat grass (<i>Themeda triandra</i>), <i>Hyparrhenia filipendula</i>, <i>Setaria sphacelata</i>, <i>Hyperthelia dissoluta</i>, <i>Brachiaria brizantha</i> and <i>Lannea humilis</i>.</p>
<p>Four plant communities structure the landscape. On the valley floors, <i>Acacia gerrardii</i> savanna woodland and fire-climax grassland; on the slopes, Combretum and Acacia woodland grading into bushland; above about 1,500 m, dry montane forest with grass glades, closing to canopy towards 2,700 m; and along every watercourse the borassus palm (<i>Borassus aethiopum</i>), sausage tree (<i>Kigelia</i>) and desert date (<i>Balanites</i>) on the alluvial sands. Red thorn acacia, whistling thorn, <i>Euphorbia candelabrum</i>, baobab and buffalo thorn mark the drier ground.</p>
<p>Zulia's plant list is a blank. No botanist has published a collection from the reserve. Given its six unique vegetation types and the Somali–Masai affinity of the whole region, the first systematic collection is likely to add species to Uganda's national list, and it is the single cheapest piece of science the conservancy can commission. It is also the natural foundation for the botanical garden the technical proposal commits to.</p>
<p><b>Watch-list.</b> Two problems are already recorded across the boundary and will reach Zulia: <i>Harrisonia abyssinica</i> invading the Narus valley, and woody encroachment by <i>Dichrostachys cinerea</i>, <i>Acacia hockii</i> and borassus itself, which UWA now clears as "problematic native species". The 1990–2024 satellite analysis shows Kidepo's woodland more than doubling while grassland also grew; UWA warns that part of that new cover may be unpalatable and is already affecting forage in the park's northern sector, the sector that adjoins Zulia.</p>
</div>
<figure style="margin-top:5mm"><img src="{P('borassus-pool.jpg')}" alt=""><figcaption>Borassus palms and a dry-season pool on the Kidepo River. Zulia Conservancy photograph.</figcaption></figure>'''

def table(rows, cols):
    return '<table class="t"><thead><tr>' + ''.join(f'<th>{c}</th>' for c in cols) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in r) + '</tr>' for r in rows) + '</tbody></table>'

p5 = f'''<div class="eyebrow">Fauna</div><h2>Large mammals of the Kidepo ecosystem</h2>
<p style="font-size:9.5pt;max-width:160mm">Kidepo once held 28 mammal species found in no other Ugandan park. Several were lost in the 1970s and 1980s; the recoveries since show what the habitat can carry. Figures are for Kidepo Valley NP unless marked national.</p>
{table(mammals, ['Species', 'Status in the ecosystem', 'Latest figure', 'Source'])}'''

p5b = f'''<div class="eyebrow">Fauna</div><h2>Three trajectories, one landscape</h2>
<div style="margin-top:4mm">{trend_chart()}</div>
<p class="method">Three trajectories in one landscape. Giraffe: protection plus two translocations took a population of three to 163 in a generation. Elephant: stable around 400–550 in the park counts but ranging further every year, into Karenga, Kenya and the South Sudan corridor, and so counted less. Lion: a 91% collapse in thirteen years, driven by poisoning and snaring in the dry-season range outside the park, which is exactly the range Zulia and Karenga represent.</p>
<h3 style="font-size:16pt;margin:6mm 0 2mm">Carnivores</h3>
{table(carnivores, ['Species', 'Status', 'Source'])}'''

p6 = f'''<div class="eyebrow">Fauna</div><h2>Birds, reptiles and the rest</h2>
<h3 style="font-size:16pt;margin:3mm 0 2mm">Birds</h3>
{table(birds, ['', ''])}
<h3 style="font-size:16pt;margin:5mm 0 2mm">Reptiles and others</h3>
<p style="font-size:9.5pt">Kidepo's crocodiles, dwarfed to 2.5 m by life in seasonal pools, were long assumed to be Nile crocodiles; WCS genetic analysis identified them as the West African <i>Crocodylus suchus</i>, the easternmost population known. Pythons, monitor lizards and a largely unstudied reptile, amphibian and invertebrate fauna complete a picture UWA itself describes as "little known". Side-striped jackal numbers have been reduced by rabies; black-and-white colobus persist in the montane forest.</p>
<figure style="margin-top:4mm"><img src="{P('rangers-kopje.jpg')}" alt=""><figcaption>Rangers on a kopje above the Kidepo plains. Zulia Conservancy photograph.</figcaption></figure>'''

p7 = f'''<div class="eyebrow">Across the border</div><h2>One ecosystem, three countries</h2>
<div class="two">
<p>Zulia sits at the hinge. South of the Kidepo River is the national park; north of the border is Kidepo Game Reserve (KGR), 2,800 km² of South Sudan co-managed by the Enjojo Foundation since January 2022; east over the escarpment is Turkana. Animals have never recognised the lines. Elephant collars tracked by WILD (2008–2011) and UWA's EarthRanger show the Kidepo herds moving into KGR in the rains and into Kenya; UWA attributes part of the recent dip in its elephant count to exactly these movements. The park plan's boundary runs along "the summit of Lonyili… Urango… Kilirr… the confluence of the Pirre and Loliboch streams", the same ridges and streams that bound Zulia.</p>
<p>In September 2022 Enjojo and the South Sudan Wildlife Service flew the first survey of KGR since 2008, with KEA providing the Cessna 206 and pilot pro bono. Over 19.4 hours and 3,130 km at 300 ft the team recorded 140 ostrich, 37 hartebeest, 56 small antelope (mostly reedbuck), 11 eland, 9 warthog and 3 lions, with fresh elephant tracks in the northern corridor but no elephants on the South Sudan side; a herd of about 50 was seen in Kidepo NP close to the border. Against that, 3,332 cattle, 1,810 goats and 789 cultivated fields, with agriculture reaching 10 km into the reserve. The conclusion matters for Zulia: "much of the remaining wildlife… is likely still supported by populations from neighbouring Kidepo National Park", and the reserve's "significance is greatest in its connectivity" with the Ugandan side.</p>
<p>The same is true in reverse. Lions do not die of old age in Kidepo; they die outside the park, in the dry-season range. Buffalo and elephant spend, on one estimate, half their time outside it. Karenga Community Wildlife Area (956 km²) carries the overspill south along the Lokalis; Zulia carries it north and east. Protected and watered, Zulia is the piece that turns a park into an ecosystem. Left as it is, it is where the park's animals go to be shot.</p>
</div>
<figure style="margin-top:4mm"><img src="{P('aerial-plains.jpg')}" alt=""><figcaption>The Kidepo plains from the survey aircraft. Zulia Conservancy photograph.</figcaption></figure>'''

p8 = f'''<div class="eyebrow">Zulia itself</div><h2>What the reserve almost certainly holds</h2>
<div class="two">
<p>No one has counted Zulia, so this is inference, and it is marked as such. The reserve shares 410 km² with the park and 50 km of open boundary along the Kidepo River; the species that use the park's northern and eastern sectors use Zulia. The technical proposal, written from the licensee's own visits, lists baboon, buffalo, bushbuck, bushpig, duiker, eland, oribi, reedbuck, warthog and zebra as present and utilisable. To those the ecosystem evidence adds elephant on seasonal passage, giraffe on the Combretum slopes, greater and lesser kudu and klipspringer on the escarpment, dik-dik in the thicket, leopard, spotted and striped hyena, cheetah on the plains at very low density, ostrich, and the full dry-country bird community including the vultures.</p>
<p>Three things set Zulia apart from the park. Its altitude: the 2,148 m massif and the juniper forest are habitat the park has only on Morungole. Its vegetation: the six unique types, which carry their own invertebrates and small mammals. And its water: as the source of the Kidepo it is where the dry-season pools last longest, which is why the technical proposal and the 2022 survey both single out water as the thing that decides where animals are from December to March.</p>
<p><b>The honest gaps.</b> No plant list. No bird list for the escarpment. No camera-trap record of carnivores. No estimate for any ungulate. No baseline against which the licence's quarterly reports, the ESIA, or a hunting quota could ever be judged. UWA's own instruction to itself in the park plan is "conduct baseline studies for key species"; for Zulia that instruction has never been given.</p>
</div>
<div class="eyebrow" style="margin-top:6mm">A first-year survey programme</div>
<div class="tiers">
  <div class="tier"><b>Dry-season aerial count</b>Systematic reconnaissance flight of the whole reserve plus the dual zone, 2.5 km transects, Cessna 206, January–February when the grass is down and animals are on the water. KEA can fly it; the Enjojo team has the method. About 12 flying hours.</div>
  <div class="tier"><b>Camera traps and spoor</b>40 cameras on the pools, saddles and game trails for 90 days, for the carnivores and the night-shift the aircraft cannot see: cheetah, striped hyena, aardwolf, caracal, wild dog.</div>
  <div class="tier"><b>Plants and birds</b>A Makerere / NatureUganda team for three weeks across the altitude gradient, wet and dry season: the first plant collection from the reserve and a bird list for the escarpment. Seed material for the botanical garden.</div>
</div>
<p class="method">Together these cost a fraction of one lodge and produce the baseline every other document, the ESIA, the forest management plan, the quota applications and the partner prospectuses, depends on. They also give the conservancy the thing it needs most with NFA, UWA and funders: numbers of its own.</p>'''

p9 = f'''<div class="eyebrow">Sources</div><h2>References</h2>
<ol class="refs">
<li>Forest Department (2002). <i>Uganda Forestry Nature Conservation Master Plan</i>. Appendix 44, Zulia Forest Profile, pp. 295–296; Table 3.7.</li>
<li>Uganda Wildlife Authority (2012). <i>Kidepo Valley National Park General Management Plan 2012–2022</i>. Buhanga, E. and Kapere, R. (eds). 114 pp.</li>
<li>Uganda Wildlife Authority (2026). <i>State of Wildlife Resources in Uganda 2026</i>. Table 5; species accounts for giraffe (pp. 59–60), elephant (61–63), buffalo (64), lion (65–66), rhino (67), zebra (68), eland (69), roan (70), leopard (76), dik-dik and extinct species (86–87); land-use change in Kidepo (98–99).</li>
<li>Antoninova, M., Okieh, J.O., Oler, E., Kenyi, S., Mungu, M.K. and Debref, K. (2022). <i>Wet season aerial survey of Kidepo Game Reserve, South Sudan, 2022</i>. Enjojo Foundation, Technical Report No. 1, 41 pp. Financed by Enjojo Foundation, KEA Specialist Aviation Solutions and the Elephant Crisis Fund.</li>
<li>Wanyama, F., Elkan, P., Grossmann, F. et al. (2014). <i>Aerial survey of Kidepo Valley National Park and Karenga Community Wildlife Area, 2014</i>. UWA/WCS, 20 pp.</li>
<li>IUCN/SSC African Elephant Specialist Group (2013). African Elephant Database, Uganda: Kidepo Valley NP, 440 (aerial total count, 2012, Wanyama).</li>
<li>Plumptre, A.J. et al. (2003); WCS and Makerere University (2008) biodiversity inventory of Kidepo Valley NP, as reported in the 2012 GMP.</li>
<li>Kalema, J. (2005). Plant inventory of Kidepo Valley NP, as reported in the 2012 GMP.</li>
<li>Langdale-Brown, I., Osmaston, H.A. and Wilson, J.G. (1964). <i>The Vegetation of Uganda and its bearing on land-use</i>. Government Printer, Entebbe.</li>
<li>Brown, M. et al. (2025); Kalema (1998); Reuters, UWA and Los Angeles Times (March 2026) on the Kidepo giraffe and rhino reintroductions, as cited by Wikipedia, "Kidepo Valley National Park".</li>
<li>Wildlife Conservation Society Uganda, "Kidepo" landscape page; <i>Crocodylus suchus</i> identification.</li>
<li>Zulia Conservancy (Uganda) Ltd (2021). <i>Technical Proposal</i> to the National Forestry Authority, section 1.4 and chapter 3.</li>
<li>UWA (2018). <i>Kidepo Valley National Park</i> visitor guide (species counts).</li>
</ol>
<p class="method" style="margin-top:6mm"><i>Prepared for Zulia Conservancy (Uganda) Limited, October 2026, as a desk review. It contains no new field data. Figures should be re-checked against the primary reports before publication, and the two photographs not credited to the conservancy should have their rights confirmed.</i></p>'''

EXTRA_CSS = '''
figure{margin:4mm 0 0;break-inside:avoid}
figure img{width:100%;height:62mm;object-fit:cover;border-radius:2px;display:block}
figcaption{font-size:8pt;color:var(--kopje);margin-top:1.5mm}
.t{width:100%;border-collapse:collapse;font-size:8.6pt;line-height:1.35}
.t th{text-align:left;font-weight:600;font-size:7.5pt;letter-spacing:.08em;text-transform:uppercase;color:var(--kopje);padding:0 2mm 1.5mm 0;border-bottom:1px solid rgba(28,27,24,.3)}
.t td{padding:1.6mm 2mm 1.6mm 0;border-bottom:1px solid rgba(28,27,24,.12);vertical-align:top}
.t td:first-child{font-family:'Bodoni Moda';font-size:10.5pt;line-height:1.2;width:34%}
.refs{font-size:8.8pt;line-height:1.45;padding-left:5mm}
.refs li{margin-bottom:1.6mm}
h3{font-family:'Bodoni Moda';font-weight:400}
'''
FOOT = 'Zulia Conservancy · The living landscape'
doc = f'''<!doctype html><html><head><meta charset="utf-8"><title>Zulia — The living landscape</title>
<style>{FONTS}{BASE_CSS}{EXTRA_CSS}</style></head><body>
{cover}
{page(p2, 2, footer=FOOT)}
{page(p3, 3, footer=FOOT)}
{page(p4, 4, footer=FOOT)}
{page(p5, 5, footer=FOOT)}
{page(p5b, 6, footer=FOOT)}
{page(p6, 7, footer=FOOT)}
{page(p7, 8, footer=FOOT)}
{page(p8, 9, footer=FOOT)}
{page(p9, 10, footer=FOOT)}
</body></html>'''
open(f'{OUT}/flora.html', 'w').write(doc)
print('html', len(doc))
