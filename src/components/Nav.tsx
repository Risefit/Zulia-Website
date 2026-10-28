"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav } from "@/lib/site";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const dark = path === "/" || path === "/film";
  useEffect(() => setOpen(false), [path]);

  return (
    <header className={`absolute inset-x-0 top-0 z-40 ${dark ? "text-bone on-dark" : "text-ink"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo dark={dark} />
        <nav className="hidden items-center gap-7 text-[0.92rem] lg:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`hover:underline ${path === n.href ? "underline" : ""}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/opportunities" className={`btn ${dark ? "btn-ghost" : "btn-solid"}`}>Partner with us</Link>
        </nav>
        <button
          className="lg:hidden rounded-full border border-current px-4 py-2 text-sm"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="lg:hidden bg-granite text-bone on-dark" aria-label="Primary">
          <ul className="mx-auto max-w-7xl px-5 pb-8 pt-2 sm:px-8">
            {nav.map((n) => (
              <li key={n.href} className="border-t border-bone/15">
                <Link href={n.href} className="display block py-4 text-3xl">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
