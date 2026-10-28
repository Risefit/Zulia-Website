import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { Form } from "@/components/Form";
import { photos } from "@/lib/site";

export const metadata: Metadata = { title: "Donate" };

const uses = [
  { what: "A community scout", cost: "US$2,400 a year", detail: "salary, kit and rations for one scout recruited from a neighbouring kraal" },
  { what: "A ranger post", cost: "US$18,000", detail: "a permanent two-room post with water, solar and radio inside the reserve" },
  { what: "A borehole", cost: "US$25,000", detail: "drilled, solar-pumped and troughed, giving wildlife year-round water" },
  { what: "One hour of aerial patrol", cost: "US$450", detail: "fire, incursion and wildlife monitoring over country no vehicle can reach" },
  { what: "The baseline census", cost: "US$60,000", detail: "the first full aerial count of Zulia's wildlife, the basis for every quota and plan" },
];

export default function Donate() {
  return (
    <>
      <PageHero
        title="Fund the first years"
        lede="Tourism and partnerships will carry Zulia in time. Rangers, water and fire management are needed now, before there is a single bed to sell. That gap is what donations close."
        photo={photos.giraffe}
      />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">What money does here</h2>
            <ul className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
              {uses.map((u) => (
                <li key={u.what} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div><p className="font-medium">{u.what}</p><p className="text-sm text-ink/70">{u.detail}</p></div>
                  <p className="display text-xl sm:text-right">{u.cost}</p>
                </li>
              ))}
            </ul>
            <p className="prose-measure mt-6 text-sm text-ink/70">
              Figures are planning estimates for Karamoja in 2026. Donations will be received by the Zulia Conservation Trust once it is
              registered; until then we are recording pledges and will come back to each donor with the Trust's details and a receipt.
            </p>
          </div>
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">Pledge support</h2>
            <p className="mt-4 text-ink/80">Tell us what you would like to fund. Nothing is charged here.</p>
            <div className="mt-6">
              <Form
                subject="Zulia Conservancy — pledge of support"
                submitLabel="Send my pledge"
                fields={[
                  { name: "name", label: "Your name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "organisation", label: "Organisation (if any)" },
                  { name: "amount", label: "Amount you have in mind", placeholder: "e.g. US$5,000" },
                  { name: "purpose", label: "What you would like it to fund", type: "select", options: ["Scouts and rangers", "Water", "Fire management", "Aerial patrol and census", "Community programme", "Wherever it is most needed"] },
                  { name: "message", label: "Anything else", type: "textarea" },
                ]}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
