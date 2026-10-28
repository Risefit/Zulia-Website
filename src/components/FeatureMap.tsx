"use client";
/**
 * Layered map of the reserve: boundaries, water, roads and tracks, peaks,
 * settlements, access points and (optionally) indicative lodge sites.
 * Data: /geo/zulia.json (boundaries) and /geo/features.json (OpenStreetMap
 * features inside the 33.68–34.16 E, 3.85–4.25 N window, simplified to ~40 m).
 * Each layer can be toggled; the SVG re-renders through d3-geo.
 */
import { useEffect, useMemo, useState } from "react";
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

export function FeatureMap({ className = "" }: { className?: string }) {
  const [bounds, setBounds] = useState<FeatureCollection | null>(null);
  const [layers, setLayers] = useState<Layers | null>(null);
  const [on, setOn] = useState<Record<LayerKey, boolean>>(() => Object.fromEntries(LAYERS.map((l) => [l.key, l.on])) as Record<LayerKey, boolean>);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetch("/geo/zulia.json").then((r) => r.json()), fetch("/geo/features.json").then((r) => r.json())]).then(([b, f]) => {
      setBounds(b); setLayers(f);
    });
  }, []);

  const zuliaFeature = bounds?.features.find((f) => f.properties?.name?.startsWith("Zulia Central"));
  const proj = useMemo(() => geoMercator().fitExtent([[40, 40], [W - 40, H - 40]], (zuliaFeature ?? { type: "Sphere" }) as never), [zuliaFeature]);
  const path = useMemo(() => geoPath(proj), [proj]);
  const line = (c: Pt[]) => path({ type: "LineString", coordinates: c }) ?? "";
  const xy = (c: Pt) => proj(c) as [number, number];

  if (!bounds || !layers) {
    return <div className={`${className} grid place-items-center text-bone/40 text-sm`} style={{ aspectRatio: `${W}/${H}` }}>Loading map…</div>;
  }

  const find = (p: string) => bounds.features.find((f) => f.properties?.name?.startsWith(p)) as Feature;
  const zulia = find("Zulia Central"), overlap = find("Dual"), kidepo = find("Kidepo Valley");
  const toggle = (k: LayerKey) => setOn((s) => ({ ...s, [k]: !s[k] }));
  // Only features touching the licensed area unless "surroundings" is on
  const keep = <T extends { i?: number }>(arr: T[]) => (on.outside ? arr : arr.filter((f) => f.i === 1));
  const L = {
    roads: keep(layers.roads), tracks: keep(layers.tracks), paths: keep(layers.paths), rivers: keep(layers.rivers), streams: keep(layers.streams),
    ridges: keep(layers.ridges), springs: keep(layers.springs), peaks: keep(layers.peaks), settlements: keep(layers.settlements), pois: keep(layers.pois),
  };

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" role="img" aria-label="Map of the Zulia reserve with toggleable layers">
        <defs>
          <clipPath id="fm-clip"><rect width={W} height={H} /></clipPath>
        </defs>
        <rect width={W} height={H} fill="#1f1d1a" />
        <g clipPath="url(#fm-clip)">
          {/* boundaries */}
          <path d={path(kidepo) ?? ""} fill="#c9bf8a" fillOpacity={0.12} stroke="#c9bf8a" strokeWidth={1.2} strokeDasharray="6 5" />
          <path d={path(overlap) ?? ""} fill="#a0c8e0" fillOpacity={0.14} stroke="none" />
          <path d={path(zulia) ?? ""} fill="#ef8a3c" fillOpacity={0.1} stroke="#ef8a3c" strokeWidth={2.4} />

          {on.streams && <g stroke="#4f8fb0" strokeWidth={0.9} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.85}>
            {L.streams.map((l, i) => <path key={i} d={line(l.c)}><title>{l.n ?? "Seasonal stream"}</title></path>)}
          </g>}
          {on.water && <g>
            <g stroke="#6fb7e0" strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeLinecap="round">
              {L.rivers.map((l, i) => <path key={i} d={line(l.c)}><title>{l.n ?? "River"}</title></path>)}
            </g>
            {L.springs.map((p, i) => { const [x, y] = xy(p.c); return <g key={i}><circle cx={x} cy={y} r={4.5} fill="#6fb7e0" stroke="#1f1d1a" strokeWidth={1} /><title>{p.n ?? "Spring"}</title></g>; })}
          </g>}
          {on.tracks && <g fill="none" strokeLinejoin="round" strokeLinecap="round">
            {L.tracks.map((l, i) => <path key={"t" + i} d={line(l.c)} stroke="#c9a070" strokeWidth={1.4}><title>{l.n ?? "Track"}</title></path>)}
            {L.paths.map((l, i) => <path key={"p" + i} d={line(l.c)} stroke="#b89060" strokeWidth={1.1} strokeDasharray="2 4"><title>{l.n ?? "Path"}</title></path>)}
          </g>}
          {on.roads && <g fill="none" strokeLinejoin="round" strokeLinecap="round">
            {L.roads.map((l, i) => <path key={i} d={line(l.c)} stroke="#f0c070" strokeWidth={l.k === "primary" || l.k === "secondary" ? 2.6 : 1.5}><title>{l.n ?? l.k}</title></path>)}
          </g>}
          {on.peaks && <g>
            {L.ridges.map((l, i) => <path key={"r" + i} d={line(l.c)} fill="none" stroke="#f4efe6" strokeWidth={1} strokeDasharray="1 3" opacity={0.7} />)}
            {L.peaks.map((p, i) => { const [x, y] = xy(p.c); return <g key={i}><path d={`M${x},${y - 6}L${x + 5.5},${y + 4}L${x - 5.5},${y + 4}Z`} fill="#f4efe6" opacity={0.9} /><title>{p.n ?? "Peak"}{p.e ? ` · ${p.e} m` : ""}</title></g>; })}
          </g>}
          {on.settlements && <g>
            {L.settlements.map((p, i) => { const [x, y] = xy(p.c); return <g key={i}><circle cx={x} cy={y} r={p.k === "town" ? 5 : 3} fill="#e9e1d2" opacity={0.8} /><title>{p.n}</title></g>; })}
            {L.pois.map((p, i) => { const [x, y] = xy(p.c); return <g key={"q" + i}><rect x={x - 3} y={y - 3} width={6} height={6} fill="#e9e1d2" opacity={0.8} /><title>{p.n}</title></g>; })}
          </g>}
          {on.sites && <g>
            {layers.sites.map((p, i) => { const [x, y] = xy(p.c); const id = `s${i}`; return (
              <g key={i} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                <circle cx={x} cy={y} r={p.g ? 9 : 6.5} fill={p.g ? "#ef8a3c" : "#f6d9c2"} stroke="#1f1d1a" strokeWidth={1.5} />
                <text x={x + 11} y={y + 4} fontSize={13} fontFamily="var(--font-sans)" fill="#f6d9c2" fontWeight={600}>{i + 1}</text>
                {hover === id && <g>
                  <rect x={x + 14} y={y - 48} width={190} height={40} rx={4} fill="#1f1d1a" stroke="#ef8a3c" strokeWidth={1} />
                  <text x={x + 22} y={y - 32} fontSize={12} fill="#f4efe6" fontFamily="var(--font-sans)">{p.n} · {p.e} m · {p.o}% open horizon</text>
                  <text x={x + 22} y={y - 16} fontSize={12} fill="#f4efe6" fontFamily="var(--font-sans)" opacity={0.75}>water {p.w} km · subject to ground survey</text>
                </g>}
              </g>); })}
          </g>}
        </g>
        {/* access points draw outside the clip so labels near the frame edge survive */}
        {on.access && <g>
          {layers.access.map((p, i) => { const [x, y] = xy(p.c); const inside = x > 30 && x < W - 30 && y > 30 && y < H - 60; const air = p.k === "airport" || p.k === "airstrip";
            if (!inside) return null;
            return (
            <g key={i}>
              {p.k === "summit" ? <path d={`M${x},${y - 9}L${x + 8},${y + 6}L${x - 8},${y + 6}Z`} fill="#ef8a3c" />
                : air ? <path transform={`translate(${x},${y})`} d="M0,-9 L2,-3 L9,1 L9,3 L2,1 L1,6 L4,8 L4,9 L0,8 L-4,9 L-4,8 L-1,6 L-2,1 L-9,3 L-9,1 L-2,-3 Z" fill="#ef8a3c" />
                : <circle cx={x} cy={y} r={5} fill="#ef8a3c" />}
              <text x={x + 13} y={y + 4} fontSize={14} fill="#f4efe6" fontFamily="var(--font-sans)" style={{ paintOrder: "stroke" }} stroke="#1f1d1a" strokeWidth={3}>{p.n}</text>
            </g>); })}
        </g>}
        {on.access && (() => {
          const off = layers.access.filter((p) => { const [x, y] = xy(p.c); return !(x > 30 && x < W - 30 && y > 30 && y < H - 60); });
          if (!off.length) return null;
          const arrow = (p: Point) => { const [x, y] = xy(p.c); const dx = x - W / 2, dy = y - H / 2; const a = Math.atan2(dy, dx); const dirs = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"]; return dirs[((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8]; };
          return (
            <g fontFamily="var(--font-sans)" fontSize={13}>
              <rect x={16} y={16} width={300} height={22 + off.length * 20} rx={3} fill="#1f1d1a" fillOpacity={0.85} stroke="#f4efe6" strokeOpacity={0.15} />
              <text x={28} y={34} fill="#f4efe6" opacity={0.6}>Beyond the frame (distance to boundary)</text>
              {off.map((p, i) => <text key={i} x={28} y={54 + i * 20} fill="#f6d9c2"><tspan fill="#ef8a3c">{arrow(p)}</tspan>  {p.n}{p.d ? ` · ${p.d} km` : ""}</text>)}
            </g>);
        })()}
        <g fontFamily="var(--font-sans)" fill="#f4efe6" fontSize={13} opacity={0.6}>
          <text x={16} y={H - 14}>Boundary: NFA 2021 (WDPA). Features: © OpenStreetMap contributors. Indicative sites are desk-based and unsurveyed.</text>
        </g>
        {(() => { const a = xy([33.70, 3.90]), b = xy([33.70 + 10 / 111.0, 3.90]); const len = b[0] - a[0]; const x0 = W - 24 - len, y0 = 28; return (
          <g fontFamily="var(--font-sans)" fill="#f4efe6" fontSize={13}>
            <rect x={x0} y={y0} width={len} height={4} fill="#f4efe6" opacity={0.9} />
            <rect x={x0} y={y0} width={len / 2} height={4} fill="#1f1d1a" stroke="#f4efe6" strokeWidth={0.8} />
            <text x={x0} y={y0 + 20} opacity={0.8}>0</text><text x={x0 + len} y={y0 + 20} textAnchor="end" opacity={0.8}>10 km</text>
          </g>); })()}
      </svg>
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
