"use client";
/**
 * Africa → Uganda → Zulia. One orchestrated zoom, then rests on the concession.
 * Draws with d3-geo onto SVG. Projection parameters are tweened between three
 * framings; paths are re-projected each frame.
 */
import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath, type GeoProjection } from "d3-geo";
import { interpolateNumber, interpolateArray } from "d3-interpolate";
import { easeCubicInOut } from "d3-ease";
import type { FeatureCollection, Feature, Geometry } from "geojson";

type Stage = "africa" | "uganda" | "zulia";
type Props = { className?: string; autoplay?: boolean; onStage?: (s: Stage) => void; loop?: boolean; staticStage?: Stage; };

type Framing = { scale: number; translate: [number, number] };

function fit(proj: GeoProjection, feature: Feature | FeatureCollection, w: number, h: number, pad: number): Framing {
  const p = geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], feature as never);
  return { scale: p.scale(), translate: p.translate() as [number, number] };
}

export function ZoomMap({ className = "", autoplay = true, onStage, loop = false, staticStage = "zulia" }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<{ africa: FeatureCollection; uganda: Feature; zulia: FeatureCollection } | null>(null);
  const [stage, setStage] = useState<Stage>("africa");

  useEffect(() => {
    Promise.all([
      fetch("/geo/africa.json").then((r) => r.json()),
      fetch("/geo/uganda.json").then((r) => r.json()),
      fetch("/geo/zulia.json").then((r) => r.json()),
    ]).then(([africa, uganda, zulia]) => setData({ africa, uganda, zulia }));
  }, []);

  useEffect(() => {
    if (!data || !ref.current) return;
    const svg = ref.current;
    const W = 1000, H = 1000;
    const proj = geoMercator();
    const path = geoPath(proj);

    const zuliaPoly = data.zulia.features.find((f) => f.properties?.name?.startsWith("Zulia Central"))!;
    const overlap = data.zulia.features.find((f) => f.properties?.name?.startsWith("Dual"))!;
    const kidepo = data.zulia.features.find((f) => f.properties?.name?.startsWith("Kidepo Valley"))!;
    const summit = data.zulia.features.find((f) => f.properties?.name?.startsWith("Mount"))!;
    const airstrip = data.zulia.features.find((f) => f.properties?.name?.startsWith("Apoka"))!;

    const fA = fit(proj, data.africa, W, H, 60);
    const fU = fit(proj, data.uganda, W, H, 140);
    // Zulia framing: include the park so the overlap reads
    const both: FeatureCollection = { type: "FeatureCollection", features: [zuliaPoly, kidepo] };
    const fZ = fit(proj, both, W, H, 70);

    const g = {
      land: svg.querySelector<SVGGElement>("#land")!,
      uganda: svg.querySelector<SVGPathElement>("#uganda")!,
      kidepo: svg.querySelector<SVGPathElement>("#kidepo")!,
      overlap: svg.querySelector<SVGPathElement>("#overlap")!,
      zulia: svg.querySelector<SVGPathElement>("#zulia")!,
      summit: svg.querySelector<SVGGElement>("#summit")!,
      airstrip: svg.querySelector<SVGGElement>("#airstrip")!,
      labels: svg.querySelector<SVGGElement>("#labels")!,
      graticule: svg.querySelector<SVGGElement>("#borders")!,
    };

    // Build land paths once
    g.land.innerHTML = "";
    const landEls: { el: SVGPathElement; f: Feature<Geometry> }[] = [];
    for (const f of data.africa.features) {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      g.land.appendChild(el);
      landEls.push({ el, f: f as Feature<Geometry> });
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function framingAt(x: number): Framing {
      const [a, b, k] = x < 1 ? [fA, fU, x] : [fU, fZ, x - 1];
      // interpolate in log-scale so the zoom feels constant-speed
      const s = Math.exp(interpolateNumber(Math.log(a.scale), Math.log(b.scale))(k));
      // translate interpolation keeps the target centred: compute centre in lon/lat terms instead
      const tr = interpolateArray(a.translate, b.translate)(k) as [number, number];
      return { scale: s, translate: tr };
    }

    function render(x: number) {
      const fr = framingAt(x);
      // Re-derive translate so that the zoom pivots about the correct geographic centre:
      // compute geographic centre of target framing, then translate so it sits where the
      // interpolated framing wants it. Simpler: interpolate the geographic centre.
      const cA = centreOf(fA), cU = centreOf(fU), cZ = centreOf(fZ);
      const [c0, c1, k] = x < 1 ? [cA, cU, x] : [cU, cZ, x - 1];
      const lon = interpolateNumber(c0[0], c1[0])(k), lat = interpolateNumber(c0[1], c1[1])(k);
      proj.scale(fr.scale).center([lon, lat]).translate([W / 2, H / 2]);

      for (const { el, f } of landEls) el.setAttribute("d", path(f) ?? "");
      g.uganda.setAttribute("d", path(data!.uganda as never) ?? "");
      g.kidepo.setAttribute("d", path(kidepo as never) ?? "");
      g.overlap.setAttribute("d", path(overlap as never) ?? "");
      g.zulia.setAttribute("d", path(zuliaPoly as never) ?? "");
      const sp = proj((summit.geometry as unknown as { coordinates: [number, number] }).coordinates)!;
      g.summit.setAttribute("transform", `translate(${sp[0]},${sp[1]})`);
      const ap = proj((airstrip.geometry as unknown as { coordinates: [number, number] }).coordinates)!;
      g.airstrip.setAttribute("transform", `translate(${ap[0]},${ap[1]})`);

      // Stage-dependent styling
      const zoom = fr.scale / fA.scale; // 1 → ~100s
      const sw = Math.max(0.35, 1.2 / Math.sqrt(zoom));
      g.land.style.strokeWidth = `${sw}`;
      const ugW = x < 0.6 ? 0 : Math.min(1, (x - 0.6) / 0.4);
      g.uganda.style.opacity = `${ugW}`;
      g.uganda.style.strokeWidth = `${Math.max(0.6, 2.2 / Math.sqrt(zoom))}`;
      const zW = x < 1.35 ? 0 : Math.min(1, (x - 1.35) / 0.45);
      g.zulia.style.opacity = `${zW}`;
      g.kidepo.style.opacity = `${zW * 0.9}`;
      g.overlap.style.opacity = `${zW}`;
      g.summit.style.opacity = `${x > 1.8 ? 1 : 0}`;
      const loc = svg.querySelector<SVGGElement>("#locator")!;
      const cz = path.centroid(zuliaPoly as never);
      loc.setAttribute("transform", `translate(${cz[0]},${cz[1]})`);
      loc.style.opacity = `${x > 0.7 && x < 1.4 ? 1 : 0}`;
      g.airstrip.style.opacity = `${x > 1.85 ? 1 : 0}`;
      g.labels.style.opacity = `${x > 1.9 ? Math.min(1, (x - 1.9) / 0.1) : 0}`;

      // labels follow geometry
      const lz = svg.querySelector<SVGTextElement>("#lbl-zulia")!;
      const c = path.centroid(zuliaPoly as never);
      lz.setAttribute("x", `${c[0]}`); lz.setAttribute("y", `${c[1] - 10}`);
      const lk = svg.querySelector<SVGTextElement>("#lbl-kidepo")!;
      const ck = path.centroid(kidepo as never);
      lk.setAttribute("x", `${ck[0] - 30}`); lk.setAttribute("y", `${ck[1] + 40}`);
      const ls = svg.querySelector<SVGTextElement>("#lbl-summit")!;
      ls.setAttribute("x", `${sp[0] + 14}`); ls.setAttribute("y", `${sp[1] + 4}`);
      const la = svg.querySelector<SVGTextElement>("#lbl-airstrip")!;
      la.setAttribute("x", `${ap[0] + 12}`); la.setAttribute("y", `${ap[1] + 4}`);
      const lss = svg.querySelector<SVGTextElement>("#lbl-ssudan")!;
      const lke = svg.querySelector<SVGTextElement>("#lbl-kenya")!;
      const pSS = proj([33.80, 4.19])!, pKE = proj([34.17, 3.99])!;
      lss.setAttribute("x", `${pSS[0]}`); lss.setAttribute("y", `${pSS[1]}`);
      lke.setAttribute("x", `${pKE[0]}`); lke.setAttribute("y", `${pKE[1]}`);

      const s: Stage = x < 0.5 ? "africa" : x < 1.5 ? "uganda" : "zulia";
      setStage((prev) => (prev === s ? prev : (onStage?.(s), s)));
    }

    function centreOf(fr: Framing): [number, number] {
      const p = geoMercator().scale(fr.scale).translate(fr.translate);
      return p.invert!([W / 2, H / 2]) as [number, number];
    }

    render(0);
    if (!autoplay || prefersReduced) { render(staticStage === "africa" ? 0 : staticStage === "uganda" ? 1 : 2); return; }

    // Timeline: hold Africa 1.2s, zoom to Uganda 2.2s, hold 0.9s, zoom to Zulia 2.6s, rest.
    const segs = [
      { from: 0, to: 0, dur: 1200 },
      { from: 0, to: 1, dur: 2200 },
      { from: 1, to: 1, dur: 900 },
      { from: 1, to: 2, dur: 2600 },
    ];
    let raf = 0, start = performance.now(), seg = 0;
    const tick = (now: number) => {
      const s = segs[seg];
      const k = Math.min(1, (now - start) / s.dur);
      render(s.from + (s.to - s.from) * easeCubicInOut(k));
      if (k >= 1) {
        seg++;
        start = now;
        if (seg >= segs.length) {
          if (loop) { seg = 0; setTimeout(() => (raf = requestAnimationFrame(tick)), 4000); }
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data, autoplay, loop, onStage, staticStage]);

  return (
    <svg ref={ref} viewBox="0 0 1000 1000" className={className} role="img"
      aria-label="Animated map zooming from Africa to Uganda to the Zulia Central Forest Reserve on the South Sudan and Kenya borders">
      <g id="land" fill="rgba(244,239,230,0.08)" stroke="currentColor" strokeOpacity="0.55" strokeLinejoin="round" />
      <g id="borders" />
      <path id="uganda" fill="rgba(143,138,87,0.18)" stroke="currentColor" strokeLinejoin="round" style={{ opacity: 0 }} />
      <path id="kidepo" fill="rgba(143,138,87,0.25)" stroke="#c9bf8a" strokeWidth="1" strokeDasharray="4 3" style={{ opacity: 0 }} />
      <path id="overlap" fill="rgba(201,191,138,0.45)" stroke="none" style={{ opacity: 0 }} />
      <path id="zulia" fill="rgba(74,120,86,0.45)" stroke="#ef8a3c" strokeWidth="2.4" strokeLinejoin="round" style={{ opacity: 0 }} />
      <g id="locator" style={{ opacity: 0, transition: "opacity .4s" }}>
        <circle r="26" fill="none" stroke="#ef8a3c" strokeOpacity="0.6" />
        <circle r="7" fill="#ef8a3c" />
        <text x="36" y="5" className="map-label serif" fontSize="22">Zulia</text>
      </g>
      <g id="summit" style={{ opacity: 0 }}>
        <path d="M0 -7 L7 5 L-7 5 Z" fill="#ef8a3c" />
      </g>
      <g id="airstrip" style={{ opacity: 0 }}>
        <rect x="-9" y="-2" width="18" height="4" fill="currentColor" transform="rotate(-25)" />
      </g>
      <g id="labels" style={{ opacity: 0 }}>
        <text id="lbl-zulia" className="map-label serif" textAnchor="middle" fontSize="22" fill="#f6d9c2">Zulia Central Forest Reserve</text>
        <text id="lbl-kidepo" className="map-label" textAnchor="middle" opacity="0.8">Kidepo Valley National Park</text>
        <text id="lbl-summit" className="map-label">Mount Zulia · 2,149 m</text>
        <text id="lbl-airstrip" className="map-label" opacity="0.8">Apoka airstrip</text>
        <text id="lbl-ssudan" className="map-label" textAnchor="middle" opacity="0.6" fontSize="13" letterSpacing="0.2em">SOUTH SUDAN</text>
        <text id="lbl-kenya" className="map-label" textAnchor="middle" opacity="0.6" fontSize="13" letterSpacing="0.2em">KENYA</text>
      </g>
      <text className="sr-only">{stage}</text>
    </svg>
  );
}
