import fs from 'fs';
import { geoArea } from 'd3-geo';
const p='public/geo/zulia.json'; const fc=JSON.parse(fs.readFileSync(p,'utf8'));
for (const f of fc.features){
  if (f.geometry.type!=='Polygon') continue;
  const a=geoArea(f);
  if (a>2*Math.PI){ f.geometry.coordinates=f.geometry.coordinates.map(r=>r.slice().reverse()); }
  console.log(f.properties.name, 'area sr', geoArea(f).toExponential(2), 'km2≈', (geoArea(f)*6371**2).toFixed(0));
}
fs.writeFileSync(p, JSON.stringify(fc));
