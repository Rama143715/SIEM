import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const projectRoot = path.resolve(process.cwd(), "..");
const docsDir = path.join(projectRoot, "docs");
const synopsisPath = path.join(docsDir, "AI_SIEM_Platform_Synopsis.docx");
const pptPath = path.join(docsDir, "AI_SIEM_Platform_Presentation.pptx");

const title = "SOC Platform AI SIEM";
const subtitle = "Real-Time Security Monitoring, Alerting, Incident Response, and AI Analysis";

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { line: 320, after: opts.after ?? 160, before: opts.before ?? 0 },
    children: [
      new TextRun({
        text,
        font: "Times New Roman",
        size: opts.size || 24,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

function docHeading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 220, after: 120 },
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { line: 300, after: 80 },
    indent: { left: 720, hanging: 360 },
    children: [new TextRun({ text: `- ${text}`, font: "Times New Roman", size: 24 })],
  });
}

async function generateSynopsis() {
  const children = [
    para("PROJECT SYNOPSIS", { align: AlignmentType.CENTER, bold: true, size: 34, after: 180 }),
    para(title, { align: AlignmentType.CENTER, bold: true, size: 32, after: 100 }),
    para(subtitle, { align: AlignmentType.CENTER, size: 24, after: 260 }),
    para("Student Name: ______________________________", { align: AlignmentType.CENTER }),
    para("Register Number: ___________________________", { align: AlignmentType.CENTER }),
    para("Department: Computer Applications", { align: AlignmentType.CENTER }),
    para("Academic Year: 2025-26", { align: AlignmentType.CENTER, after: 300 }),

    docHeading("1. Introduction"),
    para("The SOC Platform AI SIEM is a full-stack cybersecurity monitoring application designed to collect security logs, analyze suspicious activity, generate alerts, manage incidents, and support analyst investigation using AI-assisted analysis. The platform demonstrates how a Security Operations Center can monitor real-time events from firewalls, endpoints, web systems, and authentication sources."),

    docHeading("2. Problem Statement"),
    para("Modern organizations generate a large amount of security data from different systems. Without a centralized platform, analysts may miss attacks such as brute force login attempts, SQL injection, credential dumping, and suspicious login behavior. Manual log checking is slow, error-prone, and difficult to prove during incident response. This project solves the problem by providing centralized log ingestion, rule-based detection, alert triage, incident tracking, AI analysis, and database-backed evidence."),

    docHeading("3. Objectives"),
    bullet("To build a real-time SOC dashboard for security event monitoring."),
    bullet("To ingest logs through API and syslog-compatible workflows."),
    bullet("To store logs, alerts, rules, incidents, users, and AI analysis records in PostgreSQL."),
    bullet("To detect attacks using pattern, regex, threshold, field match, and correlation rules."),
    bullet("To provide alert acknowledgement, resolution, and incident response workflows."),
    bullet("To support AI-assisted triage, IOC extraction, forensics, and incident summaries."),
    bullet("To demonstrate real-world attack monitoring using repeatable simulated attack logs."),

    docHeading("4. Scope of the Project"),
    para("The project covers log ingestion, event normalization, dashboard monitoring, alert generation, incident management, rule configuration, AI analysis, and database access. It is suitable for academic demonstration, SOC workflow learning, and future expansion into threat intelligence, SOAR automation, and advanced correlation."),

    docHeading("5. Existing System"),
    para("In many small environments, logs are checked manually from separate tools or files. Alerts may not be correlated, incident notes may be maintained outside the monitoring system, and evidence may not be stored in a structured database. This makes investigation slow and makes it difficult to prove that a real attack was detected and handled properly."),

    docHeading("6. Proposed System"),
    para("The proposed system centralizes security operations in one platform. Logs are ingested by the backend, saved in PostgreSQL, evaluated against detection rules, and shown in the dashboard. When rules match, alerts are created and streamed to the UI. Analysts can acknowledge alerts, create incidents, add timeline notes, and use AI Analysis to summarize threats and response actions."),

    docHeading("7. Technologies Used"),
    bullet("Frontend: React 18, Vite, TailwindCSS, Recharts, Socket.IO client."),
    bullet("Backend: Node.js, Express.js, Socket.IO, Bull queue."),
    bullet("Database: PostgreSQL 16."),
    bullet("Cache and Queue: Redis 7."),
    bullet("Authentication: JWT, bcrypt, role-based access control."),
    bullet("AI: Anthropic Claude integration with offline fallback mode."),
    bullet("Deployment: Docker Compose."),

    docHeading("8. Main Modules"),
    bullet("Dashboard: shows event volume, severity distribution, top sources, asset health, and open alert metrics."),
    bullet("Logs: displays searchable and filterable security events."),
    bullet("Alerts: shows detections generated by enabled rules and supports triage actions."),
    bullet("Incidents: manages confirmed security cases with linked evidence and timeline notes."),
    bullet("AI Analysis: supports triage, forensics, IOC extraction, threat hunting, and incident reporting."),
    bullet("Rules: allows admins to create and manage detection logic."),
    bullet("Database: stores all operational records for proof and reporting."),

    docHeading("9. Real-World Attack Monitoring Proof"),
    para("The project includes an attack simulation script that sends brute force, SQL injection, suspicious login correlation, and credential dumping logs. The platform stores these logs, triggers matching alerts, updates dashboard metrics, and allows the analyst to create incidents and run AI analysis. This proves end-to-end SIEM functionality."),

    docHeading("10. Database Design Summary"),
    bullet("users: stores login accounts and roles."),
    bullet("log_sources: stores source identities and API keys."),
    bullet("logs: stores raw and normalized security events."),
    bullet("rules: stores detection logic."),
    bullet("alerts: stores alerts generated by matching rules."),
    bullet("incidents: stores SOC investigation cases."),
    bullet("ai_analyses: stores AI analysis history."),
    bullet("audit_log: stores important user and security actions."),

    docHeading("11. Expected Output"),
    bullet("A working SIEM dashboard with real-time monitoring."),
    bullet("Attack logs visible in the Logs page and PostgreSQL database."),
    bullet("Rule-based alerts for brute force, SQL injection, credential dumping, and login correlation."),
    bullet("Incident records with linked logs, alerts, and analyst timeline."),
    bullet("AI-generated or offline analysis history for SOC investigation."),
    bullet("Project documentation, PDF guide, synopsis, and presentation slides."),

    docHeading("12. Conclusion"),
    para("The SOC Platform AI SIEM demonstrates a complete security monitoring workflow from log ingestion to incident response. It provides a practical learning platform for cybersecurity operations and proves that attacks can be detected, analyzed, documented, and reviewed using database-backed evidence."),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Times New Roman", size: 24 },
          paragraph: { spacing: { line: 320, after: 160 } },
        },
      },
    },
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(synopsisPath, buffer);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slideXml({ heading: slideTitle, bullets = [], note = "" }, index) {
  const titleShape = `
    <p:sp>
      <p:nvSpPr><p:cNvPr id="2" name="Title ${index}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
      <p:spPr><a:xfrm><a:off x="610000" y="360000"/><a:ext cx="10900000" cy="620000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
      <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="3200" b="1"><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:rPr><a:t>${xmlEscape(slideTitle)}</a:t></a:r></a:p></p:txBody>
    </p:sp>`;

  const bulletParagraphs = bullets.map((item) => `
    <a:p>
      <a:pPr marL="342900" indent="-171450"><a:buChar char="•"/></a:pPr>
      <a:r><a:rPr lang="en-US" sz="2050"><a:solidFill><a:srgbClr val="DCEBFF"/></a:solidFill></a:rPr><a:t>${xmlEscape(item)}</a:t></a:r>
    </a:p>`).join("");

  const bodyShape = `
    <p:sp>
      <p:nvSpPr><p:cNvPr id="3" name="Content ${index}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
      <p:spPr><a:xfrm><a:off x="760000" y="1300000"/><a:ext cx="10500000" cy="4450000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr>
      <p:txBody><a:bodyPr wrap="square"/><a:lstStyle/>${bulletParagraphs}</p:txBody>
    </p:sp>`;

  const noteShape = note ? `
    <p:sp>
      <p:nvSpPr><p:cNvPr id="4" name="Footer ${index}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
      <p:spPr><a:xfrm><a:off x="760000" y="6200000"/><a:ext cx="10500000" cy="390000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr>
      <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="1500" i="1"><a:solidFill><a:srgbClr val="8AD8FF"/></a:solidFill></a:rPr><a:t>${xmlEscape(note)}</a:t></a:r></a:p></p:txBody>
    </p:sp>` : "";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="07111F"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      ${titleShape}
      ${bodyShape}
      ${noteShape}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

const slides = [
  {
    heading: "SOC Platform AI SIEM",
    bullets: [
      "Real-time threat monitoring and SOC workflow platform",
      "Built with React, Node.js, PostgreSQL, Redis, and Docker",
      "Supports logs, alerts, incidents, rules, and AI-assisted analysis",
    ],
    note: "Project presentation - Academic Year 2025-26",
  },
  {
    heading: "Problem Statement",
    bullets: [
      "Security logs are often spread across many tools and files",
      "Manual analysis makes real attacks difficult to detect quickly",
      "Alerts, incidents, evidence, and investigation notes need one workflow",
      "A database-backed SIEM is required to prove monitoring and response",
    ],
  },
  {
    heading: "Project Objectives",
    bullets: [
      "Collect and store security logs from firewall and endpoint sources",
      "Detect attacks using configurable detection rules",
      "Generate alerts and support analyst triage",
      "Create incidents with linked logs, alerts, and timeline notes",
      "Use AI Analysis for triage, forensics, IOC extraction, and reports",
    ],
  },
  {
    heading: "Technology Stack",
    bullets: [
      "Frontend: React 18, Vite, TailwindCSS, Recharts",
      "Backend: Node.js, Express.js, Socket.IO",
      "Database: PostgreSQL 16",
      "Queue and cache: Redis 7 with Bull",
      "Deployment: Docker Compose",
      "Security: JWT auth, bcrypt, RBAC, Joi validation",
    ],
  },
  {
    heading: "System Architecture",
    bullets: [
      "Security sources send logs to backend API or syslog listener",
      "Backend normalizes and queues logs",
      "PostgreSQL stores users, logs, rules, alerts, incidents, and AI records",
      "Alert engine evaluates enabled rules",
      "Socket.IO streams live updates to the dashboard",
    ],
  },
  {
    heading: "Main Modules",
    bullets: [
      "Dashboard: event volume, severity distribution, top sources, asset health",
      "Logs: searchable and filterable event records",
      "Alerts: open detections, acknowledgement, and resolution",
      "Incidents: case management with evidence and timeline",
      "Rules: pattern, regex, threshold, field match, and correlation logic",
      "AI Analysis: SOC investigation support",
    ],
  },
  {
    heading: "Detection Rules",
    bullets: [
      "Pattern rule: simple keyword detection",
      "Regex rule: payload patterns like SQL injection or XSS",
      "Threshold rule: repeated activity in a time window",
      "Field match rule: match source, user, host, category, or IP",
      "Correlation rule: repeated failures followed by login success",
    ],
  },
  {
    heading: "Real-World Attack Demo",
    bullets: [
      "PowerShell simulator sends realistic attack logs",
      "Brute force login attempts trigger threshold alert",
      "SQL injection payload triggers regex alert",
      "Credential dumping indicator triggers endpoint alert",
      "Suspicious login sequence triggers correlation alert",
    ],
  },
  {
    heading: "Database Records",
    bullets: [
      "users: login accounts and roles",
      "log_sources: firewall and endpoint source keys",
      "logs: raw and normalized SIEM events",
      "rules: detection logic",
      "alerts: detections generated from rules",
      "incidents: SOC investigation cases",
      "ai_analyses: AI output history",
    ],
  },
  {
    heading: "SOC Workflow",
    bullets: [
      "Monitor dashboard for live threat metrics",
      "Search Logs by severity, source, user, host, IP, or run id",
      "Review and acknowledge alerts",
      "Create incident and link evidence",
      "Run AI Analysis for triage and response recommendations",
      "Close incident after containment and documentation",
    ],
  },
  {
    heading: "Expected Output",
    bullets: [
      "Dashboard counters update after attack simulation",
      "Logs page shows attack evidence",
      "Alerts page shows rule-triggered detections",
      "Incidents page stores linked evidence and timeline",
      "AI Analysis page stores investigation output",
      "Database queries prove records are saved",
    ],
  },
  {
    heading: "Advantages",
    bullets: [
      "Centralized monitoring for SOC operations",
      "Real-time alerting and dashboard visibility",
      "Database-backed evidence for project demonstration",
      "Configurable rules for new attack scenarios",
      "Dockerized setup for repeatable deployment",
      "Extensible design for threat intelligence and SOAR",
    ],
  },
  {
    heading: "Conclusion",
    bullets: [
      "The project demonstrates a complete SIEM workflow",
      "It proves log ingestion, detection, alerting, incident response, and AI analysis",
      "It is useful for cybersecurity learning and academic demonstration",
      "Future scope includes threat intelligence feeds, automated response, and advanced correlation",
    ],
  },
];

function relsXml(rels) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${rels.map((rel) => `  <Relationship Id="${rel.id}" Type="${rel.type}" Target="${rel.target}"/>`).join("\n")}
</Relationships>`;
}

async function generatePpt() {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  ${slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("\n  ")}
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`);

  zip.file("_rels/.rels", relsXml([
    { id: "rId1", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument", target: "ppt/presentation.xml" },
    { id: "rId2", type: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", target: "docProps/core.xml" },
    { id: "rId3", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties", target: "docProps/app.xml" },
  ]));

  zip.file("docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${xmlEscape(title)} Presentation</dc:title>
  <dc:subject>AI SIEM project presentation</dc:subject>
  <dc:creator>Codex</dc:creator>
  <cp:keywords>SIEM, SOC, Cybersecurity, Logs, Alerts, Incidents</cp:keywords>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`);

  zip.file("docProps/app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
  <PresentationFormat>Wide</PresentationFormat>
  <Slides>${slides.length}</Slides>
</Properties>`);

  const presRels = [
    { id: "rId1", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster", target: "slideMasters/slideMaster1.xml" },
    ...slides.map((_, i) => ({ id: `rId${i + 2}`, type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide", target: `slides/slide${i + 1}.xml` })),
    { id: `rId${slides.length + 2}`, type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme", target: "theme/theme1.xml" },
  ];
  zip.file("ppt/_rels/presentation.xml.rels", relsXml(presRels));

  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst>
    ${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`).join("\n    ")}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="wide"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`);

  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", relsXml([
    { id: "rId1", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout", target: "../slideLayouts/slideLayout1.xml" },
    { id: "rId2", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme", target: "../theme/theme1.xml" },
  ]));

  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
  <p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles>
</p:sldMaster>`);

  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", relsXml([
    { id: "rId1", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster", target: "../slideMasters/slideMaster1.xml" },
  ]));

  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>`);

  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="AI SIEM Theme">
  <a:themeElements>
    <a:clrScheme name="AI SIEM"><a:dk1><a:srgbClr val="07111F"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="102033"/></a:dk2><a:lt2><a:srgbClr val="DCEBFF"/></a:lt2><a:accent1><a:srgbClr val="38BDF8"/></a:accent1><a:accent2><a:srgbClr val="22C55E"/></a:accent2><a:accent3><a:srgbClr val="F97316"/></a:accent3><a:accent4><a:srgbClr val="EF4444"/></a:accent4><a:accent5><a:srgbClr val="A78BFA"/></a:accent5><a:accent6><a:srgbClr val="FACC15"/></a:accent6><a:hlink><a:srgbClr val="38BDF8"/></a:hlink><a:folHlink><a:srgbClr val="A78BFA"/></a:folHlink></a:clrScheme>
    <a:fontScheme name="Office"><a:majorFont><a:latin typeface="Aptos Display"/></a:majorFont><a:minorFont><a:latin typeface="Aptos"/></a:minorFont></a:fontScheme>
    <a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>
  </a:themeElements>
</a:theme>`);

  slides.forEach((slide, i) => {
    zip.file(`ppt/slides/slide${i + 1}.xml`, slideXml(slide, i + 1));
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, relsXml([
      { id: "rId1", type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout", target: "../slideLayouts/slideLayout1.xml" },
    ]));
  });

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await fs.writeFile(pptPath, buffer);
}

await fs.mkdir(docsDir, { recursive: true });
await generateSynopsis();
await generatePpt();

console.log(`Synopsis: ${synopsisPath}`);
console.log(`Presentation: ${pptPath}`);
