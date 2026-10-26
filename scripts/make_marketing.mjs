// Generate marketing assets for who.michitai.com — vector-first.
// Hand-authored SVG masters (marketing/svg/*.svg) rendered to PNG via resvg.
// Run: node scripts/make_marketing.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "marketing");
mkdirSync(join(OUT, "svg"), { recursive: true });

const INK = "#10375c";

// Shared defs: sky gradient, sun glow, puffy cloud symbol, text shadow.
const DEFS = `
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0d9df6"/>
    <stop offset="0.55" stop-color="#4cb2f8"/>
    <stop offset="0.85" stop-color="#a8dcff"/>
    <stop offset="1" stop-color="#e3f4ff"/>
  </linearGradient>
  <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="pillbg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.97"/>
    <stop offset="1" stop-color="#eaf6ff" stop-opacity="0.92"/>
  </linearGradient>
  <g id="cloud">
    <rect x="15" y="46" width="130" height="30" rx="15"/>
    <ellipse cx="52" cy="46" rx="30" ry="27"/>
    <ellipse cx="95" cy="38" rx="35" ry="29"/>
    <ellipse cx="126" cy="52" rx="22" ry="19"/>
  </g>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="10" stdDeviation="0" flood-color="#8fc3e8" flood-opacity="0.9"/>
  </filter>
  <filter id="txtShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#07508f" flood-opacity="0.35"/>
  </filter>
</defs>`;

// One cloud: shadow silhouette offset underneath + white body on top.
const c = (x, y, s = 1, o = 1) => `
  <g transform="translate(${x},${y}) scale(${s})" opacity="${o}">
    <use href="#cloud" fill="#8fc3e8" transform="translate(0,9)"/>
    <use href="#cloud" fill="#ffffff"/>
  </g>`;

const pill = (cx, cy, w, h, text, fs) => `
  <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#pillbg)"/>
  <text x="${cx}" y="${cy + fs * 0.36}" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="${fs}" fill="${INK}">${text}</text>`;

const mono = (cx, cy, text, fs, fill = "#ffffff", shadow = "#0a5fa8") => `
  <text x="${cx + 2}" y="${cy + 3}" text-anchor="middle" font-family="Consolas" font-size="${fs}" fill="${shadow}">${text}</text>
  <text x="${cx}" y="${cy}" text-anchor="middle" font-family="Consolas" font-size="${fs}" fill="${fill}">${text}</text>`;

function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}
  <rect width="${w}" height="${h}" fill="url(#sky)"/>${body}</svg>`;
}

// ------------------------------------------------------------------ og
const og = svg(1200, 630, `
  <ellipse cx="160" cy="90" rx="260" ry="130" fill="url(#sun)"/>
  ${c(-60, 30, 2.6, 0.95)}${c(880, -40, 2.4, 0.9)}${c(1020, 300, 1.5, 0.85)}
  ${c(-80, 420, 2.2, 0.95)}${c(980, 470, 2.0, 0.9)}${c(560, 545, 2.8, 0.9)}
  ${c(300, -30, 1.2, 0.8)}
  <text x="600" y="330" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="250" fill="#ffffff" filter="url(#txtShadow)">who</text>
  ${mono(600, 415, "who.michitai.com", 44)}
  ${pill(600, 525, 620, 84, "FREE WHOIS · DNS · IP LOOKUP", 34)}
`);

// ------------------------------------------------------------------ square
const square = svg(1080, 1080, `
  <ellipse cx="180" cy="140" rx="280" ry="150" fill="url(#sun)"/>
  ${c(-70, 40, 2.4, 0.95)}${c(840, 20, 2.2, 0.9)}${c(60, 780, 2.6, 0.9)}
  ${c(760, 820, 2.8, 0.95)}${c(300, 960, 2.2, 0.85)}${c(-90, 300, 1.1, 0.8)}${c(950, 330, 1.3, 0.8)}
  <text x="540" y="500" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="330" fill="#ffffff" filter="url(#txtShadow)">who</text>
  ${mono(540, 620, "who.michitai.com", 48)}
  ${pill(540, 730, 660, 92, "FREE WHOIS · DNS · IP LOOKUP", 34)}
  ${mono(540, 850, "registration · records · history · json api", 28, "#eaf5ff", "#0a5fa8")}
`);

// ------------------------------------------------------------------ tiktok
const ttPills = ["WHOIS / RDAP registration", "Live DNS records", "IP &amp; ASN intelligence", "Change history", "Free JSON API"]
  .map((t, i) => pill(540, 1150 + i * 150, 700, 96, t, 34)).join("");

const tiktok = svg(1080, 1920, `
  <ellipse cx="180" cy="170" rx="300" ry="160" fill="url(#sun)"/>
  ${c(-90, 60, 2.8, 0.95)}${c(760, -30, 2.6, 0.9)}${c(-40, 330, 1.4, 0.85)}${c(930, 300, 1.5, 0.8)}
  ${c(-120, 1500, 3.2, 0.95)}${c(820, 1620, 3.0, 0.95)}${c(360, 1780, 2.6, 0.9)}
  <text x="540" y="640" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="400" fill="#ffffff" filter="url(#txtShadow)">who</text>
  ${mono(540, 790, "who.michitai.com", 56)}
  ${pill(540, 930, 560, 104, "FREE DOMAIN LOOKUP", 44)}
  ${ttPills}
  ${mono(540, 1840, "no account · no key · free", 34, "#eaf5ff", "#0a5fa8")}
`);

const jobs = [
  ["og-1200x630", og, 1200],
  ["square-1080x1080", square, 1080],
  ["tiktok-1080x1920", tiktok, 1080],
];

for (const [name, src, width] of jobs) {
  writeFileSync(join(OUT, "svg", `${name}.svg`), src);
  const png = new Resvg(src, {
    fitTo: { mode: "width", value: width },
    font: { loadSystemFonts: true, defaultFontFamily: "Arial" },
  }).render().asPng();
  writeFileSync(join(OUT, `${name}.png`), png);
  console.log("wrote", `${name}.png`);
}

// Site OG tag uses the 1200×630 master.
const ogPng = new Resvg(og, { fitTo: { mode: "width", value: 1200 }, font: { loadSystemFonts: true } })
  .render().asPng();
writeFileSync(join(ROOT, "public", "og-image.png"), ogPng);
console.log("wrote public/og-image.png");
