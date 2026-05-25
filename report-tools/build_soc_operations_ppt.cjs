const fs = require("fs");
const path = require("path");
const pptxgen = require("./node_modules/pptxgenjs");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");
fs.mkdirSync(docsDir, { recursive: true });

const outPath = path.join(docsDir, "AI_SIEM_SOC_Operations_Project_Presentation.pptx");
const logoPath = path.join(root, "outputs", "hrsm-front-page-assets", "hrsm-college-logo.png");

const screenshots = [
  {
    title: "Dashboard Overview",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-13 165723.png",
    note: "Live SOC dashboard showing critical threats, open alerts, event volume, severity distribution, sources, and asset health.",
  },
  {
    title: "Real-Time Monitoring Dashboard",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-21 215427.png",
    note: "Browser view of the dashboard with open alerts, blocked threats, and monitored assets.",
  },
  {
    title: "Log Filter Controls",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-21 215708.png",
    note: "Log filters support severity, source, date range, stream pause, and selected-log analysis actions.",
  },
  {
    title: "Live Logs Stream",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-21 215721.png",
    note: "Collected events appear in a searchable SOC log stream with severity badges and raw-detail expansion.",
  },
  {
    title: "Alert Triage",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-21 215750.png",
    note: "Credential dumping and failed-logon alerts can be acknowledged or resolved from the triage queue.",
  },
  {
    title: "Incident Management",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-21 215819.png",
    note: "Incident creation form converts investigation context into a managed response record.",
  },
  {
    title: "AI Analysis Runbook",
    path: "C:/Users/bpava/OneDrive/Pictures/Screenshots/Screenshot 2026-05-21 215852.png",
    note: "AI runbook area supports threat hunt, anomaly, forensics, triage, and IOC extraction workflows.",
  },
];

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Fayaz";
pptx.company = "Sri HRSM College Gangavathi";
pptx.subject = "SOC Operations project presentation";
pptx.title = "AI SIEM Platform - SOC Operations";
pptx.lang = "en-US";
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};

const C = {
  bg: "07111F",
  panel: "101A2B",
  panel2: "152235",
  line: "263A56",
  cyan: "22C7F2",
  cyan2: "0EA5E9",
  teal: "10B981",
  gold: "F59E0B",
  red: "EF4444",
  white: "FFFFFF",
  text: "E5F2FF",
  muted: "A8B8CF",
  ink: "06111F",
  college: "SRI H.R. SRIRAMULU MEMORIAL COLLEGE, SARASWATHIGIRI, GANGAVATHI",
};

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.toString("ascii", 1, 4) !== "PNG") return { width: 1600, height: 900 };
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function contain(file, x, y, w, h) {
  const s = pngSize(file);
  const r = Math.min(w / s.width, h / s.height);
  const nw = s.width * r;
  const nh = s.height * r;
  return { path: file, x: x + (w - nw) / 2, y: y + (h - nh) / 2, w: nw, h: nh };
}

function addHeader(slide, title, idx) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.62, fill: { color: "050B16" }, line: { transparency: 100 } });
  slide.addText(title.toUpperCase(), { x: 0.48, y: 0.18, w: 5.8, h: 0.18, fontSize: 8.8, bold: true, color: C.cyan, charSpace: 1.2, margin: 0 });
  slide.addText(`${String(idx).padStart(2, "0")} / 35`, { x: 11.8, y: 0.18, w: 0.9, h: 0.18, fontSize: 8.8, bold: true, color: C.muted, align: "right", margin: 0 });
  if (fs.existsSync(logoPath)) slide.addImage({ path: logoPath, x: 12.72, y: 0.08, w: 0.34, h: 0.34 });
  slide.addText(C.college, { x: 0.48, y: 7.18, w: 6.6, h: 0.14, fontSize: 5.8, color: "8290A6", margin: 0 });
}

function addTitle(slide, title, subtitle) {
  slide.addText(title, { x: 0.62, y: 0.95, w: 6.5, h: 0.42, fontSize: 25, bold: true, color: C.white, margin: 0, fit: "shrink" });
  if (subtitle) slide.addText(subtitle, { x: 0.62, y: 1.43, w: 7.9, h: 0.3, fontSize: 10.8, color: C.muted, margin: 0, fit: "shrink" });
}

function addBullets(slide, bullets, x = 0.72, y = 2.04, w = 7.0) {
  bullets.forEach((b, i) => {
    const yy = y + i * 0.62;
    slide.addShape(pptx.ShapeType.ellipse, { x, y: yy + 0.08, w: 0.12, h: 0.12, fill: { color: [C.cyan, C.teal, C.gold, C.red][i % 4] }, line: { transparency: 100 } });
    slide.addText(b, { x: x + 0.28, y: yy, w, h: 0.34, fontSize: 13.2, color: C.text, margin: 0, breakLine: false, fit: "shrink" });
  });
}

function addTagPanel(slide, title, tags, x = 9.15, y = 1.38) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.2, h: 4.9, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.line, width: 1 } });
  slide.addText(title.toUpperCase(), { x: x + 0.26, y: y + 0.3, w: 2.5, h: 0.18, fontSize: 8.2, bold: true, color: C.cyan, charSpace: 1, margin: 0 });
  tags.forEach((tag, i) => {
    const yy = y + 0.82 + i * 0.78;
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.26, y: yy, w: 2.65, h: 0.42, rectRadius: 0.05, fill: { color: i % 2 ? C.panel2 : "0C1726" }, line: { color: C.line, width: 0.7 } });
    slide.addText(tag, { x: x + 0.42, y: yy + 0.13, w: 2.25, h: 0.12, fontSize: 9.5, bold: true, color: C.white, align: "center", margin: 0 });
  });
}

function contentSlide(idx, section, title, subtitle, bullets, tags) {
  const slide = pptx.addSlide();
  addHeader(slide, section, idx);
  addTitle(slide, title, subtitle);
  addBullets(slide, bullets);
  addTagPanel(slide, "Key Points", tags);
  return slide;
}

function cover() {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.bg }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 1.65, h: 7.5, fill: { color: "0E2033" }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 1.65, y: 0.12, w: 11.68, h: 0.12, fill: { color: C.cyan }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 2.74, y: 1.25, w: 0.12, h: 3.7, fill: { color: C.gold }, line: { transparency: 100 } });
  if (fs.existsSync(logoPath)) {
    slide.addImage({ path: logoPath, x: 2.18, y: 0.32, w: 0.78, h: 0.78 });
    slide.addImage({ path: logoPath, x: 10.65, y: 0.38, w: 0.82, h: 0.82 });
  }
  slide.addText("SRI HRSM COLLEGE GANGAVATHI", { x: 3.18, y: 0.82, w: 5.8, h: 0.2, fontSize: 10.5, bold: true, color: C.cyan, margin: 0 });
  slide.addText("PROJECT PRESENTATION", { x: 3.18, y: 1.2, w: 3.2, h: 0.2, fontSize: 11.5, bold: true, color: C.gold, margin: 0 });
  slide.addText("AI SIEM\nPLATFORM", { x: 3.18, y: 1.72, w: 5.0, h: 1.15, fontSize: 38, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText("SOC Operations for Real-Time Threat Monitoring", { x: 3.18, y: 3.02, w: 5.6, h: 0.22, fontSize: 15, bold: true, color: C.cyan, margin: 0 });
  slide.addText("A web-based security operations platform for monitoring logs, detecting alerts, managing incidents, and supporting AI-assisted investigation.", { x: 3.18, y: 3.45, w: 5.6, h: 0.56, fontSize: 12.5, color: C.muted, margin: 0, fit: "shrink" });
  slide.addShape(pptx.ShapeType.roundRect, { x: 3.18, y: 4.42, w: 4.55, h: 0.86, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.line } });
  slide.addText("Frontend: React, Vite, Tailwind CSS\nBackend: Node.js, Express\nDatabase: PostgreSQL, Redis", { x: 3.45, y: 4.64, w: 3.95, h: 0.38, fontSize: 9.4, bold: true, color: C.text, margin: 0, fit: "shrink" });
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.55, y: 1.55, w: 3.1, h: 3.5, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.line } });
  slide.addText("SOC Dashboard", { x: 9.05, y: 2.1, w: 2.05, h: 0.2, fontSize: 13, bold: true, color: C.white, align: "center", margin: 0 });
  [
    ["Critical", "0", C.red],
    ["Open Alerts", "15", C.gold],
    ["Blocked", "1", C.teal],
  ].forEach((m, i) => {
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.95, y: 2.65 + i * 0.58, w: 2.3, h: 0.4, rectRadius: 0.05, fill: { color: "0D1828" }, line: { color: m[2], width: 1 } });
    slide.addText(m[0], { x: 9.12, y: 2.78 + i * 0.58, w: 1.2, h: 0.1, fontSize: 8.5, color: C.muted, margin: 0 });
    slide.addText(m[1], { x: 10.5, y: 2.72 + i * 0.58, w: 0.45, h: 0.14, fontSize: 13, bold: true, color: m[2], align: "right", margin: 0 });
  });
  slide.addText("GUIDE:", { x: 3.2, y: 5.85, w: 1.65, h: 0.24, fontFace: "Georgia", fontSize: 16, bold: true, underline: true, color: "FF0000", align: "center", margin: 0 });
  slide.addText("MISS POOJA G M\nLECTURER", { x: 2.82, y: 6.16, w: 2.4, h: 0.45, fontFace: "Georgia", fontSize: 14.5, color: C.white, align: "center", margin: 0 });
  slide.addText("PRESENTED BY :", { x: 8.02, y: 5.85, w: 2.75, h: 0.24, fontFace: "Georgia", fontSize: 16, bold: true, underline: true, color: "FF0000", align: "center", margin: 0 });
  slide.addText("Fayaz\nU32ZC23S0011", { x: 8.2, y: 6.16, w: 2.4, h: 0.45, fontFace: "Georgia", fontSize: 14.5, color: C.white, align: "center", margin: 0 });
  slide.addText(C.college, { x: 2.55, y: 7.08, w: 6.5, h: 0.13, fontSize: 5.8, color: "8290A6", margin: 0 });
}

function diagramSlide(idx, section, title, subtitle, nodes, footerTags) {
  const slide = pptx.addSlide();
  addHeader(slide, section, idx);
  addTitle(slide, title, subtitle);
  nodes.forEach((n, i) => {
    slide.addShape(pptx.ShapeType.roundRect, { x: n.x, y: n.y, w: n.w, h: n.h, rectRadius: 0.08, fill: { color: n.color || C.panel }, line: { color: n.line || C.cyan, width: 1.2 } });
    slide.addText(n.label, { x: n.x + 0.08, y: n.y + n.h / 2 - 0.08, w: n.w - 0.16, h: 0.16, fontSize: n.fs || 11, bold: true, color: C.white, align: "center", margin: 0, fit: "shrink" });
    if (i < nodes.length - 1 && n.arrow !== false) {
      const next = nodes[i + 1];
      slide.addShape(pptx.ShapeType.chevron, { x: n.x + n.w + 0.12, y: n.y + n.h / 2 - 0.12, w: 0.28, h: 0.24, fill: { color: C.gold }, line: { transparency: 100 } });
    }
  });
  addTagPanel(slide, "SOC Flow", footerTags, 9.2, 1.55);
}

function screenshotSlide(idx, image) {
  const slide = pptx.addSlide();
  addHeader(slide, "Screenshots", idx);
  addTitle(slide, image.title, image.note);
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.62, y: 1.95, w: 12.1, h: 4.75, rectRadius: 0.06, fill: { color: "020814" }, line: { color: C.line, width: 1 } });
  slide.addImage(contain(image.path, 0.82, 2.12, 11.7, 4.35));
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.62, y: 6.86, w: 12.1, h: 0.33, rectRadius: 0.04, fill: { color: C.panel }, line: { color: C.line, width: 0.8 } });
  slide.addText("Screenshot evidence from the running AI SIEM SOC platform", { x: 0.86, y: 6.98, w: 7.2, h: 0.1, fontSize: 8.5, color: C.muted, margin: 0 });
}

cover();

const slides = [
  ["ABSTRACT", "ABSTRACT", "Project summary and expected outcome.", ["AI SIEM Platform centralizes log monitoring, alert detection, incident handling, and AI-based investigation support.", "It gives SOC users one portal to observe live security status, review alerts, inspect logs, and track response actions.", "The system is built as a full-stack web application using React, Node.js, PostgreSQL, Redis, and Docker.", "Its final outcome is a practical SOC lab platform for real-time threat monitoring and demonstration."], ["Central SOC view", "Threat visibility", "Response support"]],
  ["INTRODUCTION", "INTRODUCTION", "Why SOC operations need a connected monitoring workflow.", ["Security teams need continuous visibility into logs, alerts, incidents, and asset health.", "Manual checking of logs is slow and can miss repeated authentication failures or credential dumping indicators.", "A SIEM collects events, correlates activity, and helps analysts prioritize suspicious behavior.", "This project demonstrates those SOC concepts through a working academic web platform."], ["SOC users", "Security admin", "Incident analyst"]],
  ["PROBLEM STATEMENT", "PROBLEM STATEMENT", "Operational gaps found in manual security monitoring.", ["Logs may be stored separately from alerts, making investigation time-consuming.", "Repeated failed logon events or credential dumping indicators can be missed without correlation rules.", "Manual incident tracking makes it difficult to prove what was acknowledged, resolved, or blocked.", "Students need a clear platform to demonstrate SIEM concepts with live screens and database-backed records."], ["Scattered logs", "Slow triage", "Weak evidence"]],
  ["OBJECTIVES", "OBJECTIVES OF THE PROJECT", "Key goals that shape the SOC platform scope.", ["Provide secure login/logout and role-based access for SOC users.", "Display dashboard metrics for critical threats, open alerts, events per second, and blocked threats.", "Support log filtering, alert acknowledgement, alert resolution, and incident creation.", "Provide AI-assisted runbook actions such as triage, anomaly review, forensics, threat hunt, and IOC extraction.", "Run the full lab stack consistently using Docker services."], ["Monitor", "Detect", "Respond"]],
  ["PROJECT SCOPE", "SCOPE OF THE PROJECT", "Coverage boundaries for monitoring, triage, and demonstration.", ["Covers dashboard, logs, alerts, incidents, AI analysis, rules, settings, and database visibility.", "Supports real-world collector style event input and SOC-style alert review.", "Designed for academic lab demonstration rather than production enterprise deployment.", "Can be extended with Wazuh, Elastic, syslog collectors, role policies, and report export."], ["Dashboard", "Triage", "AI runbook"]],
  ["PROPOSED SOLUTION", "PROPOSED SOLUTION", "Integrated SOC portal for real-time threat monitoring.", ["Frontend dashboard presents live security status and analyst workflows.", "Backend APIs handle authentication, logs, alerts, incidents, rules, settings, and analysis requests.", "PostgreSQL stores users, logs, alerts, incidents, rules, audit records, and analysis history.", "Docker Compose runs the complete application stack for repeatable demonstration."], ["Unified portal", "REST APIs", "Database records"]],
  ["DOMAIN SURVEY", "DOMAIN SURVEY", "Current security operations practices behind SIEM platform design.", ["SIEM tools such as Wazuh, Splunk, Elastic Security, and QRadar centralize logs and raise alerts.", "SOC teams follow triage workflows: detect, acknowledge, investigate, contain, resolve, and document.", "Common attack signals include failed logon bursts, credential dumping, suspicious tools, and unusual source activity.", "Dashboards, severity labels, and runbooks help analysts prioritize work quickly."], ["SIEM tools", "SOC lifecycle", "Runbooks"]],
  ["EXISTING SYSTEM", "EXISTING SYSTEM", "Typical limitations in manual or disconnected monitoring.", ["Logs are often reviewed only after an incident is suspected.", "Alerts, raw events, and incident notes may be stored in separate tools.", "Database evidence may require command-line access, which is difficult during a lab demo.", "No single screen explains threat status, affected assets, and response actions together."], ["Manual review", "Separate tools", "Low visibility"]],
  ["PROPOSED SYSTEM", "PROPOSED SYSTEM", "Improved workflow centered on visibility and response speed.", ["Dashboard summarizes operational SOC status in one view.", "Logs page supports filtering by severity, source, and time range.", "Alerts page provides acknowledgement and resolution actions.", "Incidents page records response cases, and AI Analysis supports guided investigation workflows."], ["Faster triage", "Clear evidence", "Guided action"]],
  ["PROJECT MODULES", "MODULES OF THE PROJECT", "Major functional areas that support SOC operations.", ["Authentication and secure access management.", "Dashboard metrics and asset health monitoring.", "Log ingestion, search, filtering, and raw event review.", "Alert triage, acknowledgement, resolution, and blocked-threat clearing.", "Incident management, rules management, AI analysis, settings, and database administration."], ["Auth", "Logs", "Alerts"]],
  ["REQUIREMENT SPECIFICATION", "HARDWARE REQUIREMENT", "Balanced hardware support for student systems and lab execution.", ["Laptop or desktop with modern 64-bit processor.", "Minimum 8 GB RAM recommended for containers and browser testing.", "At least 10 GB free disk space for Docker images, database volumes, and logs.", "Stable local browser environment for frontend, backend, and database GUI access."], ["8 GB RAM", "64-bit CPU", "10 GB disk"]],
  ["SOFTWARE REQUIREMENT", "SOFTWARE REQUIREMENT", "Core software stack for SOC portal execution.", ["Docker Desktop and Docker Compose for running the multi-container stack.", "React with Vite and Tailwind CSS for the frontend user interface.", "Node.js and Express for backend REST API services.", "PostgreSQL for persistent records and Redis for fast supporting state/cache operations."], ["Docker", "React", "Postgres"]],
  ["TECHNOLOGY", "INTRODUCTION TO REACT", "Frontend framework for the SOC user interface.", ["React builds reusable pages for dashboard, logs, alerts, incidents, AI analysis, rules, and settings.", "Component-based structure keeps navigation and SOC panels consistent.", "State management supports authentication, profile details, and current UI data.", "The browser interface makes the lab easier to demonstrate to examiners."], ["Components", "Pages", "State"]],
  ["TECHNOLOGY", "INTRODUCTION TO NODE.JS", "Backend runtime for APIs and SOC workflow logic.", ["Node.js with Express exposes REST endpoints for login, logs, alerts, incidents, rules, and settings.", "Controllers separate request handling from services and database models.", "Middleware supports authentication, rate limits, and security checks.", "The API layer connects the frontend experience to PostgreSQL records."], ["Express", "REST API", "Middleware"]],
  ["TECHNOLOGY", "INTRODUCTION TO TAILWIND CSS", "Visual styling for a dark SOC operations interface.", ["Tailwind CSS provides utility classes for layout, spacing, typography, and responsive behavior.", "Dark panels, severity colors, and compact controls match the security dashboard use case.", "Consistent UI patterns make logs, alerts, and incident screens easy to scan.", "The interface is suitable for repeated live demonstration."], ["Dark UI", "Responsive", "Severity colors"]],
  ["TECHNOLOGY", "INTRODUCTION TO POSTGRESQL AND REDIS", "Data storage and fast state support.", ["PostgreSQL stores users, logs, alerts, incidents, rules, AI analyses, audit logs, and source records.", "Relational tables make it easy to verify evidence during project evaluation.", "Redis supports fast temporary state and future real-time workflow expansion.", "Adminer or database tools can be used to inspect records directly."], ["SQL records", "Evidence", "Cache"]],
];

slides.forEach((s, i) => contentSlide(i + 2, ...s));

diagramSlide(18, "SYSTEM ARCHITECTURE", "ARCHITECTURAL DIAGRAM", "Layered flow from event collection to dashboard and analyst response.", [
  { x: 0.8, y: 2.55, w: 1.65, h: 0.68, label: "Event Sources" },
  { x: 2.9, y: 2.55, w: 1.65, h: 0.68, label: "Collector" },
  { x: 5.0, y: 2.55, w: 1.65, h: 0.68, label: "Backend API" },
  { x: 7.1, y: 2.55, w: 1.65, h: 0.68, label: "PostgreSQL" },
  { x: 5.0, y: 3.75, w: 1.65, h: 0.68, label: "Redis", arrow: false, color: C.panel2, line: C.teal },
  { x: 7.1, y: 1.35, w: 1.65, h: 0.68, label: "React UI", arrow: false, color: C.panel2, line: C.gold },
], ["Collect", "Normalize", "Store", "Display"]);

contentSlide(19, "ARCHITECTURE EXPLANATION", "ARCHITECTURE EXPLANATION", "How the platform layers collaborate during monitoring and response.", ["Event sources generate security activity such as failed logons and suspicious endpoint behavior.", "The collector normalizes events and passes them to backend services.", "Rules evaluate logs and create alerts when suspicious patterns are detected.", "The frontend displays dashboards, log streams, alerts, incidents, and AI runbooks for SOC users."], ["Source", "API", "Frontend"]);

diagramSlide(20, "PROCESS FLOW", "PROCESS FLOW DIAGRAM", "SOC operation journey from event capture to response closure.", [
  { x: 0.7, y: 2.55, w: 1.45, h: 0.65, label: "Login" },
  { x: 2.55, y: 2.55, w: 1.45, h: 0.65, label: "Monitor" },
  { x: 4.4, y: 2.55, w: 1.45, h: 0.65, label: "Review Logs" },
  { x: 6.25, y: 2.55, w: 1.45, h: 0.65, label: "Triage Alert" },
  { x: 8.1, y: 2.55, w: 1.45, h: 0.65, label: "Create Incident" },
  { x: 9.95, y: 2.55, w: 1.45, h: 0.65, label: "Resolve", arrow: false },
], ["Detect", "Investigate", "Contain", "Resolve"]);

contentSlide(21, "PROCESS EXPLANATION", "PROCESS FLOW EXPLANATION", "Sequential logic followed during a standard SOC session.", ["The SOC admin logs in and checks dashboard status.", "The analyst reviews event volume, source activity, asset health, and severity distribution.", "Suspicious logs are filtered and selected for deeper investigation.", "Open alerts are acknowledged, resolved, or escalated into incidents with supporting evidence."], ["Login", "Triage", "Document"]);

diagramSlide(22, "USE CASE DIAGRAM", "USE CASE DIAGRAM", "Main user and admin interactions supported by the platform.", [
  { x: 0.9, y: 2.8, w: 1.4, h: 0.6, label: "SOC Admin", line: C.gold },
  { x: 3.1, y: 1.55, w: 1.8, h: 0.55, label: "View Dashboard" },
  { x: 5.45, y: 1.55, w: 1.8, h: 0.55, label: "Filter Logs" },
  { x: 3.1, y: 2.6, w: 1.8, h: 0.55, label: "Manage Alerts" },
  { x: 5.45, y: 2.6, w: 1.8, h: 0.55, label: "Create Incident" },
  { x: 3.1, y: 3.65, w: 1.8, h: 0.55, label: "Run AI Analysis" },
  { x: 5.45, y: 3.65, w: 1.8, h: 0.55, label: "Manage Rules", arrow: false },
], ["Admin", "Monitor", "Analyze", "Respond"]);

contentSlide(23, "USE CASE EXPLANATION", "USE CASE EXPLANATION", "Responsibilities divided across SOC monitoring and response actions.", ["The SOC admin is the primary actor for the academic demonstration.", "The user can log in, view security status, filter logs, and inspect raw event details.", "Alerts can be acknowledged when investigation begins and resolved when action is complete.", "Incidents and AI analysis provide structured support for documenting investigation steps."], ["Access", "Actions", "Evidence"]);

diagramSlide(24, "DATABASE DESIGN", "CORE DATABASE DESIGN", "Primary entities used to store SOC records and platform activity.", [
  { x: 0.8, y: 1.7, w: 1.7, h: 0.58, label: "users" },
  { x: 3.0, y: 1.7, w: 1.7, h: 0.58, label: "logs" },
  { x: 5.2, y: 1.7, w: 1.7, h: 0.58, label: "alerts" },
  { x: 7.4, y: 1.7, w: 1.7, h: 0.58, label: "incidents" },
  { x: 0.8, y: 3.0, w: 1.7, h: 0.58, label: "rules" },
  { x: 3.0, y: 3.0, w: 1.7, h: 0.58, label: "ai_analyses" },
  { x: 5.2, y: 3.0, w: 1.7, h: 0.58, label: "audit_log" },
  { x: 7.4, y: 3.0, w: 1.7, h: 0.58, label: "log_sources", arrow: false },
], ["Users", "Events", "Alerts", "Incidents"]);

screenshots.forEach((s, i) => screenshotSlide(25 + i, s));

contentSlide(32, "FUTURE ENHANCEMENTS", "FUTURE ENHANCEMENTS", "Possible extensions that can improve the SOC platform.", ["Integrate real Wazuh or Elastic Security event ingestion.", "Add syslog and endpoint collectors for live multi-machine monitoring.", "Improve AI analysis with provider configuration, usage controls, and saved playbooks.", "Add report export, role-based permissions, richer incident timelines, and notification workflows."], ["Wazuh", "Reports", "Roles"]);

contentSlide(33, "CONCLUSION", "CONCLUSION", "The proposed solution improves real-time SOC monitoring and response.", ["AI SIEM Platform demonstrates a working SOC-style monitoring workflow.", "The system combines dashboard metrics, log review, alert triage, incident tracking, and AI-assisted analysis.", "Docker-based deployment makes the project repeatable for lab demonstration.", "The final platform gives clear evidence of security monitoring, investigation, and response operations."], ["Working demo", "Evidence", "SOC ready"]);

contentSlide(34, "BIBLIOGRAPHY", "BIBLIOGRAPHY", "Reference materials used for the technology stack and system planning.", ["React and Vite documentation.", "Node.js and Express documentation.", "PostgreSQL, Redis, Docker, and Docker Compose documentation.", "Wazuh, SIEM concepts, SOC triage workflow references, and project source code."], ["Docs", "SIEM", "Source code"]);

const thanks = pptx.addSlide();
thanks.background = { color: C.bg };
thanks.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.bg }, line: { transparency: 100 } });
if (fs.existsSync(logoPath)) thanks.addImage({ path: logoPath, x: 6.12, y: 0.78, w: 1.05, h: 1.05 });
thanks.addText("THANK YOU", { x: 2.0, y: 2.55, w: 9.3, h: 0.8, fontSize: 46, bold: true, color: C.white, align: "center", margin: 0 });
thanks.addText("Questions and Demonstration", { x: 2.0, y: 3.45, w: 9.3, h: 0.3, fontSize: 18, color: C.cyan, align: "center", margin: 0 });
thanks.addText("AI SIEM Platform - SOC Operations", { x: 2.0, y: 4.18, w: 9.3, h: 0.24, fontSize: 15, color: C.muted, align: "center", margin: 0 });
thanks.addText(C.college, { x: 2.0, y: 6.92, w: 9.3, h: 0.13, fontSize: 6.3, color: "8290A6", align: "center", margin: 0 });

pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(outPath);
});
