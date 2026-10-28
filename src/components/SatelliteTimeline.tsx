"use client";
/**
 * Year-by-year satellite view of the reserve. Twelve Sentinel-2 scenes (2018–2026),
 * three renderings, a timeline, a two-date swipe comparison, and zoom/pan.
 * Images: /satellite/<date>_<rendering>.jpg; manifest and overlay in src/lib/satellite.ts.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { scenes, overlay, renderings, type Rendering } from "@/lib/satellite";

const { VW, VH } = overlay;
const K_MIN = 1, K_MAX = 6;
type T = { k: number; x: number; y: number };

export function SatelliteTimeline({ className = "" }: { className?: string }) {
  const [iA, setA] = useState(scenes.length - 1);
  const [iB, setB] = useState<number | null>(null);
  const [mode, setMode] = useState<"time" | "compare">("time");
  const [render, setRender] = useState<Rendering>("rgb");
  const [pos, setPos] = useState(50); // divider, % of stage width
  const [sites, setSites] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState<T>({ k: 1, x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: "pan" | "divider"; x: number; y: number; tx: number; ty: number } | null>(null);
  const pinch = useRef<{ d: number; k: number } | null>(null);
  const tRef = useRef(t); tRef.current = t;

  const src = (i: number, r: Rendering = render) => `/satellite/${scenes[i].date}_${r}.jpg`;
  const cmp = mode === "compare" && iB !== null;
  const A = scenes[iA], B = iB !== null ? scenes[iB] : null;

  // preload neighbours
  useEffect(() => { [iA - 1, iA + 1].forEach((i) => { if (i >= 0 && i < scenes.length) { const im = new Image(); im.src = `/satellite/${scenes[i].date}_${render}.jpg`; } }); }, [iA, render]);
  useEffect(() => { if (!playing) return; const id = setInterval(() => setA((i) => (i + 1) % scenes.length), 1400); return () => clearInterval(id); }, [playing]);

  // ---- zoom / pan in stage pixels ----
  const rect = () => stage.current!.getBoundingClientRect();
  const clamp = (n: T): T => {
    const r = rect(); const k = Math.min(K_MAX, Math.max(K_MIN, n.k));
    const x = Math.min(0, Math.max(r.width - r.width * k, n.x));
    const y = Math.min(0, Math.max(r.height - r.height * k, n.y));
    return { k, x, y };
  };
  const zoomAt = (f: number, px: number, py: number) => setT((s) => clamp({ k: s.k * f, x: px - (px - s.x) * f, y: py - (py - s.y) * f }));
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const wheel = (e: WheelEvent) => { e.preventDefault(); const r = el.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top); };
    el.addEventListener("wheel", wheel, { passive: false }); return () => el.removeEventListener("wheel", wheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDown = (e: React.PointerEvent) => {
    const r = rect(); const px = e.clientX - r.left;
    const nearDivider = cmp && Math.abs(px - (pos / 100) * r.width) < 22;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { kind: nearDivider ? "divider" : "pan", x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
    if (nearDivider) setPos(Math.max(0, Math.min(100, (px / r.width) * 100)));
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return; const r = rect();
    if (drag.current.kind === "divider") { setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))); return; }
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    setT((s) => clamp({ k: s.k, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  };
  const onUp = () => { drag.current = null; };
  const onTouchStart = (e: React.TouchEvent) => { if (e.touches.length === 2) pinch.current = { d: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY), k: tRef.current.k }; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinch.current) return; e.preventDefault();
    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const r = rect();
    const px = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left, py = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
    const target = pinch.current.k * (d / pinch.current.d);
    setT((s) => { const f = target / s.k; return clamp({ k: target, x: px - (px - s.x) * f, y: py - (py - s.y) * f }); });
  };

  // divider in world (image) percent: screen x -> world x
  const clipLeft = useMemo(() => {
    if (!stage.current) return pos; const r = rect(); const sx = (pos / 100) * r.width; const wx = (sx - t.x) / t.k; return Math.max(0, Math.min(100, (wx / r.width) * 100));
  }, [pos, t]);

  const t0 = Date.parse(scenes[0].date), t1 = Date.parse(scenes[scenes.length - 1].date);
  const px = (d: string) => ((Date.parse(d) - t0) / (t1 - t0)) * 100;
  const pick = (i: number, e: React.MouseEvent) => {
    if (mode === "compare" && (e.shiftKey || iB === null) && i !== iA) { setB(i); return; }
    if (mode === "compare" && i === iB) { setB(iA); }
    setA(i);
  };
  const toCompare = () => { setMode("compare"); if (iB === null || iB === iA) setB(iA > 0 ? 0 : 1); };

  return (
    <div className={className}>
      <div ref={stage} className="relative w-full overflow-hidden rounded-sm border border-bone/10 bg-[#15140f] select-none touch-none cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: `${VW}/${VH}` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={() => (pinch.current = null)} role="img" aria-label={`Satellite image of the Zulia reserve, ${A.label}`}>
        <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${t.x}px,${t.y}px) scale(${t.k})` }}>
          <img src={src(iA)} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          {cmp && <img src={src(iB!)} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 0 0 ${clipLeft}%)` }} />}
          <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
            <path d={overlay.paths.kidepo} fill="none" stroke="#c9bf8a" strokeWidth={1.2} strokeDasharray="6 5" vectorEffect="non-scaling-stroke" opacity={0.9} />
            <path d={overlay.paths.overlap} fill="#a0c8e0" fillOpacity={0.08} stroke="none" />
            <path d={overlay.paths.zulia} fill="none" stroke="#ef8a3c" strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
            <path d={`M${overlay.summit[0]},${overlay.summit[1] - 8}L${overlay.summit[0] + 7},${overlay.summit[1] + 5}L${overlay.summit[0] - 7},${overlay.summit[1] + 5}Z`} fill="#ef8a3c" transform={`translate(${overlay.summit[0]} ${overlay.summit[1]}) scale(${1 / t.k}) translate(${-overlay.summit[0]} ${-overlay.summit[1]})`} />
            {sites && <g fontFamily="var(--font-sans)" fontSize={13} fill="#f4efe6">
              {overlay.sites.map(([n, x, y]) => <g key={n} transform={`translate(${x} ${y}) scale(${1 / t.k})`}><circle r={5} fill="#ef8a3c" stroke="#1f1d1a" strokeWidth={1.5} /><text x={8} y={4} style={{ paintOrder: "stroke" }} stroke="#1f1d1a" strokeWidth={3}>{n}</text></g>)}
            </g>}
          </svg>
        </div>
        {/* fixed chrome */}
        <div className="pointer-events-none absolute left-3 top-3 border border-bone/15 bg-[#1f1d1a]/80 px-2.5 py-1.5 text-xs text-bone backdrop-blur"><span className="display block text-base">{A.label}</span>{A.season === "dry" ? "dry season" : "wet season"}</div>
        {cmp && B && <div className="pointer-events-none absolute right-3 top-3 border border-bone/15 bg-[#1f1d1a]/80 px-2.5 py-1.5 text-right text-xs text-bone backdrop-blur"><span className="display block text-base">{B.label}</span>{B.season === "dry" ? "dry season" : "wet season"}</div>}
        {cmp && <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-dawn shadow-[0_0_0_1px_rgba(0,0,0,.35)]" />
          <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-dawn text-lg text-ink shadow-lg">⇔</div>
        </div>}
        <div className="absolute left-3 bottom-3 flex flex-col overflow-hidden rounded-md border border-bone/20 bg-[#1f1d1a]/90 text-bone">
          <button type="button" aria-label="Zoom in" onClick={(e) => { e.stopPropagation(); const r = rect(); zoomAt(1.5, r.width / 2, r.height / 2); }} onPointerDown={(e) => e.stopPropagation()} className="grid h-9 w-9 place-items-center text-lg hover:bg-bone/10">+</button>
          <button type="button" aria-label="Zoom out" onClick={(e) => { e.stopPropagation(); const r = rect(); zoomAt(1 / 1.5, r.width / 2, r.height / 2); }} onPointerDown={(e) => e.stopPropagation()} className="grid h-9 w-9 place-items-center border-t border-bone/20 text-lg hover:bg-bone/10">−</button>
          <button type="button" aria-label="Reset view" onClick={(e) => { e.stopPropagation(); setT({ k: 1, x: 0, y: 0 }); }} onPointerDown={(e) => e.stopPropagation()} className="grid h-9 w-9 place-items-center border-t border-bone/20 text-xs hover:bg-bone/10">⟲</button>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 text-[11px] text-bone/50">scroll or pinch to zoom · drag to pan</div>
      </div>

      {/* controls */}
      <div className="mt-4 grid gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="inline-flex overflow-hidden rounded-full border border-bone/20 text-sm">
            <button type="button" onClick={() => setMode("time")} aria-pressed={mode === "time"} className={`px-3.5 py-1.5 ${mode === "time" ? "bg-dawn text-ink" : "text-bone/60 hover:text-bone"}`}>Timeline</button>
            <button type="button" onClick={toCompare} aria-pressed={mode === "compare"} className={`px-3.5 py-1.5 ${mode === "compare" ? "bg-dawn text-ink" : "text-bone/60 hover:text-bone"}`}>Compare two dates</button>
          </div>
          <div className="inline-flex overflow-hidden rounded-full border border-bone/20 text-sm">
            {renderings.map((r) => <button key={r.key} type="button" onClick={() => setRender(r.key)} aria-pressed={render === r.key} className={`px-3.5 py-1.5 ${render === r.key ? "bg-dawn text-ink" : "text-bone/60 hover:text-bone"}`}>{r.label}</button>)}
          </div>
          <div className="flex gap-2 text-sm">
            <button type="button" disabled={iA === 0} onClick={() => setA(iA - 1)} className="rounded-full border border-bone/20 px-3 py-1.5 disabled:opacity-30">◀ Older</button>
            <button type="button" disabled={iA === scenes.length - 1} onClick={() => setA(iA + 1)} className="rounded-full border border-bone/20 px-3 py-1.5 disabled:opacity-30">Newer ▶</button>
            <button type="button" onClick={() => setPlaying(!playing)} className="rounded-full border border-bone/20 px-3 py-1.5">{playing ? "Stop" : "Play"}</button>
            <button type="button" onClick={() => setSites(!sites)} aria-pressed={sites} className={`rounded-full border px-3 py-1.5 ${sites ? "border-dawn/70 bg-dawn/15" : "border-bone/20"}`}>Lodge sites</button>
          </div>
        </div>
        <div className="relative px-1.5 pb-7 pt-5">
          <div className="relative h-0.5 bg-bone/15">
            {scenes.map((s, i) => (
              <button key={s.date} type="button" title={s.label} aria-label={s.label} onClick={(e) => pick(i, e)}
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${i === iA ? "h-4 w-4 border-dawn bg-dawn" : cmp && i === iB ? "h-4 w-4 border-bone bg-bone" : `h-3 w-3 bg-granite ${s.season === "dry" ? "border-sand/80" : "border-[#8fae7a]"}`}`}
                style={{ left: `${px(s.date)}%` }} />
            ))}
          </div>
          <div className="absolute inset-x-1.5 top-9 h-4 text-[11px] text-bone/60 tabular-nums">
            {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => <span key={y} className="absolute -translate-x-1/2" style={{ left: `${px(`${y}-01-01`)}%` }}>{y}</span>)}
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 text-xs text-bone/60">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border-2 border-sand/80 align-[-1px]" />Dry season</span>
            <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border-2 border-[#8fae7a] align-[-1px]" />Wet season</span>
            {mode === "compare" && <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border-2 border-bone bg-bone align-[-1px]" />Second date (click a dot; shift-click to change it)</span>}
          </div>
          <div className="flex gap-6">
            <span><b className="display block text-xl text-bone">{A.ndvi.toFixed(2)}</b>mean NDVI, {A.label}</span>
            {cmp && B && <><span><b className="display block text-xl text-bone">{B.ndvi.toFixed(2)}</b>mean NDVI, {B.label}</span><span><b className="display block text-xl text-bone">{(A.ndvi - B.ndvi > 0 ? "+" : "") + (A.ndvi - B.ndvi).toFixed(2)}</b>difference</span></>}
          </div>
        </div>
        <p className="text-xs leading-relaxed text-bone/50">Copernicus Sentinel-2 L2A, 10 m. True colour is bands 4-3-2; NDVI from bands 8 and 4 (sand = bare, deep green = dense canopy, grey = cloud); SWIR is bands 12-8-4, where fresh burns read dark red-brown and water near black. Orange outline: licensed area (NFA 2021); dashed: Kidepo Valley NP; triangle: Mount Zulia.</p>
      </div>
    </div>
  );
}
