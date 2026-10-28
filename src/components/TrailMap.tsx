"use client";
/**
 * Plan view of the reserve with indicative adventure routes from a base camp on the
 * Kidepo River up to the summit of Mount Zulia. Routes are illustrative and will be
 * replaced by surveyed alignments. Contours are schematic.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Feature } from "geojson";

type Route = { id: string; name: string; kind: "hike" | "trek" | "bike" | "horse"; colour: string; dash?: string; km: string; days: string; pts: [number, number][] };

const BASE: [number, number] = [33.948, 3.937];
const SUMMIT: [number, number] = [33.9844, 4.1239];

const routes: Route[] = [
  { id: "summit", name: "Summit trail", kind: "hike", colour: "#ef8a3c", km: "24 km", days: "2 days", pts: [BASE, [33.952, 3.962], [33.958, 3.993], [33.963, 4.028], [33.972, 4.062], [33.978, 4.094], [33.981, 4.112], SUMMIT] },
  { id: "ridge", name: "Escarpment traverse", kind: "trek", colour: "#f6d9c2", dash: "6 5", km: "58 km", days: "4 days", pts: [SUMMIT, [34.005, 4.135], [34.03, 4.125], [34.05, 4.105], [34.072, 4.075], [34.085, 4.04], [34.08, 4.0], [34.06, 3.968], [34.03, 3.948], [34.0, 3.94], [33.975, 3.937], BASE] },
  { id: "bike", name: "River and kopje loop", kind: "bike", colour: "#9fd27a", km: "31 km", days: "½ day", pts: [BASE, [33.92, 3.94], [33.885, 3.946], [33.862, 3.97], [33.868, 4.0], [33.895, 4.02], [33.925, 4.012], [33.945, 3.985], [33.955, 3.96], BASE] },
  { id: "horse", name: "Palm river ride", kind: "horse", colour: "#e9e1d2", dash: "1 7", km: "18 km", days: "½ day", pts: [BASE, [33.975, 3.925], [34.005, 3.922], [34.035, 3.93], [34.06, 3.945], [34.082, 3.958]] },
];

export function TrailMap({ className = "" }: { className?: string }) {
  const [zulia, setZulia] = useState<FeatureCollection | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => { fetch("/geo/zulia.json").then((r) => r.json()).then(setZulia); }, []);

  const W = 1000, H = 820;
  const geo = useMemo(() => {
    if (!zulia) return null;
    const poly = zulia.features.find((f) => f.properties?.name?.startsWith("Zulia Central"))!;
    const kidepo = zulia.features.find((f) => f.properties?.name?.startsWith("Kidepo Valley"))!;
    const overlap = zulia.features.find((f) => f.properties?.name?.startsWith("Dual"))!;
    const proj = geoMercator().fitExtent([[40, 40], [W - 40, H - 40]], poly as never);
    const path = geoPath(proj);
    // schematic contours around the summit: ellipses tilted along the ridge, projected
    const rings: string[] = [];
    const seed = 3;
    for (let i = 1; i <= 7; i++) {
      const pts: string[] = [];
      for (let a = 0; a <= 360; a += 6) {
        const r = i * 0.013;
        const wob = 1 + 0.08 * Math.sin((a * 3 + seed * 40 + i * 17) * Math.PI / 180) + 0.05 * Math.sin((a * 5 + i * 31) * Math.PI / 180);
        const th = (a * Math.PI) / 180;
        const u = Math.cos(th) * r * 1.35 * wob, v = Math.sin(th) * r * wob;
        const rot = (35 * Math.PI) / 180;
        const lon = SUMMIT[0] + u * Math.cos(rot) - v * Math.sin(rot);
        const lat = SUMMIT[1] + u * Math.sin(rot) + v * Math.cos(rot);
        const p = proj([lon, lat])!; pts.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`);
      }
      rings.push("M" + pts.join(" L") + " Z");
    }
    const line = (pts: [number, number][]) => {
      const ps = pts.map((p) => proj(p)!);
      // Catmull-Rom → cubic bezier for a soft trail
      let d = `M${ps[0][0]},${ps[0][1]}`;
      for (let i = 0; i < ps.length - 1; i++) {
        const p0 = ps[i - 1] ?? ps[i], p1 = ps[i], p2 = ps[i + 1], p3 = ps[i + 2] ?? p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
      }
      return d;
    };
    return {
      poly: path(poly as never)!, kidepo: path(kidepo as never)!, overlap: path(overlap as never)!,
      rings, base: proj(BASE)!, summit: proj(SUMMIT)!,
      trails: routes.map((r) => ({ ...r, d: line(r.pts) })),
      river: line([[33.70, 3.94], [33.80, 3.93], [33.90, 3.92], [34.0, 3.905], [34.1, 3.90], [34.14, 3.89]]),
    };
  }, [zulia]);

  // draw-on when it scrolls into view
  useEffect(() => {
    if (!svgRef.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(svgRef.current); return () => io.disconnect();
  }, [geo]);

  return (
    <figure className={className}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-bone" role="img" aria-label="Plan view of Zulia with indicative hiking, trekking, mountain-bike and horseback routes from a base camp on the Kidepo River to the summit of Mount Zulia">
        <rect width={W} height={H} fill="#2a2824" />
        {geo && (
          <>
            <path d={geo.kidepo} fill="rgba(143,138,87,0.18)" stroke="#c9bf8a" strokeOpacity="0.6" strokeDasharray="4 3" />
            <path d={geo.overlap} fill="rgba(201,191,138,0.25)" />
            <path d={geo.poly} fill="rgba(74,120,86,0.35)" stroke="#ef8a3c" strokeWidth="2" />
            <g fill="none" stroke="#8a6a4b" strokeOpacity="0.8" strokeWidth="1">
              {geo.rings.map((d, i) => <path key={i} d={d} />)}
            </g>
            <path d={geo.river} fill="none" stroke="#9ec5d6" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
            <text x={geo.base[0] + 150} y={geo.base[1] + 26} className="map-label" fill="#9ec5d6" opacity="0.9" fontSize="13">Kidepo River</text>

            {geo.trails.map((t, i) => (
              <g key={t.id}>
                <path
                  d={t.d} fill="none" stroke={t.colour} strokeWidth={t.kind === "trek" ? 2.2 : 3} strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={t.dash ?? undefined}
                  pathLength={t.dash ? undefined : 1}
                  style={drawn ? { strokeDasharray: t.dash ? undefined : 1, strokeDashoffset: t.dash ? undefined : 1, animation: t.dash ? undefined : `trail 2.6s ${0.4 + i * 0.5}s ease-out forwards` } : { opacity: 0 }}
                />
                {drawn && (
                  <circle r="5" fill={t.colour} stroke="#2a2824" strokeWidth="2">
                    <animateMotion dur={`${14 + i * 4}s`} begin={`${1 + i * 0.5}s`} repeatCount="indefinite" path={t.d} />
                  </circle>
                )}
              </g>
            ))}

            {/* base camp */}
            <g transform={`translate(${geo.base[0]},${geo.base[1]})`}>
              <circle r="18" fill="none" stroke="#ef8a3c" strokeOpacity="0.5" style={{ transformOrigin: "center", animation: "pulse 3s ease-in-out infinite" }} />
              <path d="M-9 7 L0 -9 L9 7 Z" fill="#ef8a3c" />
              <text x="16" y="-4" className="map-label serif" fill="#f6d9c2" fontSize="22">Base camp</text>
              <text x="16" y="14" className="map-label" opacity="0.8" fontSize="13">river frontage · 1,050 m</text>
            </g>
            {/* summit */}
            <g transform={`translate(${geo.summit[0]},${geo.summit[1]})`}>
              <path d="M0 -9 L9 6 L-9 6 Z" fill="#ef8a3c" />
              <text x="14" y="-2" className="map-label serif" fill="#f6d9c2" fontSize="22">Mount Zulia</text>
              <text x="14" y="16" className="map-label" opacity="0.8" fontSize="13">2,149 m</text>
            </g>
            <text x="30" y={H - 22} className="map-label" opacity="0.55">Routes are indicative, pending survey and NFA approval. Contours schematic. Boundary: NFA 2021 (WDPA 40604).</text>
          </>
        )}
      </svg>
      <figcaption className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {routes.map((r) => (
          <div key={r.id} className="flex items-start gap-3">
            <span className="mt-1.5 inline-block h-[3px] w-6 shrink-0 rounded" style={{ background: r.colour }} />
            <span><span className="font-medium">{r.name}</span><br /><span className="opacity-70">{r.km} · {r.days} · {r.kind === "hike" ? "on foot" : r.kind === "trek" ? "multi-day on foot" : r.kind === "bike" ? "mountain bike" : "horseback"}</span></span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
