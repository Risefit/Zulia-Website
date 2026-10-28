"use client";
/** One map panel on the concession page with two views: features layer by layer, or satellite year by year. */
import { useState } from "react";
import { FeatureMap } from "./FeatureMap";
import { SatelliteTimeline } from "./SatelliteTimeline";

export function MapTabs() {
  const [view, setView] = useState<"layers" | "years">("layers");
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="inline-flex overflow-hidden rounded-full border border-bone/25 p-0.5 text-sm" role="tablist" aria-label="Map view">
          <button type="button" role="tab" aria-selected={view === "layers"} onClick={() => setView("layers")} className={`rounded-full px-4 py-2 transition ${view === "layers" ? "bg-dawn text-ink" : "text-bone/70 hover:text-bone"}`}>Layer by layer</button>
          <button type="button" role="tab" aria-selected={view === "years"} onClick={() => setView("years")} className={`rounded-full px-4 py-2 transition ${view === "years" ? "bg-dawn text-ink" : "text-bone/70 hover:text-bone"}`}>Year by year</button>
        </div>
        <p className="max-w-md text-sm text-bone/65">{view === "layers" ? "Rivers, tracks, peaks and settlements on the NFA boundary. Toggle layers below the map." : "Twelve cloud-free Sentinel-2 passes, 2018 to 2026. Step through time or swipe between two dates."}</p>
      </div>
      {view === "layers" ? <FeatureMap /> : <SatelliteTimeline />}
    </div>
  );
}
