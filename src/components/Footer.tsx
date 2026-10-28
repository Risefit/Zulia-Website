import Link from "next/link";
import { Logo } from "./Logo";
import { Social } from "./Social";
import { nav, site } from "@/lib/site";

const partners = [
  { name: "National Forestry Authority, Uganda", short: "National Forestry Authority", href: "https://www.nfa.go.ug/", logo: "/partners/nfa-light.png", h: "h-10" },
  { name: "Uganda Wildlife Authority", short: "Uganda Wildlife Authority", href: "https://ugandawildlife.org/", logo: "/partners/uwa-light.png", h: "h-16" },
];

const supporters = [
  { name: "Kampala Executive Aviation", short: "Kampala Executive Aviation", href: "https://www.flykea.com", logo: "/partners/kea-light.png", h: "h-10" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-granite text-bone on-dark">
      <div className="contours text-kopje opacity-25" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="prose-measure mt-6 max-w-sm text-bone/80">
            {site.legalName} holds the National Forestry Authority licence for the collaborative management
            and development of ecotourism in Zulia Central Forest Reserve, Kaabong District.
          </p>
          <Social className="mt-8" />
        </div>
        <div>
          <p className="mb-4 text-sm text-bone/60">Pages</p>
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-sm text-bone/60">Reach us</p>
          <ul className="space-y-2">
            <li><a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></li>
            <li><a href={site.phoneHref} className="hover:underline">{site.phone}</a></li>
            <li className="text-bone/80">{site.address}</li>
            <li className="text-bone/80">{site.postal}</li>
          </ul>
        </div>
      </div>
      {/* Partners / regulators */}
      <div className="relative border-t border-bone/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-6 px-5 py-8 sm:px-8">
          <p className="text-xs uppercase tracking-[0.18em] text-bone/50">Licensed and regulated by</p>
          {partners.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noreferrer" title={p.name} aria-label={p.name}
              className="group inline-flex items-center gap-3 opacity-80 transition hover:opacity-100">
              <img src={p.logo} alt="" className={`${p.h} w-auto`} />
              <span className="text-sm text-bone/70 group-hover:text-bone">{p.short}</span>
            </a>
          ))}
          <span aria-hidden className="hidden h-10 w-px bg-bone/15 sm:block" />
          <p className="text-xs uppercase tracking-[0.18em] text-bone/50">Partners</p>
          {supporters.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noreferrer" title={p.name} aria-label={p.name}
              className="group inline-flex items-center gap-3 opacity-80 transition hover:opacity-100">
              <img src={p.logo} alt="" className={`${p.h} w-auto`} />
            </a>
          ))}
        </div>
      </div>
      <div className="relative border-t border-bone/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-bone/55 sm:px-8">
          <span>© {new Date().getFullYear()} {site.legalName}. NFA Licence No. 30.</span>
          <span>Wildlife photographs: Creative Commons contributors on Wikimedia Commons, credited where shown. Landscape photography and aerial footage: Zulia Conservancy.</span>
        </div>
      </div>
    </footer>
  );
}
