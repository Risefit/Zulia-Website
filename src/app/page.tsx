import Link from "next/link";
import { ZoomMap } from "@/components/ZoomMap";
import { Photo, Section, Cta, Stat } from "@/components/ui";
import { facts, photos } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero: the map is the picture */}
      <section className="dawn-glow relative isolate min-h-[100svh] overflow-hidden bg-granite text-bone on-dark">
        <div className="contours text-kopje opacity-40" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
          <div className="order-2 lg:order-1">
            <p className="text-sm text-bone/70">Kaabong District · Karamoja · Uganda</p>
            <h1 className="mt-4 text-[clamp(2.8rem,7vw,6rem)]">
              One thousand square kilometres,<br className="hidden sm:block" /> <em className="dawn">fifty years</em>, one chance.
            </h1>
            <p className="prose-measure mt-7 text-lg leading-relaxed text-bone/85">
              Zulia is the forgotten corner of the Kidepo ecosystem: granite hills, borassus rivers and open savanna
              on the border of South Sudan and Kenya, with no road into it and no one managing it for eighty years.
              We hold the licence to change that.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta href="/concession" ghost>Explore the concession</Cta>
              <Cta href="/opportunities">Partner with us</Cta>
            </div>
          </div>
          <div className="order-1 aspect-square w-full max-w-[720px] justify-self-center text-bone lg:order-2 lg:justify-self-end">
            <ZoomMap className="map-vignette h-full w-full" />
          </div>
        </div>
      </section>

      {/* Aerial film strip */}
      <section className="relative bg-granite">
        <video
          className="h-[70svh] w-full object-cover"
          src="/media/hero-loop.mp4"
          poster="/media/aerial-inselberg.jpg"
          autoPlay muted loop playsInline
          aria-label="Aerial footage over the Zulia plains and inselbergs after the rains"
        />
        <p className="caption on-dark absolute bottom-4 right-5 text-bone/70 sm:right-8">Over Zulia, April. Filmed from a light aircraft.</p>
      </section>

      {/* The place */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)]">Where the Kidepo valley meets the mountains</h2>
            <div className="prose-measure mt-6 text-ink/80 leading-relaxed">
              <p>
                Gazetted in {facts.gazetted}, Zulia Central Forest Reserve covers {facts.areaHa} hectares of Combretum and Acacia
                woodland, rock outcrops and seasonal rivers rising from the Kidepo River at 1,040 metres to the summit of
                Mount Zulia at {facts.summitM}. It is the water tower for the Kidepo system and the northern range of the
                park's elephant, buffalo, giraffe and lion.
              </p>
              <p>
                It was never demarcated, never developed and, for most of its history, too remote and too insecure to manage.
                That is exactly why it is still intact.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              <Stat value={`${facts.areaKm2} km²`} label="licensed area" />
              <Stat value={`${facts.termYears} yrs`} label="licence term" />
              <Stat value={`${facts.overlapKm2} km²`} label="shared with Kidepo Valley NP" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Photo photo={photos.pool} className="col-span-2 aspect-[16/10] overflow-hidden" sizes="(min-width:1024px) 55vw, 100vw" />
            <Photo photo={photos.rangers} className="aspect-[4/5] overflow-hidden" sizes="30vw" />
            <Photo photo={photos.riverbed} className="aspect-[4/5] overflow-hidden" sizes="30vw" />
          </div>
        </div>
      </Section>

      {/* Wildlife */}
      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-[clamp(2rem,4vw,3.4rem)]">The animals are already here</h2>
            <p className="prose-measure mt-6 leading-relaxed text-ink/80">
              Kidepo Valley holds some ten thousand buffalo, a thousand elephant, Rothschild's giraffe, lion, cheetah and
              species found nowhere else in Uganda. Zulia is their dry-season range and their corridor north. Secure it,
              water it, and they return.
            </p>
            <Link href="/what-we-do" className="mt-6 inline-block underline">How we work →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <Photo photo={photos.lion} className="col-span-2 aspect-[16/9] overflow-hidden" sizes="(min-width:1024px) 60vw, 100vw" />
            <Photo photo={photos.elephants} className="aspect-[4/3] overflow-hidden" sizes="30vw" />
            <Photo photo={photos.giraffe} className="aspect-[4/3] overflow-hidden" sizes="30vw" />
          </div>
        </div>
      </Section>

      {/* Model */}
      <Section tone="granite">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <h2 className="text-[clamp(2rem,4vw,3.4rem)]">A conservancy built on partnership, not ownership</h2>
          <div className="prose-measure leading-relaxed text-bone/85">
            <p>
              We are the licence holder, not the lodge company. Zulia will be run as a platform: the National Forestry Authority
              and Uganda Wildlife Authority as our regulators and co-managers, the Dodoth and Ik communities as neighbours
              and partners, and operators, investors and conservation funds bringing what each does best.
            </p>
            <p>
              Lodge sites, a hunting block, a community grazing compact, aerial monitoring and a conservation trust — each
              one is open to the right partner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href="/opportunities" ghost>See the opportunities</Cta>
              <Cta href="/donate" ghost>Support the work</Cta>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
