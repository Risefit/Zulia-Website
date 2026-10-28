"use client";
/**
 * Layered, zoomable map of the reserve: boundaries, water, roads and tracks,
 * peaks, settlements, access points and (optionally) indicative lodge sites.
 * Data: /geo/zulia.json (boundaries), /geo/features.json (OpenStreetMap features
 * in the 33.68–34.16 E, 3.85–4.25 N window, simplified to ~40 m) and
 * /geo/africa.json (country outlines for context when zoomed out).
 * Zoom: wheel / pinch / drag / buttons, limited to 0.45×–6× of the reserve frame.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";

type Pt = [number, number];
type Line = { n?: string | null; c: Pt[]; k?: string; i?: number };
type Point = { n?: string | null; c: Pt; k?: string; e?: string | number; o?: number; w?: number; g?: boolean; i?: number; d?: number };
type Layers = {
  roads: Line[]; tracks: Line[]; paths: Line[]; rivers: Line[]; streams: Line[]; ridges: Line[];
  springs: Point[]; peaks: Point[]; settlements: Point[]; pois: Point[]; sites: Point[]; access: Point[];
};

type LayerKey = "water" | "streams" | "roads" | "tracks" | "peaks" | "settlements" | "access" | "sites" | "outside";
const LAYERS: { key: LayerKey; label: string; swatch: string; on: boolean }[] = [
  { key: "water", label: "Rivers and springs", swatch: "#6fb7e0", on: true },
  { key: "streams", label: "Seasonal streams", swatch: "#4f8fb0", on: true },
  { key: "roads", label: "Roads", swatch: "#f0c070", on: true },
  { key: "tracks", label: "Tracks and paths", swatch: "#b89060", on: true },
  { key: "peaks", label: "Peaks and ridges", swatch: "#f4efe6", on: true },
  { key: "settlements", label: "Settlements", swatch: "#e9e1d2", on: false },
  { key: "access", label: "Airstrips and towns", swatch: "#ef8a3c", on: true },
  { key: "sites", label: "Indicative lodge sites", swatch: "#ef8a3c", on: false },
  { key: "outside", label: "Surroundings outside the reserve", swatch: "#8a6a4b", on: false },
];

const W = 1000, H = 900;
const K_MIN = 0.4, K_MAX = 6;
type T = { k: number; x: number; y: number };

export function FeatureMap({ className = "" }: { className?: string }) {
  const [bounds, setBounds] = useState<FeatureCollection | null>(null);
  const [layers, setLayers] = useState<Layers | null>(null);
  const [africa, setAfrica] = useState<FeatureCollection | null>(null);
  const [on, setOn] = useState<Record<LayerKey, boolean>>(() => Object.fromEntries(LAYERS.map((l) => [l.key, l.on])) as Record<LayerKey, boolean>);
  const [hover, setHover] = useState<string | null>(null);
  const [t, setT] = useState<T>({ k: 1, x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean } | null>(null);
  const pinch = useRef<{ d: number; k: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/geo/zulia.json").then((r) => r.json()),
      fetch("/geo/features.json").then((r) => r.json()),
      fetch("/geo/africa.json").then((r) => r.json()),
    ]).then(([b, f, a]) => { setBounds(b); setLayers(f); setAfrica(a); });
  }, []);

  const zuliaFeature = bounds?.features.find((f) => f.properties?.name?.startsWith("Zulia Central"));
  // Base frame: the reserve with a margin; zooming is applied on top of this.
  const proj = useMemo(() => zuliaFeature ? geoMercator().fitExtent([[60, 60], [W - 60, H - 90]], zuliaFeature as never) : geoMercator(), [zuliaFeature]);
  const path = useMemo(() => geoPath(proj), [proj]);

  // ---- zoom helpers (SVG user units) ----
  const clamp = (n: T): T => {
    const k = Math.min(K_MAX, Math.max(K_MIN, n.k));
    // keep the reserve centre within the frame
    const cx = W / 2, cy = H / 2, lim = 0.45;
    const x = Math.min(cx * (1 + lim) - cx * k, Math.max(cx * (1 - lim) - cx * k, n.x));
    const y = Math.min(cy * (1 + lim) - cy * k, Math.max(cy * (1 - lim) - cy * k, n.y));
    return { k, x, y };
  };
  const toUser = (e: { clientX: number; clientY: number }): Pt => {
    const r = svgRef.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  };
  const zoomAt = (factor: number, px: number, py: number) => setT((s) => clamp({ k: s.k * factor, x: px - (px - s.x) * factor, y: py - (py - s.y) * factor }));
  const zoomBy = (factor: number) => zoomAt(factor, W / 2, H / 2);
  const zoomAtRef = useRef(zoomAt); zoomAtRef.current = zoomAt;

  useEffect(() => {
    const el = svgRef.current; if (!el) return;
    const wheel = (e: WheelEvent) => { e.preventDefault(); const [px, py] = toUser(e); zoomAtRef.current(Math.exp(-e.deltaY * 0.0015), px, py); };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture?.(e.pointerId); const [x, y] = toUser(e); drag.current = { x, y, tx: t.x, ty: t.y, moved: false }; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return; const [x, y] = toUser(e); const dx = x - drag.current.x, dy = y - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    setT((s) => clamp({ k: s.k, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  };
  const onPointerUp = () => { drag.current = null; };
  const onTouchStart = (e: React.TouchEvent) => { if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); pinch.current = { d, k: t.k }; } };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinch.current) { e.preventDefault(); const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const [px, py] = toUser({ clientX: (e.touches[0].clientX + e.touches[1].clientX) / 2, clientY: (e.touches[0].clientY + e.touches[1].clientY) / 2 });
      const target = pinch.current.k * (d / pinch.current.d); setT((s) => { const f = target / s.k; return clamp({ k: target, x: px - (px - s.x) * f, y: py - (py - s.y) * f }); }); }
  };
  const onTouchEnd = () => { pinch.current = null; };

  if (!bounds || !layers || !africa) {
    return <div className={`${className} grid place-items-center text-bone/40 text-sm`} style={{ aspectRatio: `${W}/${H}` }}>Loading map…</div>;
  }

  const find = (p: string) => bounds.features.find((f) => f.properties?.name?.startsWith(p)) as Feature;
  const zulia = find("Zulia Central"), overlap = find("Dual"), kidepo = find("Kidepo Valley");
  const toggle = (k: LayerKey) => setOn((s) => ({ ...s, [k]: !s[k] }));
  const line = (c: Pt[]) => path({ type: "LineString", coordinates: c }) ?? "";
  const xy = (c: Pt) => proj(c) as [number, number];
  const keep = <X extends { i?: number }>(arr: X[]) => (on.outside ? arr : arr.filter((f) => f.i === 1));
  const L = {
    roads: keep(layers.roads), tracks: keep(layers.tracks), paths: keep(layers.paths), rivers: keep(layers.rivers), streams: keep(layers.streams),
    ridges: keep(layers.ridges), springs: keep(layers.springs), peaks: keep(layers.peaks), settlements: keep(layers.settlements), pois: keep(layers.pois),
  };
  const k = t.k, inv = 1 / k;
  // A marker that keeps its screen size: translate in map space, scale back by 1/k
  const M = ({ at, children }: { at: Pt; children: React.ReactNode }) => { const [x, y] = xy(at); return <g transform={`translate(${x},${y}) scale(${inv})`}>{children}</g>; };
  const font = { fontFamily: "var(--font-sans)" } as const;
  const halo = { paintOrder: "stroke" as const, stroke: "#1f1d1a", strokeWidth: 3 };
  const countries = africa.features.filter((f) => ["Uganda", "Kenya", "South Sudan", "Ethiopia"].includes(f.properties?.name));
  // scale bar: pick a round length that draws between 90 and 220 units
  const [scaleKm, scaleLen] = (() => { const a = xy([33.70, 3.90]), b = xy([33.70 + 1 / 111.0, 3.90]); const perKm = (b[0] - a[0]) * k;
    for (const km of [1, 2, 5, 10, 20, 50]) { if (km * perKm >= 90) return [km, km * perKm]; } return [50, 50 * perKm]; })();

  return (
    <div className={className}>
      <div className="relative">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none cursor-grab active:cursor-grabbing" role="img" aria-label="Zoomable map of the Zulia reserve with toggleable layers"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <defs><clipPath id="fm-clip"><rect width={W} height={H} /></clipPath></defs>
          <rect width={W} height={H} fill="#1f1d1a" />
          <g clipPath="url(#fm-clip)">
            <g transform={`translate(${t.x},${t.y}) scale(${k})`}>
              {/* context: countries, faint */}
              <g opacity={k < 1.6 ? Math.min(1, (1.6 - k) / 0.8) : 0}>
                {countries.map((f, i) => <path key={i} d={path(f) ?? ""} fill={f.properties?.name === "Uganda" ? "#f4efe6" : "#f4efe6"} fillOpacity={f.properties?.name === "Uganda" ? 0.05 : 0.02} stroke="#f4efe6" strokeOpacity={0.35} strokeWidth={1.4} strokeDasharray="7 5" vectorEffect="non-scaling-stroke" />)}
                {[["Uganda", [33.55, 3.72]], ["South Sudan", [33.62, 4.28]], ["Kenya", [34.25, 3.78]]].map(([n, c]) => { const [x, y] = xy(c as Pt); return <text key={n as string} x={x} y={y} fontSize={15 * inv} letterSpacing={2} fill="#f4efe6" opacity={0.55} {...font} textAnchor="middle">{(n as string).toUpperCase()}</text>; })}
              </g>
              {/* boundaries */}
              <path d={path(kidepo) ?? ""} fill="#c9bf8a" fillOpacity={0.12} stroke="#c9bf8a" strokeWidth={1.2} strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
              <path d={path(overlap) ?? ""} fill="#a0c8e0" fillOpacity={0.14} stroke="none" />
              <path d={path(zulia) ?? ""} fill="#ef8a3c" fillOpacity={0.1} stroke="#ef8a3c" strokeWidth={2.4} vectorEffect="non-scaling-stroke" />

              {on.streams && <g stroke="#4f8fb0" strokeWidth={0.9} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.85}>
                {L.streams.map((l, i) => <path key={i} d={line(l.c)} vectorEffect="non-scaling-stroke"><title>{l.n ?? "Seasonal stream"}</title></path>)}
              </g>}
              {on.water && <g>
                <g stroke="#6fb7e0" strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeLinecap="round">
                  {L.rivers.map((l, i) => <path key={i} d={line(l.c)} vectorEffect="non-scaling-stroke"><title>{l.n ?? "River"}</title></path>)}
                </g>
                {L.springs.map((p, i) => <M key={i} at={p.c}><circle r={4.5} fill="#6fb7e0" stroke="#1f1d1a" strokeWidth={1} /><title>{p.n ?? "Spring"}</title></M>)}
              </g>}
              {on.tracks && <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                {L.tracks.map((l, i) => <path key={"t" + i} d={line(l.c)} stroke="#c9a070" strokeWidth={1.4} vectorEffect="non-scaling-stroke"><title>{l.n ?? "Track"}</title></path>)}
                {L.paths.map((l, i) => <path key={"p" + i} d={line(l.c)} stroke="#b89060" strokeWidth={1.1} strokeDasharray="2 4" vectorEffect="non-scaling-stroke"><title>{l.n ?? "Path"}</title></path>)}
              </g>}
              {on.roads && <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                {L.roads.map((l, i) => <path key={i} d={line(l.c)} stroke="#f0c070" strokeWidth={l.k === "primary" || l.k === "secondary" ? 2.6 : 1.5} vectorEffect="non-scaling-stroke"><title>{l.n ?? l.k}</title></path>)}
              </g>}
              {on.peaks && <g>
                {L.ridges.map((l, i) => <path key={"r" + i} d={line(l.c)} fill="none" stroke="#f4efe6" strokeWidth={1} strokeDasharray="1 3" opacity={0.7} vectorEffect="non-scaling-stroke" />)}
                {L.peaks.map((p, i) => <M key={i} at={p.c}><path d="M0,-6L5.5,4L-5.5,4Z" fill="#f4efe6" opacity={0.9} />{k > 2.2 && p.n && <text x={9} y={4} fontSize={12} fill="#f4efe6" opacity={0.85} {...font} {...halo}>{p.n}{p.e ? ` ${p.e} m` : ""}</text>}<title>{p.n ?? "Peak"}{p.e ? ` · ${p.e} m` : ""}</title></M>)}
              </g>}
              {on.settlements && <g>
                {L.settlements.map((p, i) => <M key={i} at={p.c}><circle r={p.k === "town" ? 5 : 3} fill="#e9e1d2" opacity={0.8} />{(k > 1.8 || p.k === "town") && <text x={8} y={4} fontSize={12} fill="#e9e1d2" opacity={0.8} {...font} {...halo}>{p.n}</text>}<title>{p.n}</title></M>)}
                {L.pois.map((p, i) => <M key={"q" + i} at={p.c}><rect x={-3} y={-3} width={6} height={6} fill="#e9e1d2" opacity={0.8} /><title>{p.n}</title></M>)}
              </g>}
              {on.sites && <g>
                {layers.sites.map((p, i) => { const id = `s${i}`; return (
                  <M key={i} at={p.c}>
                    <g onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                      <circle r={p.g ? 9 : 6.5} fill={p.g ? "#ef8a3c" : "#f6d9c2"} stroke="#1f1d1a" strokeWidth={1.5} />
                      <text x={11} y={4} fontSize={13} fill="#f6d9c2" fontWeight={600} {...font}>{i + 1}</text>
                      {hover === id && <g>
                        <rect x={14} y={-48} width={210} height={40} rx={4} fill="#1f1d1a" stroke="#ef8a3c" strokeWidth={1} />
                        <text x={22} y={-32} fontSize={12} fill="#f4efe6" {...font}>{p.n} · {p.e} m · {p.o}% open horizon</text>
                        <text x={22} y={-16} fontSize={12} fill="#f4efe6" opacity={0.75} {...font}>water {p.w} km · subject to ground survey</text>
                      </g>}
                    </g>
                  </M>); })}
              </g>}
              {on.access && <g>
                {layers.access.map((p, i) => { const air = p.k === "airport" || p.k === "airstrip"; return (
                  <M key={i} at={p.c}>
                    {p.k === "summit" ? <path d="M0,-9L8,6L-8,6Z" fill="#ef8a3c" />
                      : air ? <path d="M0,-9 L2,-3 L9,1 L9,3 L2,1 L1,6 L4,8 L4,9 L0,8 L-4,9 L-4,8 L-1,6 L-2,1 L-9,3 L-9,1 L-2,-3 Z" fill="#ef8a3c" />
                      : <circle r={5} fill="#ef8a3c" />}
                    <text x={13} y={4} fontSize={14} fill="#f4efe6" {...font} {...halo}>{p.n}{p.d ? ` · ${p.d} km` : ""}</text>
                  </M>); })}
              </g>}
            </g>
          </g>
          {/* fixed chrome */}
          <g {...font} fill="#f4efe6" fontSize={13}>
            <rect x={W - 24 - scaleLen} y={28} width={scaleLen} height={4} fill="#f4efe6" opacity={0.9} />
            <rect x={W - 24 - scaleLen} y={28} width={scaleLen / 2} height={4} fill="#1f1d1a" stroke="#f4efe6" strokeWidth={0.8} />
            <text x={W - 24 - scaleLen} y={48} opacity={0.8}>0</text><text x={W - 24} y={48} textAnchor="end" opacity={0.8}>{scaleKm} km</text>
          </g>
          <text x={16} y={H - 14} {...font} fill="#f4efe6" fontSize={13} opacity={0.6}>Boundary: NFA 2021 (WDPA). Features: © OpenStreetMap contributors. Indicative sites are desk-based and unsurveyed.</text>
        </svg>
        <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-md border border-bone/20 bg-[#1f1d1a]/90 text-bone shadow">
          <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.5)} className="grid h-9 w-9 place-items-center text-lg hover:bg-bone/10">+</button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.5)} className="grid h-9 w-9 place-items-center border-t border-bone/20 text-lg hover:bg-bone/10">−</button>
          <button type="button" aria-label="Reset view" onClick={() => setT({ k: 1, x: 0, y: 0 })} className="grid h-9 w-9 place-items-center border-t border-bone/20 text-xs hover:bg-bone/10">⟲</button>
        </div>
        <div className="pointer-events-none absolute bottom-10 right-3 text-xs text-bone/50">scroll or pinch to zoom · drag to pan</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {LAYERS.map((l) => (
          <button key={l.key} type="button" onClick={() => toggle(l.key)} aria-pressed={on[l.key]}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition ${on[l.key] ? "border-dawn/70 bg-dawn/15 text-bone" : "border-bone/20 text-bone/55 hover:border-bone/40"}`}>
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: on[l.key] ? l.swatch : "transparent", boxShadow: `inset 0 0 0 1.5px ${l.swatch}` }} />
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
