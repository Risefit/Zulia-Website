import Link from "next/link";
import type { Photo as PhotoT } from "@/lib/site";

export function Photo({ photo, className = "", sizes = "100vw", priority = false, caption }: { photo: PhotoT; className?: string; sizes?: string; priority?: boolean; caption?: string }) {
  const credit = photo.credit ? `${photo.credit} · ${photo.licence}` : null;
  return (
    <figure className={`relative ${className}`}>
      {/* Plain <img>: remote Commons files are hot-linked; local files are already optimised. */}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        className="h-full w-full object-cover"
        style={photo.pos ? { objectPosition: photo.pos } : undefined}
      />
      {(caption || credit) && (
        <figcaption className="caption mt-2 flex flex-wrap justify-between gap-x-4">
          <span>{caption}</span>
          {credit && (
            <span>
              Photo: {photo.source ? <a href={photo.source} className="underline" target="_blank" rel="noopener noreferrer">{photo.credit}</a> : photo.credit}, {photo.licence}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export function PageHero({ title, lede, photo }: { title: string; lede: string; photo?: PhotoT }) {
  return (
    <section className="relative overflow-hidden bg-sand">
      <div className="contours text-kopje opacity-30" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-40">
        <div>
          <h1 className="text-[clamp(2.6rem,6vw,5.2rem)]">{title}</h1>
          <p className="prose-measure mt-6 text-lg leading-relaxed text-ink/80">{lede}</p>
        </div>
        {photo && <Photo photo={photo} className="aspect-[4/3] overflow-hidden rounded-sm" sizes="(min-width:1024px) 45vw, 100vw" priority />}
      </div>
    </section>
  );
}

export function Section({ children, className = "", tone = "bone", id, compact = false }: { children: React.ReactNode; className?: string; tone?: "bone" | "sand" | "granite" | "palm" | "sage"; id?: string; compact?: boolean }) {
  const tones = {
    bone: "bg-bone text-ink",
    sand: "bg-sand text-ink",
    granite: "bg-granite text-bone on-dark",
    palm: "bg-palm text-bone on-dark",
    sage: "bg-[#dedcc8] text-ink border-y border-ink/10", /* bone tinted toward olive: a quiet change of ground */
  }[tone];
  return (
    <section id={id} className={`${tones} ${className}`}>
      <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${compact ? "py-12 lg:py-14" : "py-20 lg:py-28"}`}>{children}</div>
    </section>
  );
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="prose-measure text-xl leading-relaxed">{children}</p>;
}

export function Cta({ href, children, ghost = false }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  return <Link href={href} className={`btn ${ghost ? "btn-ghost" : "btn-solid"}`}>{children}</Link>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="display text-[clamp(1.6rem,2.6vw,2.8rem)] leading-none">{value.replace(" km²", "\u00a0km²").replace(" yrs", "\u00a0yrs").replace(" m", "\u00a0m")}</div>
      <div className="mt-2 text-sm opacity-70">{label}</div>
    </div>
  );
}
