import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
let pptxgen;
try {
  pptxgen = require("pptxgenjs");
} catch {
  pptxgen = require("C:/Users/bpava/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs");
}

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "docs", "AI_SIEM_Platform_Reference_Style_Presentation.pptx");

const pptx = new pptxgen();
pptx.author = "AI SIEM Platform";
pptx.subject = "Real-Time Security Monitoring, Alerting and Incident Response System";
pptx.title = "AI SIEM Platform";
pptx.company = "Sri HR Sriramulu Memorial College";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Times New Roman",
  bodyFontFace: "Times New Roman",
  lang: "en-US",
};
pptx.defineLayout({ name: "CUSTOM_4X3", width: 10, height: 7.5 });
pptx.layout = "CUSTOM_4X3";

const C = {
  bg: "F5F8FB",
  ink: "102033",
  navy: "08345C",
  blue: "0C76B7",
  cyan: "15A3D7",
  dark: "071728",
  white: "FFFFFF",
  gold: "F0B429",
  red: "C62828",
  green: "188A42",
  gray: "5F6B7A",
  lightBlue: "DCEEFF",
  line: "90A4B8",
};

function addBase(slide, title, slideNo) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.62, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addText(title, { x: 0.28, y: 0.14, w: 8.8, h: 0.34, fontFace: "Times New Roman", fontSize: 18, bold: true, color: C.white, margin: 0 });
  slide.addText(String(slideNo), { x: 9.35, y: 0.18, w: 0.38, h: 0.24, fontFace: "Times New Roman", fontSize: 10, color: C.white, align: "right", margin: 0 });
  slide.addShape(pptx.ShapeType.line, { x: 0.22, y: 7.18, w: 9.56, h: 0, line: { color: C.line, width: 1 } });
  slide.addText("AI SIEM Platform  |  Department of Computer Applications", { x: 0.3, y: 7.22, w: 7.4, h: 0.18, fontSize: 7.5, color: C.gray, margin: 0 });
}

function bulletSlide(title, bullets, slideNo, opts = {}) {
  const slide = pptx.addSlide();
  addBase(slide, title, slideNo);
  const x = opts.x ?? 0.65;
  let y = opts.y ?? 1.18;
  const fontSize = opts.fontSize ?? 20;
  for (const b of bullets) {
    slide.addShape(pptx.ShapeType.chevron, { x, y: y + 0.03, w: 0.22, h: 0.22, fill: { color: C.cyan }, line: { color: C.cyan } });
    slide.addText(b, { x: x + 0.38, y, w: 8.2, h: 0.42, fontFace: "Times New Roman", fontSize, color: C.ink, breakLine: false, fit: "shrink", margin: 0.02 });
    y += opts.gap ?? 0.72;
  }
  return slide;
}

function paragraphSlide(title, paragraphs, slideNo) {
  const slide = pptx.addSlide();
  addBase(slide, title, slideNo);
  let y = 1.08;
  for (const text of paragraphs) {
    slide.addText(text, { x: 0.68, y, w: 8.72, h: 1.08, fontFace: "Times New Roman", fontSize: 16, color: C.ink, fit: "shrink", valign: "mid", margin: 0.08, breakLine: false });
    y += 1.35;
  }
  return slide;
}

function titleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 7.5, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.35, y: 0.35, w: 9.3, h: 6.8, fill: { color: "0C2037", transparency: 8 }, line: { color: C.cyan, width: 1.2 } });
  slide.addText("AI SIEM PLATFORM", { x: 0.65, y: 0.92, w: 8.7, h: 0.55, fontFace: "Times New Roman", fontSize: 30, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("REAL-TIME SECURITY MONITORING, ALERTING AND INCIDENT RESPONSE SYSTEM", { x: 0.8, y: 1.62, w: 8.4, h: 0.38, fontFace: "Times New Roman", fontSize: 13, bold: true, color: C.gold, align: "center", margin: 0 });
  slide.addText("DEVELOPED IN REACT, NODE.JS, POSTGRESQL, REDIS AND DOCKER", { x: 0.8, y: 2.15, w: 8.4, h: 0.32, fontFace: "Times New Roman", fontSize: 12, color: "D5E8F8", align: "center", margin: 0 });
  slide.addText("PRESENTED BY :-", { x: 1.1, y: 3.08, w: 2.3, h: 0.28, fontFace: "Times New Roman", fontSize: 14, bold: true, color: C.white, margin: 0 });
  slide.addText("Student Name: ______________________\nRegister No: _______________________", { x: 3.35, y: 2.98, w: 5.55, h: 0.68, fontFace: "Times New Roman", fontSize: 14, color: C.white, margin: 0.02 });
  slide.addText("GUIDE :-", { x: 1.1, y: 4.03, w: 2.3, h: 0.28, fontFace: "Times New Roman", fontSize: 14, bold: true, color: C.white, margin: 0 });
  slide.addText("Guide Name: ______________________\nLecturer", { x: 3.35, y: 3.95, w: 5.55, h: 0.55, fontFace: "Times New Roman", fontSize: 14, color: C.white, margin: 0.02 });
  slide.addText("SRI HR SRIRAMULU MEMORIAL COLLEGE, SARASWATHIGIRI\nGANGAVATHI", { x: 0.85, y: 6.1, w: 8.3, h: 0.58, fontFace: "Times New Roman", fontSize: 14, bold: true, color: C.white, align: "center", margin: 0 });
}

function diagramNode(slide, x, y, w, h, text, color = C.lightBlue) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color }, line: { color: C.blue, width: 1.2 } });
  slide.addText(text, { x: x + 0.08, y: y + 0.08, w: w - 0.16, h: h - 0.16, fontFace: "Times New Roman", fontSize: 13, bold: true, color: C.ink, align: "center", valign: "mid", fit: "shrink", margin: 0.02 });
}

function addArrow(slide, x1, y1, x2, y2) {
  slide.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: C.blue, width: 2, beginArrowType: "none", endArrowType: "triangle" } });
}

function architectureSlide(slideNo) {
  const slide = pptx.addSlide();
  addBase(slide, "Architectural Diagram", slideNo);
  diagramNode(slide, 0.45, 1.2, 1.55, 0.72, "Log Sources\nWazuh / Sysmon");
  diagramNode(slide, 2.35, 1.2, 1.55, 0.72, "Collector API\nSyslog 5514");
  diagramNode(slide, 4.25, 1.2, 1.55, 0.72, "Node.js\nBackend");
  diagramNode(slide, 6.15, 1.2, 1.55, 0.72, "React\nDashboard");
  diagramNode(slide, 4.25, 3.05, 1.55, 0.72, "Redis\nQueue/Cache", "E8F7EA");
  diagramNode(slide, 2.35, 3.05, 1.55, 0.72, "PostgreSQL\nDatabase", "FFF0D4");
  diagramNode(slide, 6.15, 3.05, 1.55, 0.72, "AI Analysis\nModule", "F0E7FF");
  diagramNode(slide, 4.25, 5.0, 1.55, 0.72, "Alerts &\nIncidents", "FFE4E2");
  addArrow(slide, 2.0, 1.56, 2.35, 1.56);
  addArrow(slide, 3.9, 1.56, 4.25, 1.56);
  addArrow(slide, 5.8, 1.56, 6.15, 1.56);
  addArrow(slide, 5.02, 1.92, 5.02, 3.05);
  addArrow(slide, 4.25, 3.41, 3.9, 3.41);
  addArrow(slide, 5.8, 3.41, 6.15, 3.41);
  addArrow(slide, 5.02, 3.77, 5.02, 5.0);
  slide.addText("Figure: AI SIEM Platform three-layer architecture with collection, processing, storage and analyst interface.", { x: 0.6, y: 6.35, w: 8.8, h: 0.3, fontSize: 12, italic: true, color: C.gray, align: "center", margin: 0 });
}

function processSlide(slideNo) {
  const slide = pptx.addSlide();
  addBase(slide, "PROCESS FLOW DIAGRAM", slideNo);
  const nodes = [
    ["Login", 0.55, 1.28], ["Collect Logs", 2.05, 1.28], ["Normalize", 3.55, 1.28],
    ["Apply Rules", 5.05, 1.28], ["Generate Alert", 6.55, 1.28], ["Create Incident", 6.55, 3.2],
    ["AI Analysis", 5.05, 3.2], ["Response Action", 3.55, 3.2], ["Close Case", 2.05, 3.2],
  ];
  for (const [txt, x, y] of nodes) diagramNode(slide, x, y, 1.18, 0.62, txt);
  for (let i = 0; i < 4; i += 1) addArrow(slide, 0.55 + (i + 1) * 1.5 - 0.32, 1.59, 0.55 + (i + 1) * 1.5, 1.59);
  addArrow(slide, 7.14, 1.9, 7.14, 3.2);
  addArrow(slide, 6.55, 3.51, 6.23, 3.51);
  addArrow(slide, 5.05, 3.51, 4.73, 3.51);
  addArrow(slide, 3.55, 3.51, 3.23, 3.51);
  slide.addText("The process moves from secure login to log monitoring, alert creation, incident response and final closure.", { x: 0.8, y: 5.55, w: 8.4, h: 0.6, fontSize: 18, color: C.ink, align: "center", margin: 0.02 });
}

function useCaseSlide(slideNo) {
  const slide = pptx.addSlide();
  addBase(slide, "USE CASE DIAGRAM", slideNo);
  diagramNode(slide, 0.55, 1.25, 1.15, 0.55, "Admin", "FFF0D4");
  diagramNode(slide, 0.55, 2.6, 1.15, 0.55, "Analyst", "FFF0D4");
  diagramNode(slide, 0.55, 3.95, 1.15, 0.55, "Viewer", "FFF0D4");
  const cases = [
    ["Manage Users", 3.0, 0.95], ["Manage Rules", 5.25, 0.95],
    ["Monitor Logs", 3.0, 2.0], ["Triage Alerts", 5.25, 2.0],
    ["Create Incident", 3.0, 3.05], ["Run AI Analysis", 5.25, 3.05],
    ["View Dashboard", 4.1, 4.3],
  ];
  for (const [txt, x, y] of cases) {
    slide.addShape(pptx.ShapeType.ellipse, { x, y, w: 1.72, h: 0.56, fill: { color: C.lightBlue }, line: { color: C.blue, width: 1.1 } });
    slide.addText(txt, { x: x + 0.05, y: y + 0.15, w: 1.62, h: 0.22, fontSize: 11, bold: true, color: C.ink, align: "center", margin: 0 });
  }
  [[1.7,1.52,3,1.22],[1.7,1.52,5.25,1.22],[1.7,2.87,3,2.27],[1.7,2.87,5.25,2.27],[1.7,2.87,3,3.32],[1.7,2.87,5.25,3.32],[1.7,4.22,4.1,4.57]].forEach(a => addArrow(slide, ...a));
}

function screenshotSlide(title, slideNo, labels) {
  const slide = pptx.addSlide();
  addBase(slide, title, slideNo);
  slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.05, w: 8.8, h: 5.65, fill: { color: "091827" }, line: { color: C.blue, width: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.05, w: 1.35, h: 5.65, fill: { color: "0E2033" }, line: { color: "0E2033" } });
  ["Dashboard", "Logs", "Alerts", "Incidents", "AI Analysis", "Rules"].forEach((t, idx) => {
    slide.addText(t, { x: 0.78, y: 1.45 + idx * 0.55, w: 0.95, h: 0.18, fontSize: 7.8, color: idx === 4 ? C.cyan : C.white, margin: 0 });
  });
  slide.addText(title, { x: 2.18, y: 1.32, w: 6.7, h: 0.34, fontSize: 18, bold: true, color: C.white, margin: 0 });
  labels.forEach((l, idx) => {
    const x = 2.18 + (idx % 2) * 3.38;
    const y = 2.0 + Math.floor(idx / 2) * 1.15;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.0, h: 0.75, rectRadius: 0.06, fill: { color: "15283F" }, line: { color: "2B4968", width: 0.8 } });
    slide.addText(l, { x: x + 0.14, y: y + 0.23, w: 2.72, h: 0.22, fontSize: 12, color: C.white, bold: true, align: "center", margin: 0 });
  });
}

titleSlide();
bulletSlide("ABSTRACT", [
  "A web-based SIEM platform for real-time security monitoring",
  "Handles log ingestion, detection rules, alerts and incidents",
  "Built using React, Node.js, PostgreSQL, Redis and Docker",
  "Provides dashboard monitoring and AI-assisted SOC analysis",
  "Improves visibility, response speed and security investigation"
], 2, { fontSize: 18 });
bulletSlide("INTRODUCTION", [
  "Organizations generate large volumes of security logs every day",
  "Manual log checking is slow and error-prone",
  "SIEM platforms centralize events and detect suspicious activity",
  "This project creates a practical SOC monitoring application",
  "It supports logs, alerts, incidents, rules and AI analysis"
], 3, { fontSize: 18 });
bulletSlide("PROPOSED SOLUTION", [
  "Digital platform to manage security events in one system",
  "Automatic log ingestion through API and syslog collector",
  "Detection rules generate alerts for suspicious behavior",
  "Incident module supports analyst investigation workflow",
  "AI module provides threat summary, IOCs and response steps"
], 4, { fontSize: 18 });
bulletSlide("PROJECT SCOPE", [
  "Covers real-time log collection and monitoring",
  "Tracks endpoint, network and authentication events",
  "Generates alerts using configurable detection rules",
  "Stores all logs, alerts and incidents in PostgreSQL",
  "Can be expanded with cloud agents and SOAR workflows"
], 5, { fontSize: 18 });
bulletSlide("PROJECT PURPOSE", [
  "To simplify SOC monitoring through automation",
  "To maintain accurate security logs and alert records",
  "To improve incident response and investigation speed",
  "To provide AI-assisted security analysis",
  "To demonstrate real-world SIEM concepts in an academic project"
], 6, { fontSize: 18 });
bulletSlide("DOMAIN SURVEY", [
  "Security teams use SIEM tools to collect and analyze events",
  "Manual monitoring cannot handle large log volumes",
  "Attack detection requires correlation, prioritization and history",
  "SOC analysts need dashboards, alert queues and incident records",
  "AI support is increasingly used for investigation summaries"
], 7, { fontSize: 18 });
bulletSlide("EXISTING SYSTEM", [
  "Security logs are often stored separately in different tools",
  "No centralized alert and incident workflow",
  "Manual investigation takes more time",
  "Lack of AI-supported analysis and MITRE mapping",
  "High chance of missing important attack indicators"
], 8, { fontSize: 18 });
bulletSlide("PROPOSED SYSTEM", [
  "Collects logs from API, syslog and demo attack sources",
  "Normalizes and stores events in PostgreSQL",
  "Uses rules to detect brute force, SQL injection and credential dumping",
  "Provides dashboard, logs, alerts, incidents and AI analysis pages",
  "Reduces manual work and improves security visibility"
], 9, { fontSize: 18 });
bulletSlide("Requirement Specification", [
  "Client Processor: 1.5 GHz or higher",
  "Client RAM: Minimum 4 GB",
  "Server Processor: 2.0 GHz or higher",
  "Server RAM: Minimum 8 GB, recommended 16 GB",
  "Storage: 20 GB or more for containers, logs and database"
], 10, { fontSize: 17 });
bulletSlide("Software Requirement", [
  "Client Side: Windows / Linux / macOS with modern browser",
  "Frontend: React 18, Vite, TailwindCSS and Recharts",
  "Backend: Node.js, Express and Socket.IO",
  "Database: PostgreSQL and Redis",
  "Deployment: Docker Compose"
], 11, { fontSize: 17 });
paragraphSlide("Introduction to React", [
  "React is a JavaScript library used for developing component-based user interfaces. In this project, React is used to build the dashboard, logs page, alerts page, incidents page, rules page and AI analysis page.",
  "React allows the application to update the interface quickly when new logs or alerts arrive. It works with API calls and Socket.IO to provide a real-time SOC experience.",
  "The frontend uses reusable components such as metric cards, charts, tables, filters and analysis panels to make the application easier to maintain."
], 12);
paragraphSlide("Introduction to JavaScript / Node.js", [
  "JavaScript is used on both frontend and backend in this project. On the frontend it handles user interaction, page routing and API communication.",
  "Node.js runs JavaScript on the server side. It powers the Express backend, authentication, log ingestion, alert processing and AI analysis APIs.",
  "Using JavaScript across the stack makes development consistent and helps connect the user interface with backend services smoothly."
], 13);
paragraphSlide("INTRODUCTION TO CSS", [
  "CSS is used to design and format web pages. In this project, TailwindCSS and custom styles are used to create a dark SOC dashboard interface.",
  "The style system improves readability for logs, alerts, charts and analysis results. Consistent colors help distinguish severity levels like critical, high, medium and low.",
  "Responsive styling allows the application to remain usable on different screen sizes during project demonstration."
], 14);
paragraphSlide("INTRODUCTION TO POSTGRESQL AND REDIS", [
  "PostgreSQL is a relational database used to store users, log sources, logs, alerts, incidents, rules, AI analysis history and audit logs.",
  "Redis is used for rate limiting, queue support, caching and real-time processing support. It helps the system handle repeated ingestion and analysis requests.",
  "Together PostgreSQL and Redis provide reliable storage and fast operational support for the SIEM platform."
], 15);
architectureSlide(16);
bulletSlide("EXPLAINATION :", [
  "Source Module: Receives logs from API, syslog and security tools",
  "Backend Module: Validates, normalizes and processes events",
  "Rule Module: Detects suspicious activities",
  "AI Module: Generates SOC analysis and response guidance",
  "Database Module: Stores all logs, alerts and incident records"
], 17, { fontSize: 18 });
processSlide(18);
bulletSlide("EXPLAINATION :", [
  "User logs into the SIEM platform",
  "Security events are collected from sources",
  "System normalizes and stores log data",
  "Rules identify suspicious activity",
  "Alerts and incidents are generated for analyst response",
  "AI analysis provides summary and remediation actions"
], 19, { fontSize: 17 });
useCaseSlide(20);
bulletSlide("EXPLAINATION :", [
  "Admin manages users, rules and platform settings",
  "Analyst monitors logs and triages alerts",
  "Viewer checks dashboard and reports",
  "System creates alerts from detection rules",
  "AI module helps with investigation and response"
], 21, { fontSize: 18 });
bulletSlide("Screenshots", [
  "Login page",
  "Dashboard page",
  "Logs page",
  "Alerts page",
  "Incidents page",
  "AI Analysis page",
  "Rules page"
], 22, { fontSize: 22, gap: 0.62 });
screenshotSlide("Login Page", 23, ["Secure Admin Login", "JWT Authentication", "Role Based Access", "Session Control"]);
screenshotSlide("Dashboard Page", 24, ["Security Metrics", "Event Volume", "Severity Donut", "Threat Map"]);
screenshotSlide("Logs Page", 25, ["Live Log Stream", "Severity Filter", "Source Filter", "Export Logs"]);
screenshotSlide("Alerts Page", 26, ["Alert Queue", "Severity Status", "Acknowledge Alert", "Create Incident"]);
screenshotSlide("Incidents Page", 27, ["Incident Table", "Status Tracking", "Evidence Timeline", "Response Notes"]);
screenshotSlide("AI Analysis Page", 28, ["Runbook Buttons", "Evidence Input", "MITRE Mapping", "Response Actions"]);
screenshotSlide("Rules Page", 29, ["Rule List", "Enable/Disable", "Detection Logic", "Severity Mapping"]);
bulletSlide("Database Tables", [
  "users: stores login and role details",
  "log_sources: stores source names and API key hashes",
  "logs: stores normalized security events",
  "alerts: stores generated detections",
  "incidents: stores investigation records",
  "rules: stores detection conditions and severity"
], 30, { fontSize: 17 });
bulletSlide("Future Enhancements", [
  "Cloud deployment with HTTPS and domain name",
  "Real Wazuh, Sysmon, Suricata and Zeek integration",
  "Advanced threat intelligence enrichment",
  "Automated PDF incident report generation",
  "Mobile dashboard and notification support"
], 31, { fontSize: 18 });
bulletSlide("Conclusion", [
  "The system reduces manual log analysis work",
  "Improves alert visibility and response workflow",
  "Provides database-backed records for investigation",
  "AI analysis helps analysts understand attack evidence",
  "Future upgrades can make it suitable for production deployment"
], 32, { fontSize: 18 });
bulletSlide("BIBILOGRAPHY", [
  "React Documentation: https://react.dev/",
  "Node.js Documentation: https://nodejs.org/",
  "PostgreSQL Documentation: https://www.postgresql.org/docs/",
  "Redis Documentation: https://redis.io/docs/",
  "MITRE ATT&CK: https://attack.mitre.org/",
  "Wazuh Documentation: https://documentation.wazuh.com/"
], 33, { fontSize: 14.5, gap: 0.56 });
{
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addText("Thank You", { x: 1.3, y: 2.45, w: 7.4, h: 0.8, fontFace: "Times New Roman", fontSize: 44, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("AI SIEM Platform", { x: 1.3, y: 3.35, w: 7.4, h: 0.35, fontFace: "Times New Roman", fontSize: 18, color: C.gold, align: "center", margin: 0 });
  slide.addText("Questions?", { x: 1.3, y: 4.05, w: 7.4, h: 0.35, fontFace: "Times New Roman", fontSize: 18, color: "D5E8F8", align: "center", margin: 0 });
}

await fs.mkdir(path.dirname(out), { recursive: true });
await pptx.writeFile({ fileName: out });
console.log(out);
