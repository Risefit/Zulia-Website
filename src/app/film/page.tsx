import type { Metadata } from "next";
import { Film } from "@/components/Film";
import { Section, Cta } from "@/components/ui";

export const metadata: Metadata = { title: "Film" };

export default async function FilmPage({ searchParams }: { searchParams: Promise<{ record?: string }> }) {
  const { record } = await searchParams;
  const recording = record === "1";
  if (recording) {
    return <div data-record className="fixed inset-0 z-[100] bg-black"><Film autostart /></div>;
  }
  return (
    <>
      <section className="bg-granite pt-24 text-bone on-dark">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h1 className="text-[clamp(2rem,4vw,3.4rem)]">Zulia in two minutes</h1>
          <p className="prose-measure mt-4 text-bone/80">Where it is, what it is, and what we intend to do about it.</p>
          <div className="mt-8 overflow-hidden rounded-sm"><Film /></div>
        </div>
        <div className="h-16" />
      </section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <h2 className="text-[clamp(1.9rem,3.5vw,3rem)]">If the film raised a question, the concession page probably answers it.</h2>
          <div className="flex flex-wrap gap-3 lg:justify-end"><Cta href="/concession" ghost>The concession</Cta><Cta href="/opportunities">Opportunities</Cta></div>
        </div>
      </Section>
    </>
  );
}
