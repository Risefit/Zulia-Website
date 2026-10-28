import type { Metadata } from "next";
import { PageHero, Section, Photo, Cta } from "@/components/ui";
import { photos } from "@/lib/site";

export const metadata: Metadata = { title: "What we do" };

const programmes = [
  {
    title: "Protection",
    body: "A ranger and community-scout force based inside the reserve for the first time, radio-linked to the Kidepo joint operations centre, with aerial patrol over the border hills where no vehicle can go.",
    photo: photos.rangers,
  },
  {
    title: "Water and fire",
    body: "Boreholes and small dams so that wildlife has permanent water inside Zulia through the dry season, and an early-burn programme that turns the annual fires from a threat into a tool.",
    photo: photos.pool,
  },
  {
    title: "Knowing the place",
    body: "A baseline aerial census, vegetation mapping and a ten-year forest management plan, so that every decision about hunting quotas, lodge sites and grazing rests on counted animals and surveyed ground.",
    photo: photos.inselberg,
  },
  {
    title: "Neighbours first",
    body: "Managed dry-season grazing for Dodoth kraals on agreed blocks, a livestock-to-market scheme, scout jobs, local procurement and a share of every visitor's conservation fee. Zulia only survives if the people around it want it to.",
    photo: photos.track,
  },
  {
    title: "Access",
    body: "Management tracks from the Kidepo side and a licensed airstrip, so that a reserve that NFA's own staff could not enter in 2019 becomes forty-five minutes from Entebbe.",
    photo: photos.river,
  },
  {
    title: "Partners, not projects",
    body: "Lodge sites, a hunting block and research access offered to operators under long leases with conservation fees attached, and a Zulia Conservation Trust to receive grant funding for the protection work the commercial side cannot carry alone.",
    photo: photos.riverbed,
  },
];

export default function WhatWeDo() {
  return (
    <>
      <PageHero
        title="Six things, done in order"
        lede="Zulia has no infrastructure, no staff and no recent data. The first years are about putting those three things in place, in a sequence that earns the trust of the regulators and the communities before anything is built for visitors."
        photo={photos.plains}
      />
      <Section>
        <ol className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {programmes.map((p, i) => (
            <li key={p.title} className="grid grid-cols-[auto_1fr] gap-6">
              <span className="display pt-1 text-3xl text-kopje">{i + 1}</span>
              <div>
                <Photo photo={p.photo} className="mb-5 aspect-[16/9] overflow-hidden" sizes="(min-width:768px) 45vw, 100vw" />
                <h2 className="text-3xl">{p.title}</h2>
                <p className="prose-measure mt-3 leading-relaxed text-ink/80">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
      <Section tone="palm">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">The measure of success is simple: more animals, more water, fewer fires, and neighbours who are better off than before we came.</h2>
          <div className="flex flex-wrap gap-3 lg:justify-end"><Cta href="/opportunities" ghost>Work with us</Cta><Cta href="/donate" ghost>Fund a programme</Cta></div>
        </div>
      </Section>
    </>
  );
}
