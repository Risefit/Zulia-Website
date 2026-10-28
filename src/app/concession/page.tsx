import type { Metadata } from "next";
import { ZoomMap } from "@/components/ZoomMap";
import { MapTabs } from "@/components/MapTabs";
import { PageHero, Section, Photo, Stat, Cta } from "@/components/ui";
import { facts, photos } from "@/lib/site";

export const metadata: Metadata = { title: "The concession" };

const terms = [
  ["Instrument", "Licence for eco-tourism development and forest conservation activities in a Central Forest Reserve, National Forestry and Tree Planting Act 2003, s.41"],
  ["Licensor", "National Forestry Authority, Government of Uganda"],
  ["Licensee", "Zulia Conservancy (Uganda) Limited"],
  ["Licence number and date", `No. ${facts.licenceNo}, ${facts.licenceDate}`],
  ["Area", `${facts.areaHa} ha — the whole of Zulia Central Forest Reserve, Kaabong District, Karamoja`],
  ["Term", `${facts.termYears} years, with an initial 24-month probationary period and performance reviews every three years`],
  ["Permitted", "Collaborative management of the reserve; a 20-bed exclusive wilderness lodge, a 40-bed mid-range lodge and a 6-tent hunting camp; forest walks, cycling, camping, study tours, bird-watching and research. Hunting and game ranching subject to Uganda Wildlife Authority licensing."],
  ["Dual management", `About ${facts.overlapKm2} km² of the reserve lies inside Kidepo Valley National Park and is managed jointly by NFA and UWA`],
  ["Obligations", "Ten-year forest management plan; environmental and social impact assessment; quarterly progress reports; community employment and procurement; environmental monitoring; annual and per-visitor fees to NFA"],
  ["Tenure", "No interest in land passes to the licensee. All fixed developments revert to the Government of Uganda at the end of the term."],
];

const access = [
  ["By air today", "Scheduled and charter flights from Entebbe and Kajjansi land at the Apoka (Kidepo) airstrip inside Kidepo Valley National Park, about 1 h 45 min flying time. Apoka is 23 km from the reserve's western boundary and 41 km from its centre in a straight line; by the park road through Kanangorok it is under an hour's drive to the Kidepo River crossing."],
  ["Kidepo International Airport", "A new international airport is under construction south of the park near Karenga (3°44′N 33°44′E), with a 3,600 m runway designed for direct regional and long-haul arrivals. It is 21 km from the reserve boundary and 39 km from the reserve's centre, roughly the same distance as Apoka. When it opens, Zulia becomes the closest major wilderness to an international gateway anywhere in East Africa."],
  ["By road", "Kampala to Kidepo is about 570 km and 10–12 hours via Gulu and Kitgum (the Kitgum–Kidepo road is being upgraded alongside the airport), or via Moroto and Kaabong on the eastern route. From Kaabong town the reserve boundary is 40 km north; from Karenga, 36 km."],
  ["Inside the reserve", "There are no all-weather roads inside Zulia today. Access is by 4×4 track from the Kidepo valley and along the river in the dry season (December to March). Opening a graded spine road from the south-west, with an airstrip on the plains, is in the first-phase plan."],
  ["From Kenya and South Sudan", "Lokichoggio in Kenya is 32 km from the eastern boundary by air; the Turkana escarpment forms the border. Cross-border tourism circuits with Kidepo and Lotukei in South Sudan are part of the long-term landscape vision, subject to the relevant permits."],
];

export default function Concession() {
  return (
    <>
      <PageHero
        title="The concession, explained"
        lede="A fifty-year licence over the whole of one of Uganda's largest and least-known forest reserves, on the three-way border of Uganda, South Sudan and Kenya."
      />

      {/* Map panel */}
      <section className="relative overflow-hidden bg-granite text-bone on-dark">
        <div className="contours text-kopje opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16 lg:py-24">
          <div className="lg:sticky lg:top-24">
            <div className="mx-auto aspect-square w-full max-w-[640px] text-bone">
              <ZoomMap playOnView className="map-vignette-soft h-full w-full" />
            </div>
          </div>
          <div className="lg:pt-10">
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Where it is</h2>
            <p className="prose-measure mt-5 leading-relaxed text-bone/85">
              The extreme north-east of Uganda, 450 km from Entebbe by air and some 570 km by road. The Apoka airstrip in Kidepo Valley National
              Park lies 23 km from the reserve's western boundary, and the new Kidepo International Airport is being built 21 km from it. The
              nearest towns are Kaabong to the south-east and Karenga to the south-west.
            </p>
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-6 gap-y-8">
              <Stat value={facts.areaKm2 + " km²"} label="licensed area" />
              <Stat value="4°N 34°E" label="centre of the reserve" />
              <Stat value={facts.summitM + " m"} label="Mount Zulia summit" />
            </div>

            <div className="mt-14 border-t border-bone/15 pt-12">
              <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">What the boundary means</h2>
              <div className="prose-measure mt-5 leading-relaxed text-bone/85">
                <p>
                  The reserve is a wedge: broad in the north-east around Mount Zulia and the Turkana escarpment, narrowing south-west along the
                  Kidepo River. Its northern edge is the South Sudan border and its eastern edge the Kenyan one. The lighter area is the
                  {" "}{facts.overlapKm2} km² that also lies inside Kidepo Valley National Park, where we work under both NFA and UWA.
                </p>
                <p>
                  The boundary shown is the National Forestry Authority's 2021 GIS boundary as published in the World Database on Protected Areas.
                  Zulia was never fully demarcated on the ground; a formal re-survey is one of the licence's first-year obligations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Layered map / satellite timeline */}
        <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <h2 className="mx-auto mb-6 text-[clamp(1.6rem,2.8vw,2.4rem)] lg:w-[min(80%,calc((100svh-16rem)*1.2))]">The reserve, two ways</h2>
          <MapTabs />
          <p className="mx-auto mt-4 text-sm leading-relaxed text-bone/60 lg:w-[min(80%,calc((100svh-16rem)*1.2))]">
            Everything east of the boundary is thinly mapped: that is the honest picture of a reserve no one has worked in. The optional lodge-site layer shows
            twelve hilltop positions ranked by elevation, relief, horizon and distance to water; they are desk-based candidates for ground-truthing, not proposals.
          </p>
        </div>

        {/* Google Earth */}
        <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="grid gap-8 rounded-sm border border-bone/10 bg-bone/5 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-[clamp(1.6rem,2.8vw,2.4rem)]">Take it into Google Earth</h2>
              <p className="mt-4 leading-relaxed text-bone/80">
                The full layered file: boundaries, water, roads and tracks, peaks, settlements and the indicative sites, each in its own
                folder you can switch on and off, with the reserve in 3D terrain.
              </p>
              <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-bone/70">
                <li>Download the file. On a computer with Google Earth Pro installed, or a phone with the Google Earth app, opening it loads every layer directly.</li>
                <li>In Google Earth on the web, choose <em>File → Import KML file</em> and pick the download.</li>
              </ol>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href="/Zulia_Maps.kmz" className="btn btn-solid">Download the layered map (KMZ, 180 KB)</a>
              <a href="https://earth.google.com/web/@4.0262,33.9501,1400a,70000d,35y,0h,45t,0r" target="_blank" rel="noreferrer" className="btn btn-ghost">Fly to Zulia in Google Earth</a>
              <a href="/Zulia_Concession.kml" download className="btn btn-ghost">Boundary only (KML)</a>
            </div>
          </div>
        </div>
      </section>

      {/* Getting there */}
      <Section id="getting-there" compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Getting there</h2>
            <p className="prose-measure mt-4 leading-relaxed text-ink/80">
              1 h 45 by air from Entebbe to the Apoka airstrip, 23 km from the boundary; the new Kidepo International Airport will be 21 km away.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6">
              <Stat value="21 km" label="new airport to boundary" />
              <Stat value="1 h 45" label="Entebbe to Kidepo by air" />
              <Stat value="10–12 h" label="Kampala by road" />
            </div>
          </div>
          <details className="group border-y border-ink/15">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-left font-medium [&::-webkit-details-marker]:hidden">
              <span>Air, road and cross-border detail</span>
              <span className="ml-4 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/25 text-ink/70 transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <dl className="divide-y divide-ink/15 border-t border-ink/15">
              {access.map(([k, v]) => (
                <div key={k} className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-medium">{k}</dt>
                  <dd className="text-ink/80 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </Section>

      {/* Terms */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">The terms, plainly</h2>
            <p className="prose-measure mt-5 leading-relaxed text-ink/80">
              We publish the substance of the licence because our partners, our regulators and our neighbours should all be able to see
              what we have agreed to. The full agreement is available to serious counterparties on request.
            </p>
            <Photo photo={photos.riverbed} className="mt-8 aspect-[4/3] overflow-hidden" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <dl className="divide-y divide-ink/15 border-y border-ink/15">
            {terms.map(([k, v]) => (
              <div key={k} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr]">
                <dt className="font-medium">{k}</dt>
                <dd className="text-ink/80 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Landscape */}
      <Section tone="sand">
        <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">The ground itself</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <Photo photo={photos.inselberg} className="aspect-[4/3] overflow-hidden" sizes="33vw" />
            <h3 className="mt-5 text-2xl">Inselbergs and hills</h3>
            <p className="mt-2 leading-relaxed text-ink/80">Granite domes rise from the plain to the Zulia and Lomil hills; the summit of Mount Zulia at {facts.summitM} m is the high point of the whole Kidepo landscape.</p>
          </div>
          <div>
            <Photo photo={photos.pool} className="aspect-[4/3] overflow-hidden" sizes="33vw" />
            <h3 className="mt-5 text-2xl">Rivers of sand and palms</h3>
            <p className="mt-2 leading-relaxed text-ink/80">The Kidepo River and its tributaries run for a few weeks a year and hold water in rock pools and sand through the dry season, lined with borassus palms.</p>
          </div>
          <div>
            <Photo photo={photos.plains} className="aspect-[4/3] overflow-hidden" sizes="33vw" />
            <h3 className="mt-5 text-2xl">Savanna and woodland</h3>
            <p className="mt-2 leading-relaxed text-ink/80">Open grassland on the valley floor gives way to Combretum and Acacia woodland on the slopes: vegetation types poorly represented anywhere else in Uganda's protected areas.</p>
          </div>
        </div>
        <div className="mt-12"><Cta href="/opportunities">What this makes possible</Cta></div>
      </Section>
    </>
  );
}
