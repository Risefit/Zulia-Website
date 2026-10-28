import type { Metadata } from "next";
import { PageHero, Section, Photo, Cta } from "@/components/ui";
import { photos } from "@/lib/site";

export const metadata: Metadata = { title: "Opportunities" };

const tracks: { id: string; title: string; photo: typeof photos.pool; lede: string; body: string[]; fit: string; href?: string; report?: { label: string; href: string } }[] = [
  {
    id: "lodges",
    title: "Lodge and camp operators",
    report: { label: "Lodge sites: thirty places to wake up (PDF)", href: "/reports/Zulia_Lodge_Sites.pdf" },
    photo: photos.sunset,
    lede: "Two sites, long leases, a landscape no one else can offer.",
    body: [
      "The licence provides for an exclusive 20-bed wilderness lodge and a 40-bed mid-range camp. We are not building them ourselves. We are looking for operators who will design, build and run them under long-term site leases with a conservation fee attached to every bed-night.",
      "Sites will be identified with the National Forestry Authority after survey. Candidates include the Kidepo River frontage with its palms and rock pools, and hilltop positions in the foothills below Mount Zulia with 360-degree views over the whole Kidepo system (see the layered map on the concession page).",
      "Access is better than the map suggests: the Apoka airstrip is 1 h 45 by air from Entebbe and 23 km from the boundary, and Kidepo International Airport, now under construction, will be 21 km away.",
    ],
    fit: "Operators already in East Africa with a record in remote, low-density camps; a design that touches the ground lightly; and an interest in being first into a new landscape rather than tenth into an old one.",
  },
  {
    id: "hunting",
    title: "Hunting outfitters",
    photo: photos.buffaloResting,
    lede: "A six-tent camp on the northern edge of the Kidepo buffalo range.",
    body: [
      "Sport hunting is legal in Uganda under the Wildlife Act 2019 and operates on quota in the Karamoja community wildlife areas next door. The licence provides for a hunting camp at Zulia, subject to Uganda Wildlife Authority wildlife-use rights, and we intend to appoint one outfitter to operate it.",
      "We are offering one outfitter exclusive rights over two blocks of about 310 km² in total: the Lolabo lowlands round the north of Mount Zulia and the Lotukei plateau in the south-east, with the main camp 42 km from the new Kidepo International Airport. The product is Nile buffalo and the Karamoja specials, Chanler's mountain reedbuck, dik-dik and klipspringer, with plains game, hunted on foot. Quotas will be set with UWA from our own aerial count, and a fixed share of hunting income goes to the neighbouring communities.",
    ],
    fit: "An established outfitter with a Ugandan or East African professional-hunter licence, a clean compliance record, and the patience to build a block from survey upwards.",
    report: { label: "Outfitter prospectus: blocks and lease terms (PDF)", href: "/reports/Zulia_Hunting_Outfitter_Prospectus.pdf" },
  },
  {
    id: "funds",
    title: "Conservation funds and foundations",
    photo: photos.lionOwn,
    lede: "A thousand square kilometres of intact habitat, a fifty-year mandate, and a governance structure built for grant funding.",
    body: [
      "Protection in Zulia will cost more than tourism can pay for in the first decade; that is true of every remote landscape in Africa. The Zulia Conservation Trust is being formed to hold the ranger force, the fire and water programme, the monitoring and the community work, with the regulators and the communities on its board and audited accounts from the first year.",
      "We work alongside, not instead of, the institutions already in the landscape: the Uganda Wildlife Authority and the National Forestry Authority as our regulators and co-managers, and the organisations supporting the Kidepo Valley conservation landscape. Zulia is the piece of that landscape with no one yet funding it.",
    ],
    fit: "Funders of landscape-scale protection, species recovery, community conservancies and aerial monitoring who want a defined, boundaried site with a long licence behind it.",
  },
  {
    id: "ranching",
    title: "Wildlife and livestock partners",
    photo: photos.eland,
    lede: "Karamoja is cattle country. The plan works with that, not against it.",
    body: [
      "We do not intend to run a company herd. We intend to agree managed dry-season grazing with the Dodoth kraals on defined blocks of the reserve, tied to a grazing plan and a no-fire rule, and to pair that with a buying scheme that pays better prices for cattle from compliant kraals. Wildlife ranching and game-meat value chains may follow once populations recover and UWA licences allow.",
      "Partners with experience of integrating livestock and wildlife on rangeland in East Africa, or of community livestock-to-market programmes, can shape this from the beginning.",
    ],
    fit: "Rangeland managers, livestock enterprises and conservancies with a working model of wildlife and cattle sharing ground.",
  },
  {
    id: "adventure",
    title: "Adventure tourism operators",
    photo: photos.camp,
    lede: "No roads. That is the point.",
    body: [
      "Walking safaris, hiking and trekking to the summit of Mount Zulia, horseback safaris along the river and mountain biking on the inselberg country, all from a shared low-impact base camp on the Kidepo River. Zulia is the one large protected area in Uganda where the whole experience can be built on foot and hoof from the start.",
    ],
    fit: "Specialist operators with a safety record in remote, guided, self-propelled travel, who would rather share a camp than own a lodge.",
    href: "/opportunities/adventure",
  },
  {
    id: "birding",
    title: "Birding tour operators",
    photo: photos.vulture,
    lede: "Where East African and Sahelian birds meet, and almost nobody has kept a list.",
    body: [
      "Kidepo Valley National Park records around 475 bird species, the second-highest total of any Ugandan park, with a run of dry-country specials found nowhere else in the country: ostrich, Kori bustard, secretarybird, Abyssinian ground hornbill, Jackson's hornbill, Clapperton's francolin, pygmy falcon, Egyptian vulture, Karamoja apalis and the Ethiopian–Somali species that reach their western limit here. Zulia is the same landscape with more altitude, more riverine forest and no records at all.",
      "We are looking for one or two birding operators to help build the species list, scout the sites and bring the first groups, working from the shared base camp and the fly camps on the river. The reserve's altitude range, from the Kidepo River at 1,040 m to the summit at 2,149 m, promises montane species on the escarpment that have never been documented on the Ugandan side.",
    ],
    fit: "Specialist birding companies and guides with East African experience who want a frontier site, and who will share their records with the Trust's monitoring programme.",
    href: "/contact?topic=birding",
  },
  {
    id: "botanical",
    title: "Botanical garden and indigenous plant conservation",
    photo: photos.palms,
    lede: "A living collection of Karamoja's plants, in Karamoja.",
    body: [
      "The licence provides for a botanical garden, and the South African National Biodiversity Institute expressed interest in 2019 in helping to design a conservation garden in the reserve. The idea is a garden and seed bank for the dryland flora of north-eastern Uganda: the Combretum and Acacia woodland types, borassus and doum palm, shea (Vitellaria nilotica), frankincense (Boswellia), desert date (Balanites), the aloes, euphorbias and medicinal plants the Dodoth and Ik have used for generations, and the little-known montane flora of the Zulia hills.",
      "It would serve research, propagation for restoration planting in the reserve, education for visiting schools and visitors, and a nursery enterprise for the neighbouring communities. We are looking for a botanical institution, a university or a foundation to partner in its design, a baseline flora survey and the first collections.",
    ],
    fit: "Botanic gardens, herbaria and plant-conservation bodies in Africa and beyond; universities with dryland ecology programmes; funders of seed banking and ethnobotany.",
    href: "/contact?topic=botanical",
  },
  {
    id: "research",
    title: "Researchers, filmmakers and aviation",
    photo: photos.inselberg,
    lede: "Almost nothing has been published about Zulia. That is an invitation.",
    body: [
      "The licence provides for research access on agreed terms. We welcome botanists, ecologists, archaeologists and film crews, and we have a particular interest in partners for the aerial work: wildlife census, boundary mapping, fire detection and patrol, where a light aircraft or drone does in a morning what a vehicle cannot do in a month.",
    ],
    fit: "Universities and institutes, natural-history producers, and operators of survey aircraft and UAVs.",
  },
];

export default function Opportunities() {
  return (
    <>
      <PageHero
        title="Come and shape it with us"
        lede="Zulia is a platform, not a finished product. Each of the lines below is open, and none of them is fixed. If you see a better way to do one of them, that is the conversation we want to have."
        photo={photos.elephants}
      />
      <nav aria-label="Opportunity tracks" className="sticky top-0 z-30 border-b border-ink/10 bg-bone/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-ink/50">Jump to</span>
          <ul className="flex flex-wrap gap-2">
            {tracks.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/20 px-3.5 py-1.5 text-sm text-ink/80 transition hover:border-dawn hover:bg-dawn/10 hover:text-ink">
                  {t.title}
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="opacity-60"><path d="M5 1v8M1.5 5.5 5 9l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {tracks.map((t, i) => (
        <Section key={t.id} tone={i % 2 ? "sand" : "bone"}>
          <article id={t.id} className="grid scroll-mt-44 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Photo photo={t.photo} className={`aspect-[4/3] overflow-hidden ${i % 2 ? "lg:order-2" : ""}`} sizes="(min-width:1024px) 45vw, 100vw" />
            <div className={i % 2 ? "lg:order-1" : ""}>
              <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">{t.title}</h2>
              <p className="display mt-4 text-xl text-kopje">{t.lede}</p>
              <div className="prose-measure mt-5 leading-relaxed text-ink/80">{t.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
              <p className="prose-measure mt-6 border-l-2 border-palm pl-4 text-ink/80"><span className="font-medium">Who fits: </span>{t.fit}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Cta href={`/contact?topic=${t.id}`}>Start a conversation</Cta>
                {"href" in t && t.href && t.href.startsWith("/opportunities") && <Cta href={t.href} ghost>See the trail concept</Cta>}
                {t.report ? (
                  <a href={t.report.href} className="btn btn-ghost">{t.report.label}</a>
                ) : (
                  <span className="btn btn-ghost cursor-default opacity-50" aria-disabled title="In preparation">Report: in preparation</span>
                )}
              </div>
            </div>
          </article>
        </Section>
      ))}
      <Section tone="granite">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Everything here is subject to the approvals of the National Forestry Authority and the Uganda Wildlife Authority, and we will say so in every agreement we sign.</h2>
          <p className="prose-measure leading-relaxed text-bone/80">We would rather be slow and permitted than fast and reversed. Partners who understand that tend to be the ones still here in year ten.</p>
        </div>
      </Section>
    </>
  );
}
