import fs from "node:fs/promises";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

function normalizeLine(text) {
  return text.replace(/\s+/g, " ").trim();
}

function looksLikeTocLine(line) {
  return /\b\d+\s*$/.test(line) && /[A-Za-z]/.test(line);
}

function percentile(sortedNumbers, p) {
  if (!sortedNumbers.length) return null;
  const index = Math.min(sortedNumbers.length - 1, Math.max(0, Math.floor((p / 100) * sortedNumbers.length)));
  return sortedNumbers[index];
}

async function extractPage(page) {
  const content = await page.getTextContent();
  const items = content.items || [];

  const lines = [];
  let current = [];
  let lastY = null;
  const yThreshold = 3;
  const heights = [];
  const fonts = new Map();

  for (const item of items) {
    const text = String(item.str || "");
    if (!text.trim()) {
      continue;
    }

    const y = item.transform?.[5] ?? null;
    if (typeof item.height === "number") {
      heights.push(item.height);
    }

    const fontName = String(item.fontName || "");
    if (fontName) {
      fonts.set(fontName, (fonts.get(fontName) || 0) + 1);
    }

    if (lastY === null) {
      current.push(text);
      lastY = y;
      continue;
    }

    if (y !== null && lastY !== null && Math.abs(y - lastY) > yThreshold) {
      lines.push(normalizeLine(current.join(" ")));
      current = [text];
      lastY = y;
      continue;
    }

    current.push(text);
    lastY = y;
  }

  if (current.length) {
    lines.push(normalizeLine(current.join(" ")));
  }

  return {
    lines: lines.filter(Boolean),
    heights,
    fonts: [...fonts.entries()].sort((a, b) => b[1] - a[1]),
  };
}

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error("Usage: node analyze-reference.mjs <pdf-path>");
    process.exit(1);
  }

  const loadingTask = getDocument(pdfPath);
  const pdf = await loadingTask.promise;

  const summary = {
    file: path.resolve(pdfPath),
    pageCount: pdf.numPages,
    pages: [],
    tocCandidates: [],
    typography: {},
  };

  const allHeights = [];
  const fontCounts = new Map();

  const scanPages = Math.min(pdf.numPages, 40);

  for (let i = 1; i <= scanPages; i += 1) {
    const page = await pdf.getPage(i);
    const pageData = await extractPage(page);

    for (const h of pageData.heights) {
      allHeights.push(h);
    }

    for (const [fontName, count] of pageData.fonts) {
      fontCounts.set(fontName, (fontCounts.get(fontName) || 0) + count);
    }

    const tocLines = pageData.lines.filter(looksLikeTocLine);
    if (tocLines.length >= 5) {
      summary.tocCandidates.push({
        page: i,
        lines: tocLines.slice(0, 120),
      });
    }

    summary.pages.push({
      page: i,
      sampleLines: pageData.lines.slice(0, 40),
      tocLineCount: tocLines.length,
    });
  }

  allHeights.sort((a, b) => a - b);
  const fontsSorted = [...fontCounts.entries()].sort((a, b) => b[1] - a[1]);

  summary.typography = {
    minHeight: allHeights[0] || null,
    p25Height: percentile(allHeights, 25),
    medianHeight: percentile(allHeights, 50),
    p75Height: percentile(allHeights, 75),
    p95Height: percentile(allHeights, 95),
    maxHeight: allHeights.length ? allHeights[allHeights.length - 1] : null,
    topFonts: fontsSorted.slice(0, 15),
  };

  await fs.writeFile("reference-analysis.json", JSON.stringify(summary, null, 2), "utf8");
  console.log(`Analyzed ${summary.pageCount} pages. Output: reference-analysis.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

