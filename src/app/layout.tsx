import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Uganda`, template: `%s — ${site.name}` },
  description: "Zulia Conservancy holds a 50-year licence to manage and restore the 1,029 km² Zulia Central Forest Reserve in Karamoja, on Uganda's border with South Sudan and Kenya.",
  openGraph: { siteName: site.name, type: "website", images: ["/media/aerial-inselberg.jpg"] },
  icons: { icon: "/mark.svg" },
  robots: { index: false, follow: false }, // remove once the site is public
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bone focus:px-3 focus:py-2">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
