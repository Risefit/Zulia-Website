"use client";
/**
 * Two-minute explainer. A master clock drives scenes; each scene declares [start, end]
 * and renders with a local progress value. Video clips are seeked at scene start.
 * ?record=1 starts automatically (used for MP4 rendering); otherwise a play button.
 */
import { useEffect, useRef, useState } from "react";
import { ZoomMap } from "./ZoomMap";

const DURATION = 120;

type SceneProps = { p: number; t: number }; // p: 0..1 in scene, t: seconds in scene

function Fade({ p, inD = 0.08, outD = 0.08, children, className = "" }: { p: number; inD?: number; outD?: number; children: React.ReactNode; className?: string }) {
  const o = p < inD ? p / inD : p > 1 - outD ? (1 - p) / outD : 1;
  return <div className={`absolute inset-0 ${className}`} style={{ opacity: Math.max(0, Math.min(1, o)) }}>{children}</div>;
}

function Line({ p, at, children, className = "" }: { p: number; at: number; children: React.ReactNode; className?: string }) {
  const o = Math.max(0, Math.min(1, (p - at) / 0.06));
  return <span className={`block ${className}`} style={{ opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>{children}</span>;
}

function Clip({ src, t, from = 0, scale = 1.06 }: { src: string; t: number; from?: number; scale?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.currentTime = from; v.play().catch(() => {});
    return () => { v.pause(); };
  }, [from]);
  return <video ref={ref} src={src} muted playsInline preload="auto" className="h-full w-full object-cover" style={{ transform: `scale(${scale + t * 0.004})` }} />;
}

function Still({ src, t, dur, pan = 1 }: { src: string; t: number; dur: number; pan?: number }) {
  const k = Math.min(1, t / dur);
  return <img src={src} alt="" className="h-full w-full object-cover" style={{ transform: `scale(${1.08 - 0.06 * k}) translateX(${pan * (1 - k) * 1.5}%)` }} />;
}

const scenes: { start: number; end: number; render: (s: SceneProps) => React.ReactNode }[] = [
  // 0 — title
  { start: 0, end: 9, render: ({ p }) => (
    <Fade p={p} inD={0.15} outD={0.12} className="bg-granite text-bone">
      <div className="contours text-kopje opacity-50" />
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <img src="/mark-light.svg" alt="" className="h-28 w-28" style={{ opacity: Math.min(1, p / 0.3) }} />
        <Line p={p} at={0.25} className="display mt-8 text-[7vw] leading-none">Zulia</Line>
        <Line p={p} at={0.45} className="mt-5 text-[1.4vw] tracking-[0.25em] text-bone/70">4° NORTH · 34° EAST · UGANDA</Line>
      </div>
    </Fade>
  ) },
  // 1 — map zoom
  { start: 9, end: 30, render: ({ p }) => (
    <Fade p={p} inD={0.05} outD={0.08} className="bg-granite text-bone">
      <div className="contours text-kopje opacity-40" />
      <div className="relative grid h-full grid-cols-[1fr_1fr] items-center px-[6vw]">
        <div className="max-w-[36vw]">
          <Line p={p} at={0.05} className="display text-[3.6vw] leading-tight">In the far north-east of Uganda,</Line>
          <Line p={p} at={0.32} className="display text-[3.6vw] leading-tight">where the country meets South Sudan and Kenya,</Line>
          <Line p={p} at={0.62} className="display text-[3.6vw] leading-tight text-dawn">lies a reserve almost no one has seen.</Line>
        </div>
        <div className="aspect-square h-[84vh] justify-self-end"><ZoomMap className="map-vignette h-full w-full" /></div>
      </div>
    </Fade>
  ) },
  // 2 — aerial plains
  { start: 30, end: 48, render: ({ p, t }) => (
    <Fade p={p} className="bg-black text-bone">
      <Clip src="/media/aerial-zulia-plains.mp4" t={t} from={0} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-[10vh] left-[6vw] max-w-[50vw]">
        <Line p={p} at={0.08} className="display text-[5vw] leading-none">1,029 square kilometres.</Line>
        <Line p={p} at={0.38} className="display text-[5vw] leading-none">Gazetted in 1942.</Line>
        <Line p={p} at={0.66} className="display text-[5vw] leading-none text-dawn">Never managed. Never developed.</Line>
      </div>
    </Fade>
  ) },
  // 3 — inselbergs
  { start: 48, end: 62, render: ({ p, t }) => (
    <Fade p={p} className="bg-black text-bone">
      <Clip src="/media/aerial-zulia-plains.mp4" t={t} from={36} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
      <div className="absolute left-[6vw] top-[12vh] max-w-[44vw]">
        <Line p={p} at={0.1} className="text-[1.3vw] tracking-[0.2em] text-bone/70">THE KIDEPO WATER TOWER</Line>
        <Line p={p} at={0.22} className="display mt-4 text-[3.4vw] leading-tight">Granite hills rising to 2,149 metres. Rivers of sand and borassus palm. The dry-season range of Kidepo's elephant, buffalo, giraffe and lion.</Line>
      </div>
    </Fade>
  ) },
  // 4 — stills: river, palms, rangers
  { start: 62, end: 80, render: ({ p, t }) => {
    const i = Math.min(2, Math.floor(t / 6));
    const srcs = ["/media/kidepo-riverbed.jpg", "/media/borassus-pool.jpg", "/media/rangers-kopje.jpg"];
    const lines = ["Too remote to reach.", "Too insecure to manage.", "And so, still intact."];
    return (
      <Fade p={p} className="bg-black text-bone">
        <Still key={i} src={srcs[i]} t={t - i * 6} dur={6} pan={i % 2 ? -1 : 1} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-end justify-center pb-[12vh]">
          <p key={i} className="display text-[4.6vw]" style={{ opacity: Math.min(1, (t - i * 6) / 0.6) }}>{lines[i]}</p>
        </div>
      </Fade>
    );
  } },
  // 5 — the mandate
  { start: 80, end: 92, render: ({ p }) => (
    <Fade p={p} className="bg-granite text-bone">
      <div className="contours text-kopje opacity-40" />
      <div className="relative flex h-full items-center px-[8vw]">
        <div className="max-w-[70vw]">
          <Line p={p} at={0.05} className="display text-[3.8vw] leading-tight">In 2022 the National Forestry Authority granted Zulia Conservancy a fifty-year licence to manage the whole reserve.</Line>
          <Line p={p} at={0.5} className="display mt-8 text-[3.8vw] leading-tight text-dawn">Not to own it. To bring it back.</Line>
        </div>
      </div>
    </Fade>
  ) },
  // 6 — the plan over river aerial
  { start: 92, end: 108, render: ({ p, t }) => {
    const items = ["Protect it.", "Water it.", "Count it.", "Share it with its neighbours.", "Open it, lightly.", "Build it with partners."];
    return (
      <Fade p={p} className="bg-black text-bone">
        <Clip src="/media/aerial-kidepo-river.mp4" t={t} from={0} />
        <div className="absolute inset-0 bg-black/45" />
        <ul className="absolute inset-0 flex flex-col items-start justify-center gap-[1.2vh] px-[10vw]">
          {items.map((it, i) => <Line key={it} p={p} at={0.06 + i * 0.13} className="display text-[3.6vw] leading-none">{it}</Line>)}
        </ul>
      </Fade>
    );
  } },
  // 7 — partners
  { start: 108, end: 115, render: ({ p }) => (
    <Fade p={p} className="bg-sand text-ink">
      <div className="contours text-kopje opacity-40" />
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <Line p={p} at={0.05} className="text-[1.3vw] tracking-[0.2em] text-ink/60">WE ARE LOOKING FOR</Line>
        <Line p={p} at={0.18} className="display mt-5 text-[3.4vw] leading-tight">Lodge operators · Hunting outfitters</Line>
        <Line p={p} at={0.36} className="display text-[3.4vw] leading-tight">Conservation funds · Livestock partners</Line>
        <Line p={p} at={0.54} className="display text-[3.4vw] leading-tight">Researchers · Aviators</Line>
      </div>
    </Fade>
  ) },
  // 8 — close
  { start: 115, end: 120, render: ({ p }) => (
    <Fade p={p} inD={0.2} outD={0.0} className="bg-granite text-bone">
      <div className="contours text-kopje opacity-50" />
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <img src="/mark-light.svg" alt="" className="h-24 w-24" />
        <p className="display mt-6 text-[3.2vw]">Zulia Conservancy</p>
        <p className="mt-3 text-[1.4vw] tracking-[0.2em] text-bone/70">ZULIACONSERVANCY.ORG</p>
      </div>
    </Fade>
  ) },
];

export function Film({ autostart = false }: { autostart?: boolean }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(autostart);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const s = (now - startRef.current) / 1000;
      setT(Math.min(DURATION, s));
      if (s < DURATION) raf = requestAnimationFrame(tick); else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const active = scenes.filter((s) => t >= s.start && t < s.end + 0.001);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black text-bone" data-film data-t={t.toFixed(2)}>
      {active.map((s) => {
        const local = t - s.start; const p = local / (s.end - s.start);
        return <div key={s.start} className="absolute inset-0">{s.render({ p, t: local })}</div>;
      })}
      {!playing && (
        <button
          onClick={() => { startRef.current = null; setT(0); setPlaying(true); }}
          className="absolute inset-0 grid place-items-center bg-black/40"
          aria-label="Play the two-minute film"
        >
          <span className="grid h-24 w-24 place-items-center rounded-full border border-bone/70 bg-black/30 backdrop-blur">
            <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
          </span>
        </button>
      )}
      <div className="absolute bottom-0 left-0 h-[3px] bg-bone/70" style={{ width: `${(t / DURATION) * 100}%` }} />
    </div>
  );
}
