import fs from 'fs';
import * as topojson from 'topojson-client';
const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json','utf8'));
const fc = topojson.feature(world, world.objects.countries);
const nonAfrica = new Set(['Spain','Portugal','Italy','France','Greece','Malta','Cyprus','Turkey','Israel','Lebanon','Syria','Jordan','Saudi Arabia','Yemen','Iraq','Iran','Kuwait','Oman','United Arab Emirates','Qatar','Bahrain','Palestine','Gibraltar','Armenia','Azerbaijan','Georgia','Albania','Montenegro','Bosnia and Herz.','Croatia','Slovenia','North Macedonia','Bulgaria','Kosovo','Serbia','Romania','Vatican','San Marino','Monaco','Andorra','Iceland','Faeroe Is.','Jersey','Guernsey','Fiji','N. Cyprus'] );
function centroid(f){ let xs=0,ys=0,n=0; const walk=c=>{ if(typeof c[0]==='number'){xs+=c[0];ys+=c[1];n++;} else c.forEach(walk)}; walk(f.geometry.coordinates); return [xs/n, ys/n]; }
const africa = fc.features.filter(f=>{ const [x,y]=centroid(f); return x>-26&&x<64&&y>-40&&y<38 && !nonAfrica.has(f.properties.name); });
console.log('africa countries', africa.length, africa.map(f=>f.properties.name).join(', '));
fs.writeFileSync('public/geo/africa.json', JSON.stringify({type:'FeatureCollection', features: africa.map(f=>({type:'Feature',properties:{name:f.properties.name},geometry:f.geometry}))}));
const ug = africa.find(f=>f.properties.name==='Uganda');
fs.writeFileSync('public/geo/uganda.json', JSON.stringify(ug));
// neighbours for context at Uganda zoom
const nb = africa.filter(f=>['Kenya','South Sudan','Dem. Rep. Congo','Rwanda','Tanzania','Burundi','Ethiopia','Somalia'].includes(f.properties.name));
console.log('neighbours', nb.map(f=>f.properties.name).join(', '));
