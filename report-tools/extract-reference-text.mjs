import fs from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function pageLines(page) {
  const content = await page.getTextContent();
  const items = content.items || [];
  const rows = [];
  const threshold = 3;
  let current = [];
  let lastY = null;

  for (const item of items) {
    const text = String(item.str || "");
    if (!text.trim()) continue;
    const y = item.transform?.[5] ?? null;

    if (lastY === null) {
      current.push(text);
      lastY = y;
      continue;
    }

    if (y !== null && lastY !== null && Math.abs(y - lastY) > threshold) {
      rows.push(normalize(current.join(" ")));
      current = [text];
      lastY = y;
      continue;
    }

    current.push(text);
    lastY = y;
  }

  if (current.length) rows.push(normalize(current.join(" ")));
  return rows.filter(Boolean);
}

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error("Usage: node extract-reference-text.mjs <pdf-path>");
    process.exit(1);
  }

  const pdf = await getDocument(pdfPath).promise;
  const out = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const lines = await pageLines(page);
    out.push({ page: i, lines });
  }

  await fs.writeFile("reference-lines.json", JSON.stringify(out, null, 2), "utf8");
  console.log(`Saved reference-lines.json for ${pdf.numPages} pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

