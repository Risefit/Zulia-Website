import type { Metadata } from "next";
import { PageHero, Section, Photo, Cta } from "@/components/ui";
import { facts, photos } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <PageHero
        title="A private company with a public task"
        lede="Zulia Conservancy (Uganda) Limited was formed in 2019 by Ugandan and South African partners for one purpose: to bring the Zulia Central Forest Reserve under active management for the first time since it was gazetted in 1942."
        photo={photos.rangers}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Why Zulia</h2>
            <div className="prose-measure mt-6 leading-relaxed text-ink/80">
              <p>
                Uganda's forest reserves were drawn by surveyors in the 1930s and 40s and most have been farmed, settled or logged since.
                Zulia escaped. It sits in the extreme north-eastern corner of the country, hemmed in by the South Sudan border to the north,
                the Kenyan escarpment to the east and the Kidepo River to the south. For decades it was too remote and too insecure to reach.
              </p>
              <p>
                The result is {facts.areaHa} hectares of intact dry woodland, granite inselbergs and seasonal rivers that still function
                as the northern range of the Kidepo Valley wildlife. Karamoja is now at peace, the Kitgum–Kidepo road is being built and an
                international airport has broken ground at Karenga. The window to secure Zulia before it is grazed out or settled is open, and it is short.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Our mandate</h2>
            <div className="prose-measure mt-6 leading-relaxed text-ink/80">
              <p>
                In May 2022 the National Forestry Authority granted the company Licence No. {facts.licenceNo} under section 41 of the
                National Forestry and Tree Planting Act 2003: a {facts.termYears}-year licence for the collaborative management of the
                reserve and the development of ecotourism within it. The land remains the property of the Government of Uganda. We hold
                responsibilities, not title.
              </p>
              <p>
                Those responsibilities are specific: a ten-year forest management plan, environmental and social impact assessment,
                quarterly reporting, maximum local employment and procurement, and working within the dual management of NFA and the
                Uganda Wildlife Authority where the reserve overlaps Kidepo Valley National Park.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Mission and vision</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="border-t border-ink/20 pt-6">
            <p className="display text-2xl">Mission</p>
            <p className="prose-measure mt-4 leading-relaxed text-ink/80">
              To restore and protect the Zulia Central Forest Reserve as a working wilderness: secure for its wildlife, productive for its
              neighbours, and financed by partners who share in what it produces.
            </p>
          </div>
          <div className="border-t border-ink/20 pt-6">
            <p className="display text-2xl">Vision</p>
            <p className="prose-measure mt-4 leading-relaxed text-ink/80">
              By 2040, Zulia and Kidepo function as one 2,500 km² landscape in which elephant, buffalo, giraffe and lion move freely across
              the border hills, the Dodoth and Ik communities earn more from wildlife than from charcoal or raiding, and Uganda has a
              model for how a private licensee can run a public reserve.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Photo photo={photos.track} className="aspect-[4/3] overflow-hidden" sizes="(min-width:1024px) 50vw, 100vw" />
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">How we are governed</h2>
            <div className="prose-measure mt-6 leading-relaxed text-ink/80">
              <p>
                The company is led by its Managing Director, Christoffel Johannes Schutte, who negotiated the licence and has worked in
                Karamoja since 2019. A Zulia Conservation Trust is being established alongside the company to hold the conservation
                programme, with seats for the National Forestry Authority, Uganda Wildlife Authority, Kaabong District and the neighbouring
                communities, so that the money raised for rangers, fire management and community work is governed separately from the
                commercial concession.
              </p>
              <p>We publish our licence conditions and report against them. Ask us for anything you want to see.</p>
            </div>
            <div className="mt-8"><Cta href="/contact" ghost>Get in touch</Cta></div>
          </div>
        </div>
      </Section>
    </>
  );
}
