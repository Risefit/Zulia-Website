import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Correct MIME types so Google Earth (desktop and mobile) opens the files directly.
    return [
      { source: "/:path*.kmz", headers: [{ key: "Content-Type", value: "application/vnd.google-earth.kmz" }, { key: "Content-Disposition", value: "attachment; filename=\"Zulia_Maps.kmz\"" }] },
      { source: "/:path*.kml", headers: [{ key: "Content-Type", value: "application/vnd.google-earth.kml+xml" }] },
    ];
  },
};

export default nextConfig;
