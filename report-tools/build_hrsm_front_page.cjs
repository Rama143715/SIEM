const fs = require("fs");
const path = require("path");
const pptxgen = require("./node_modules/pptxgenjs");
const sharp = require("C:/Users/bpava/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "docs");
const assetDir = path.join(root, "outputs", "hrsm-front-page-assets");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });

const pptxPath = path.join(outDir, "Sri_HRSM_College_Project_Front_Page.pptx");
const previewPath = path.join(outDir, "Sri_HRSM_College_Project_Front_Page_preview.png");
const logoPath = path.join(assetDir, "hrsm-college-logo.png");

const C = {
  teal: "2F94A4",
  beige: "D7C9AA",
  gold: "FFB703",
  blue: "465F9A",
  red: "CC2A2E",
  brown: "4B241C",
  ink: "231815",
  muted: "6B5B4A",
  cream: "F7F1E8",
  white: "FFFFFF",
};

function logoSvg(size = 512) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const leaves = [];
  for (let i = 0; i < 22; i++) {
    const a = (-145 + i * 8.4) * Math.PI / 180;
    const x = cx + Math.cos(a) * (r + 48);
    const y = cy + Math.sin(a) * (r + 48);
    leaves.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="25" fill="#65A957" transform="rotate(${(a * 180 / Math.PI + 72).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  }
  for (let i = 0; i < 22; i++) {
    const a = (-35 + i * 8.4) * Math.PI / 180;
    const x = cx + Math.cos(a) * (r + 48);
    const y = cy + Math.sin(a) * (r + 48);
    leaves.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="25" fill="#65A957" transform="rotate(${(a * 180 / Math.PI - 72).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  }
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="100%" height="100%" fill="white"/>
    ${leaves.join("\n")}
    <circle cx="${cx}" cy="${cy}" r="${r + 23}" fill="#fff" stroke="#E7C673" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="#fff" stroke="#6B2D78" stroke-width="8"/>
    <text x="${cx}" y="${cy - 126}" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="#6B2D78" font-weight="700" letter-spacing="1">SRI H.R. SRIRAMULU</text>
    <text x="${cx}" y="${cy - 96}" text-anchor="middle" font-family="Georgia,serif" font-size="21" fill="#6B2D78" font-weight="700" letter-spacing="1">MEMORIAL COLLEGE</text>
    <text x="${cx}" y="${cy + 126}" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#6B2D78" font-weight="700" letter-spacing="1">GANGAVATHI</text>
    <g stroke="#3F286D" stroke-width="8" fill="none" stroke-linejoin="round">
      <rect x="${cx - 84}" y="${cy - 50}" width="168" height="104" rx="6" fill="#fff"/>
      <line x1="${cx}" y1="${cy - 50}" x2="${cx}" y2="${cy + 54}"/>
      <line x1="${cx - 84}" y1="${cy + 2}" x2="${cx + 84}" y2="${cy + 2}"/>
      <path d="M ${cx - 69} ${cy - 25} q 28 -18 56 0 q -28 16 -56 0z"/>
      <path d="M ${cx + 16} ${cy - 27} h 46 v 38 h -46z"/>
      <path d="M ${cx - 64} ${cy + 28} h 48 m -24 -24 v 48"/>
      <circle cx="${cx + 43}" cy="${cy + 29}" r="23"/>
    </g>
  </svg>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[m]));
}

async function main() {
  await sharp(Buffer.from(logoSvg(700))).png().toFile(logoPath);
  const logoDataUri = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;

  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Sri HRSM College Gangavathi";
  pptx.company = "Sri HRSM College Gangavathi";
  pptx.subject = "Project presentation front page";
  pptx.title = "AI SIEM Platform";
  pptx.lang = "en-US";
  pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };

  const slide = pptx.addSlide();
  slide.background = { color: "F8F8F6" };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 1.85, h: 7.5, fill: { color: C.beige }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 1.85, y: 0.09, w: 11.15, h: 0.13, fill: { color: C.teal }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 2.72, y: 1.12, w: 0.1, h: 3.5, fill: { color: C.gold }, line: { transparency: 100 } });

  slide.addShape(pptx.ShapeType.arc, { x: 0.25, y: 0.3, w: 1.45, h: 1.15, adjustPoint: 0.5, line: { color: C.teal, width: 8 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.65, y: 0.55, w: 0.58, h: 0.5, fill: { color: C.gold }, line: { color: C.ink, width: 1 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.38, y: 1.65, w: 1.12, h: 0.92, fill: { color: C.beige, transparency: 100 }, line: { color: C.white, width: 4 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.68, y: 2.9, w: 0.37, h: 0.37, fill: { color: C.red }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.42, y: 3.6, w: 1.08, h: 0.46, rectRadius: 0.06, fill: { color: C.blue }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 3.72, w: 0.82, h: 0.08, rectRadius: 0.02, fill: { color: "CFD7E7" }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 3.9, w: 0.57, h: 0.08, rectRadius: 0.02, fill: { color: "AEBBD8" }, line: { transparency: 100 } });
  [0.45, 0.68, 0.91, 1.14].forEach((x) => slide.addShape(pptx.ShapeType.roundRect, { x, y: 6.45, w: 0.15, h: 0.42, rectRadius: 0.04, fill: { color: C.brown }, line: { transparency: 100 } }));
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.35, y: 7.03, w: 1.22, h: 1.0, fill: { color: C.beige, transparency: 100 }, line: { color: C.white, width: 4 } });

  slide.addImage({ path: logoPath, x: 2.22, y: 0.32, w: 0.78, h: 0.78 });
  slide.addImage({ path: logoPath, x: 10.58, y: 0.38, w: 0.84, h: 0.84 });

  slide.addText("PROJECT PRESENTATION", { x: 3.0, y: 1.15, w: 3.2, h: 0.25, fontSize: 12, bold: true, color: C.teal, margin: 0, breakLine: false });
  slide.addText("SRI HRSM COLLEGE GANGAVATHI", { x: 3.18, y: 0.83, w: 6.4, h: 0.25, fontSize: 11, bold: true, color: C.blue, margin: 0 });
  slide.addText("AI SIEM\nPLATFORM", {
    x: 3.0,
    y: 1.55,
    w: 5.35,
    h: 1.65,
    fontFace: "Aptos Display",
    fontSize: 23,
    bold: true,
    color: C.brown,
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });
  slide.addText("A web-based security operations platform for\nmonitoring logs, detecting alerts, managing incidents,\nand supporting AI-assisted SIEM analysis.", {
    x: 3.0,
    y: 3.25,
    w: 5.55,
    h: 0.68,
    fontSize: 12.5,
    color: C.muted,
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });

  slide.addShape(pptx.ShapeType.roundRect, { x: 3.0, y: 4.45, w: 4.23, h: 0.83, rectRadius: 0.08, fill: { color: C.cream }, line: { color: "C8B38E", width: 0.8 } });
  slide.addText("Frontend: React, Vite, Tailwind CSS\nBackend: Node.js, Express\nDatabase: PostgreSQL, Redis", { x: 3.28, y: 4.68, w: 3.7, h: 0.42, fontSize: 9.3, bold: true, color: C.brown, margin: 0.01, breakLine: false, fit: "shrink" });

  slide.addShape(pptx.ShapeType.roundRect, { x: 8.55, y: 1.45, w: 3.0, h: 3.6, rectRadius: 0.08, fill: { color: C.blue }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.98, y: 1.85, w: 2.1, h: 0.92, rectRadius: 0.06, fill: { color: C.white }, line: { transparency: 100 } });
  slide.addText("SIEM Dashboard", { x: 9.18, y: 2.22, w: 1.72, h: 0.18, fontSize: 10.5, bold: true, color: C.blue, align: "center", margin: 0 });
  slide.addShape(pptx.ShapeType.roundRect, { x: 9.12, y: 3.13, w: 1.75, h: 0.78, rotate: 352, rectRadius: 0.08, fill: { color: C.gold }, line: { transparency: 100 } });
  slide.addText("12 Alerts", { x: 9.48, y: 3.42, w: 1.05, h: 0.2, rotate: 352, fontSize: 12.5, bold: true, color: C.ink, align: "center", margin: 0 });
  slide.addShape(pptx.ShapeType.ellipse, { x: 9.32, y: 3.28, w: 0.14, h: 0.14, fill: { color: C.white }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 10.62, y: 3.62, w: 0.14, h: 0.14, fill: { color: C.white }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 9.3, y: 4.25, w: 1.65, h: 0.08, fill: { color: "A7B2D0" }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 9.3, y: 4.42, w: 1.2, h: 0.08, fill: { color: "A7B2D0" }, line: { transparency: 100 } });

  slide.addText("GUIDE:", { x: 3.65, y: 5.72, w: 1.7, h: 0.25, fontFace: "Georgia", fontSize: 17, bold: true, underline: true, color: "FF0000", align: "center", margin: 0 });
  slide.addText("MISS POOJA G M\nLECTURER", { x: 3.3, y: 6.03, w: 2.35, h: 0.45, fontFace: "Georgia", fontSize: 15, color: "000000", align: "center", margin: 0, fit: "shrink" });
  slide.addText("PRESENTED BY :", { x: 8.52, y: 5.72, w: 2.7, h: 0.25, fontFace: "Georgia", fontSize: 17, bold: true, underline: true, color: "FF0000", align: "center", margin: 0 });
  slide.addText("Fayaz\nU32ZC23SO011", { x: 8.68, y: 6.02, w: 2.35, h: 0.45, fontFace: "Georgia", fontSize: 15, color: "000000", align: "center", margin: 0, fit: "shrink" });

  slide.addShape(pptx.ShapeType.line, { x: 2.75, y: 6.92, w: 8.9, h: 0, line: { color: "D8CDBA", width: 0.8 } });
  slide.addImage({ path: logoPath, x: 2.78, y: 7.04, w: 0.28, h: 0.28 });
  slide.addText("SRI H.R. SRIRAMULU MEMORIAL COLLEGE, SARASWATHIGIRI, GANGAVATHI", { x: 3.13, y: 7.11, w: 5.8, h: 0.13, fontSize: 5.8, color: "7C6E5D", margin: 0 });

  await pptx.writeFile({ fileName: pptxPath });

  const previewSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <rect width="1600" height="900" fill="#F8F8F6"/>
    <rect width="222" height="900" fill="#${C.beige}"/>
    <rect x="222" y="11" width="1338" height="16" fill="#${C.teal}"/>
    <rect x="326" y="134" width="12" height="420" fill="#${C.gold}"/>
    <circle cx="98" cy="90" r="64" fill="none" stroke="#${C.teal}" stroke-width="12"/>
    <circle cx="98" cy="90" r="31" fill="#${C.gold}" stroke="#${C.ink}" stroke-width="2"/>
    <circle cx="96" cy="254" r="55" fill="none" stroke="#fff" stroke-width="7"/>
    <circle cx="88" cy="375" r="19" fill="#${C.red}"/>
    <rect x="52" y="443" width="113" height="58" rx="10" fill="#${C.blue}"/>
    <rect x="55" y="796" width="18" height="52" rx="8" fill="#${C.brown}"/>
    <rect x="78" y="796" width="18" height="52" rx="8" fill="#${C.brown}"/>
    <rect x="101" y="796" width="18" height="52" rx="8" fill="#${C.brown}"/>
    <rect x="124" y="796" width="18" height="52" rx="8" fill="#${C.brown}"/>
    <image href="${logoDataUri}" x="266" y="38" width="94" height="94"/>
    <image href="${logoDataUri}" x="1270" y="46" width="101" height="101"/>
    <text x="382" y="116" font-family="Arial" font-size="14" font-weight="700" fill="#${C.blue}">SRI HRSM COLLEGE GANGAVATHI</text>
    <text x="360" y="160" font-family="Arial" font-size="18" font-weight="700" fill="#${C.teal}">PROJECT PRESENTATION</text>
    <text x="360" y="240" font-family="Arial" font-size="58" font-weight="800" fill="#${C.brown}">AI SIEM</text>
    <text x="360" y="302" font-family="Arial" font-size="58" font-weight="800" fill="#${C.brown}">PLATFORM</text>
    <text x="360" y="423" font-family="Arial" font-size="23" fill="#${C.muted}">A web-based security operations platform for</text>
    <text x="360" y="451" font-family="Arial" font-size="23" fill="#${C.muted}">monitoring logs, detecting alerts, managing incidents,</text>
    <text x="360" y="479" font-family="Arial" font-size="23" fill="#${C.muted}">and supporting AI-assisted SIEM analysis.</text>
    <rect x="360" y="534" width="508" height="100" rx="10" fill="#${C.cream}" stroke="#C8B38E"/>
    <text x="389" y="576" font-family="Arial" font-size="17" font-weight="700" fill="#${C.brown}">Frontend: React, Vite, Tailwind CSS</text>
    <text x="389" y="596" font-family="Arial" font-size="17" font-weight="700" fill="#${C.brown}">Backend: Node.js, Express</text>
    <text x="389" y="616" font-family="Arial" font-size="17" font-weight="700" fill="#${C.brown}">Database: PostgreSQL, Redis</text>
    <rect x="1026" y="174" width="360" height="432" rx="10" fill="#${C.blue}"/>
    <rect x="1078" y="222" width="252" height="110" rx="10" fill="#fff"/>
    <text x="1204" y="291" text-anchor="middle" font-family="Arial" font-size="19" font-weight="700" fill="#${C.blue}">SIEM Dashboard</text>
    <g transform="translate(1088 381) rotate(-8)">
      <rect width="174" height="78" rx="10" fill="#${C.gold}"/>
      <circle cx="28" cy="21" r="8" fill="#fff"/>
      <circle cx="148" cy="58" r="8" fill="#fff"/>
      <text x="87" y="47" text-anchor="middle" font-family="Arial" font-size="19" font-weight="800" fill="#${C.ink}">12 Alerts</text>
    </g>
    <rect x="1096" y="534" width="198" height="10" fill="#A7B2D0"/>
    <rect x="1096" y="554" width="143" height="10" fill="#A7B2D0"/>
    <text x="471" y="737" text-anchor="middle" font-family="Georgia" font-size="34" font-weight="700" text-decoration="underline" fill="#F00">GUIDE:</text>
    <text x="471" y="775" text-anchor="middle" font-family="Georgia" font-size="29" fill="#000">MISS POOJA G M</text>
    <text x="471" y="811" text-anchor="middle" font-family="Georgia" font-size="29" fill="#000">LECTURER</text>
    <text x="1014" y="737" text-anchor="middle" font-family="Georgia" font-size="34" font-weight="700" text-decoration="underline" fill="#F00">PRESENTED BY :</text>
    <text x="1014" y="775" text-anchor="middle" font-family="Georgia" font-size="29" fill="#000">Fayaz</text>
    <text x="1014" y="811" text-anchor="middle" font-family="Georgia" font-size="29" fill="#000">U32ZC23SO011</text>
    <line x1="330" y1="831" x2="1398" y2="831" stroke="#D8CDBA"/>
    <image href="${logoDataUri}" x="334" y="844" width="34" height="34"/>
    <text x="378" y="863" font-family="Arial" font-size="10" fill="#7C6E5D">SRI H.R. SRIRAMULU MEMORIAL COLLEGE, SARASWATHIGIRI, GANGAVATHI</text>
  </svg>`;
  await sharp(Buffer.from(previewSvg)).png().toFile(previewPath);

  console.log(JSON.stringify({ pptxPath, previewPath, logoPath }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
