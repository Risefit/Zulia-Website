export const site = {
  name: "Zulia Conservancy",
  legalName: "Zulia Conservancy (Uganda) Limited",
  tagline: "A 50-year commitment to Uganda's last great frontier.",
  domain: "zuliaconservancy.org",
  url: "https://zuliaconservancy.org",
  email: "amauganda@gmail.com",
  phone: "+256 788 389467",
  phoneHref: "tel:+256788389467",
  address: "Kaabong District, Karamoja, Uganda",
  postal: "P.O. Box 7217, Kampala, Uganda",
  socials: [
    { name: "Instagram", href: "https://instagram.com/zuliaconservancy", key: "instagram" },
    { name: "TikTok", href: "https://tiktok.com/@zuliaconservancy", key: "tiktok" },
    { name: "X", href: "https://x.com/zuliaconservancy", key: "x" },
    { name: "LinkedIn", href: "https://linkedin.com/company/zuliaconservancy", key: "linkedin" },
    { name: "Facebook", href: "https://facebook.com/zuliaconservancy", key: "facebook" },
  ],
  // Set NEXT_PUBLIC_FORM_ENDPOINT (e.g. a Formspree URL) in Vercel to receive forms by email.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
};

export const facts = {
  areaHa: "102,893",
  areaKm2: "1,029",
  gisKm2: "925",
  termYears: 50,
  licenceNo: "30",
  licenceDate: "26 May 2022",
  gazetted: 1942,
  summitM: "2,149",
  overlapKm2: "410",
  district: "Kaabong",
  region: "Karamoja",
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/concession", label: "The concession" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/film", label: "Film" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

/**
 * Imagery. Our own photographs live in /public/media. Wildlife photographs are
 * Creative Commons works from Wikimedia Commons, hot-linked with attribution.
 * Run `npm run fetch-media` on a machine with open internet to localise them.
 */
export type Photo = {
  src: string;
  alt: string;
  credit?: string;
  licence?: string;
  source?: string;
  w: number;
  h: number;
};

const commons = (file: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const photos = {
  rangers: { src: "/media/rangers-kopje.jpg", alt: "Rangers and a visitor on a granite kopje looking over the Zulia plains to the mountains", w: 1280, h: 960 } as Photo,
  track: { src: "/media/acacia-track.jpg", alt: "A red earth track under flat-topped acacias, Zulia", w: 1280, h: 853 } as Photo,
  riverbed: { src: "/media/kidepo-riverbed.jpg", alt: "Granite slabs in a dry riverbed under riverine trees", w: 1280, h: 853 } as Photo,
  pool: { src: "/media/borassus-pool.jpg", alt: "Borassus palms reflected in a rock pool in the Kidepo riverbed", w: 1280, h: 853 } as Photo,
  inselberg: { src: "/media/aerial-inselberg.jpg", alt: "Aerial view of an inselberg rising from green savanna", w: 1920, h: 1440 } as Photo,
  plains: { src: "/media/aerial-plains.jpg", alt: "Aerial view of the Zulia plains after rain", w: 1920, h: 1440 } as Photo,
  river: { src: "/media/aerial-river.jpg", alt: "Aerial view of the Kidepo River in flood", w: 1920, h: 1080 } as Photo,

  lion: { src: commons("Kidepo Lion (48663880907).jpg"), alt: "A male lion resting on a granite kopje in Kidepo", credit: "Rod Waddington", licence: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Kidepo_Lion_(48663880907).jpg", w: 1600, h: 1068 } as Photo,
  elephants: { src: commons("Elephants of Kidepo.jpg"), alt: "An elephant family under an acacia in Kidepo Valley", credit: "Vincent Mugaba", licence: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Elephants_of_Kidepo.jpg", w: 1600, h: 1067 } as Photo,
  buffalo: { src: commons("Cape buffalo in Kidepo Valley National Park.jpg"), alt: "A Cape buffalo bull in dry grass, Kidepo", credit: "Vincent Mugaba", licence: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Cape_buffalo_in_Kidepo_Valley_National_Park.jpg", w: 1600, h: 1080 } as Photo,
  giraffe: { src: commons("Giraffe peeps of a shrub.jpg"), alt: "Rothschild's giraffe above the bush with the Morungole range behind", credit: "Vincent Mugaba", licence: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Giraffe_peeps_of_a_shrub.jpg", w: 1600, h: 1067 } as Photo,
  hartebeest: { src: commons("Hartebeest at Kidepo Valley National Park by Tracy Precious Musiimenta.jpg", 1080), alt: "Jackson's hartebeest on the Kidepo plains", credit: "Tracy Precious Musiimenta", licence: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Hartebeest_at_Kidepo_Valley_National_Park_by_Tracy_Precious_Musiimenta.jpg", w: 1080, h: 720 } as Photo,
  buffaloHerd: { src: commons("Buffalos in Kidepo vally NP.jpg"), alt: "A buffalo herd moving across the Narus valley", credit: "Sjoerd", licence: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Buffalos_in_Kidepo_vally_NP.jpg", w: 1600, h: 1200 } as Photo,
};
