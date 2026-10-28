import Link from "next/link";

export function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Zulia Conservancy home">
      {/* mark.svg strokes in black; invert on dark grounds */}
      <img src={dark ? "/mark-light.svg" : "/mark.svg"} alt="" width={40} height={40} className="h-10 w-10" />
      <span className="leading-none">
        <span className="display block text-[1.35rem]">Zulia Conservancy</span>
        <span className="block text-[0.68rem] tracking-[0.12em] opacity-70">UGANDA</span>
      </span>
    </Link>
  );
}
