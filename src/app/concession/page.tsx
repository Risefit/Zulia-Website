import type { Metadata } from "next";
import { ZoomMap } from "@/components/ZoomMap";
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
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-24">
          <div className="aspect-square w-full max-w-[640px] text-bone"><ZoomMap autoplay={false} staticStage="uganda" className="map-vignette h-full w-full" /></div>
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Where it is</h2>
            <p className="prose-measure mt-5 leading-relaxed text-bone/85">
              The extreme north-east of Uganda. Kampala is 650 km by road; the Apoka airstrip in Kidepo Valley National Park is
              forty minutes' drive from the reserve's western boundary. The nearest towns are Kaabong to the south-east and Karenga to the south-west.
            </p>
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-6 gap-y-8">
              <Stat value={facts.areaKm2 + " km²"} label="licensed area" />
              <Stat value="4°N 34°E" label="centre of the reserve" />
              <Stat value={facts.summitM + " m"} label="Mount Zulia summit" />
            </div>
          </div>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="lg:order-2 aspect-square w-full max-w-[640px] text-bone lg:justify-self-end"><ZoomMap autoplay={false} staticStage="zulia" className="map-vignette h-full w-full" /></div>
          <div className="lg:order-1">
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
            <a href="/Zulia_Concession.kml" download className="btn btn-ghost mt-8">Download the boundary for Google Earth (KML)</a>
          </div>
        </div>
      </section>

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
