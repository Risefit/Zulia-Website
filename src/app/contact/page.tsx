import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero, Section } from "@/components/ui";
import { Social } from "@/components/Social";
import { ContactForm } from "./ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <PageHero
        title="Talk to us"
        lede="We are a small team and we answer our own email. Say who you are and what you have in mind, and we will come back to you with a straight answer."
      />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <dl className="space-y-6">
              <div><dt className="text-sm text-ink/60">Email</dt><dd className="display text-2xl"><a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></dd></div>
              <div><dt className="text-sm text-ink/60">Phone and WhatsApp</dt><dd className="display text-2xl"><a href={site.phoneHref} className="hover:underline">{site.phone}</a></dd></div>
              <div><dt className="text-sm text-ink/60">Reserve</dt><dd>{site.address}</dd></div>
              <div><dt className="text-sm text-ink/60">Post</dt><dd>{site.postal}</dd></div>
            </dl>
            <Social className="mt-10" />
          </div>
          <Suspense><ContactForm /></Suspense>
        </div>
      </Section>
    </>
  );
}
