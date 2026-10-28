import type { Metadata } from "next";
import { TrailMap } from "@/components/TrailMap";
import { PageHero, Section, Photo, Cta } from "@/components/ui";
import { photos } from "@/lib/site";

export const metadata: Metadata = { title: "Adventure tourism" };

const forms = [
  { title: "Walking safaris", body: "Multi-day walks between fly camps along the Kidepo River and up through the Combretum woodland, armed-guide led, in a reserve with no vehicles and no other guests." },
  { title: "Hiking and trekking", body: "A base camp on the river frontage at about 1,050 m, a two-day summit trail to Mount Zulia at 2,149 m, and a four-day traverse along the Turkana escarpment with views into Kenya and South Sudan." },
  { title: "Horseback safaris", body: "Open valley floor, sandy river courses and borassus palm groves make the southern third of the reserve natural riding country, with game on the flats and the hills as a backdrop." },
  { title: "Mountain biking", body: "Inselberg and river loops from the base camp on management tracks and single-track, graded by survey; the only legal mountain-bike terrain in a Ugandan protected area of this size." },
  { title: "Specialist and expedition travel", body: "Rock-climbing on the granite domes, birding in a transition zone between East African and Sudano-Sahelian avifauna, and expeditions into a landscape that has never been written up." },
];

export default function Adventure() {
  return (
    <>
      <PageHero
        title="Adventure, from the ground up"
        lede="Zulia has no roads, which is a problem for a game-drive lodge and a gift for everyone else. We are looking for operators who move people on foot, on horseback and on two wheels, working from a shared base camp on the Kidepo River."
        photo={photos.rangers}
      />

      <section className="dawn-glow relative overflow-hidden bg-granite text-bone on-dark">
        <div className="contours text-kopje opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div>
              <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">One camp, many ways up</h2>
              <p className="prose-measure mt-5 leading-relaxed text-bone/85">
                The concept is a single low-impact base camp on the river, shared by operators, with routes radiating from it: a summit
                trail, an escarpment traverse, a riding country to the east and bike loops to the west. Shared infrastructure keeps
                the footprint small and the economics workable for specialist operators who would never build a camp alone.
              </p>
              <p className="prose-measure mt-4 leading-relaxed text-bone/85">
                The routes drawn here are our working concept. Final alignments follow the baseline survey and NFA's approval of the development plan.
              </p>
            </div>
            <TrailMap />
          </div>
        </div>
      </section>

      <Section>
        <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">What we are looking for</h2>
        <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((f) => (
            <li key={f.title} className="border-t border-ink/20 pt-5">
              <h3 className="text-2xl">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/80">{f.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Photo photo={photos.track} className="aspect-[4/3] overflow-hidden" sizes="(min-width:1024px) 50vw, 100vw" />
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">How a partnership would work</h2>
            <div className="prose-measure mt-5 leading-relaxed text-ink/80">
              <p>
                Operators take a licence to run a defined activity from the base camp under an agreement with Zulia Conservancy, with a
                per-guest conservation fee that funds rangers and community programmes, and with guiding, portering and camp roles
                recruited locally and trained. Camp capital can be shared, contributed or leased, depending on what each operator brings.
              </p>
              <p>
                Everything is subject to the National Forestry Authority's approval of the development plan and, where routes enter the
                dual-management zone, the agreement of the Uganda Wildlife Authority. We would rather design the trails with you than hand you a map.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3"><Cta href="/contact?topic=adventure">Talk to us about adventure</Cta><Cta href="/opportunities" ghost>All opportunities</Cta></div>
          </div>
        </div>
      </Section>
    </>
  );
}
