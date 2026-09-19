import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "cars");
mkdirSync(outDir, { recursive: true });

const cars = [
  { id: "cz-001", name: "Hyundai Creta 1.5 SX", body: "SUV", bg: "#0f172a", colour: "#e2e8f0", accent: "#ef4444" },
  { id: "cz-002", name: "Maruti Suzuki Swift ZXi", body: "Hatchback", bg: "#1e1b4b", colour: "#fbbf24", accent: "#38bdf8" },
  { id: "cz-003", name: "Toyota Fortuner 4x4", body: "SUV", bg: "#1c1917", colour: "#fafafa", accent: "#f97316" },
  { id: "cz-004", name: "Honda City ZX CVT", body: "Sedan", bg: "#082f49", colour: "#e0f2fe", accent: "#22c55e" },
  { id: "cz-005", name: "Mahindra Thar LX 4x4", body: "SUV", bg: "#14532d", colour: "#fefce8", accent: "#a3e635" },
  { id: "cz-006", name: "Kia Seltos HTX DCT", body: "SUV", bg: "#3f1d0e", colour: "#ffedd5", accent: "#60a5fa" },
  { id: "cz-007", name: "Tata Nexon XZ+", body: "SUV", bg: "#0c4a6e", colour: "#fdf8f6", accent: "#fb923c" },
  { id: "cz-008", name: "Skoda Slavia 1.5 TSI", body: "Sedan", bg: "#292524", colour: "#d6d3d1", accent: "#a78bfa" },
  { id: "cz-009", name: "Maruti Suzuki Ertiga ZXI", body: "MUV", bg: "#334155", colour: "#f1f5f9", accent: "#f472b6" },
  { id: "cz-010", name: "Volkswagen Taigun GT", body: "SUV", bg: "#111827", colour: "#dc2626", accent: "#fbbf24" },
  { id: "cz-011", name: "MG Hector Sharp CVT", body: "SUV", bg: "#3b0764", colour: "#f5f3ff", accent: "#34d399" },
  { id: "cz-012", name: "Renault Kwid Climber", body: "Hatchback", bg: "#173f3f", colour: "#fef08a", accent: "#7dd3fc" },
];

function svg(car) {
  const isSuv = car.body === "SUV";
  const isHatch = car.body === "Hatchback";
  const isMuv = car.body === "MUV";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${car.bg}"/>
      <stop offset="1" stop-color="${car.bg}" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="flare" cx="0.2" cy="0.15" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <rect width="1200" height="675" fill="url(#flare)"/>
  <g transform="translate(130 210)">
    <ellipse cx="520" cy="${isSuv ? 330 : isMuv ? 320 : isHatch ? 318 : 325}" rx="360" ry="14" fill="#000000" opacity="0.35"/>
    <rect x="30" y="${isSuv ? 150 : isMuv ? 170 : isHatch ? 172 : 180}" width="${isSuv ? 180 : 160}" height="140" rx="18" fill="${car.colour}"/>
    <path d="M ${isSuv ? 210 : 190} ${isSuv ? 175 : isMuv ? 200 : isHatch ? 205 : 210}
             L ${isSuv ? 250 : 235} ${isSuv ? 78 : 100}
             Q ${isSuv ? 420 : 420} ${isSuv ? 25 : 55} ${isSuv ? 560 : 600} ${isSuv ? 60 : 85}
             Q ${isSuv ? 760 : 790} ${isSuv ? 95 : 110} ${isSuv ? 830 : 830} ${isSuv ? 175 : 195}
             L ${isSuv ? 880 : 870} ${isSuv ? 205 : 220}
             Z" fill="${car.colour}"/>
    <rect x="${isSuv ? 210 : 190}" y="${isSuv ? 205 : 235}" width="690" height="${isSuv ? 120 : 105}" rx="20" fill="${car.colour}"/>
    <path d="M ${isSuv ? 210 : 190} ${isSuv ? 245 : 268} h 690 v 12 h -690 z" fill="#000000" opacity="0.12"/>
    <rect x="300" y="${isSuv ? 92 : 118}" width="120" height="58" rx="10" fill="#0f172a" opacity="0.35"/>
    <rect x="455" y="${isSuv ? 80 : 108}" width="130" height="60" rx="10" fill="#0f172a" opacity="0.35"/>
    <rect x="620" y="${isSuv ? 94 : 120}" width="105" height="56" rx="10" fill="#0f172a" opacity="0.35"/>
    <circle cx="${isSuv ? 255 : 245}" cy="${isSuv ? 300 : 315}" r="${isSuv ? 55 : 50}" fill="#0f172a"/>
    <circle cx="${isSuv ? 255 : 245}" cy="${isSuv ? 300 : 315}" r="${isSuv ? 28 : 26}" fill="#64748b"/>
    <circle cx="${isSuv ? 860 : 855}" cy="${isSuv ? 300 : 315}" r="${isSuv ? 55 : 50}" fill="#0f172a"/>
    <circle cx="${isSuv ? 860 : 855}" cy="${isSuv ? 300 : 315}" r="${isSuv ? 28 : 26}" fill="#64748b"/>
    <rect x="${isSuv ? 160 : 140}" y="${isSuv ? 262 : 282}" width="16" height="14" rx="4" fill="#eab308" opacity="0.9"/>
    <circle cx="760" cy="250" r="7" fill="#ef4444"/>
    <rect x="132" y="${isSuv ? 158 : isHatch ? 200 : 205}" width="10" height="110" rx="5" fill="#eab308" opacity="0.85"/>
    <rect x="878" y="${isSuv ? 160 : isHatch ? 200 : 205}" width="10" height="110" rx="5" fill="#ef4444" opacity="0.85"/>
  </g>
  <text x="56" y="96" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff" opacity="0.92">${car.id}</text>
  <text x="56" y="126" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#ffffff" opacity="0.55">CruiserZone Certified Pre-Owned</text>
  <circle cx="600" cy="634" r="34" fill="${car.accent}"/>
  <text x="600" y="644" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">BID</text>
  <text x="660" y="638" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff" opacity="0.92">LIVE</text>
</svg>`;
}

for (const car of cars) {
  const file = join(outDir, `${car.id}.svg`);
  writeFileSync(file, svg(car));
  console.log("wrote", file);
}