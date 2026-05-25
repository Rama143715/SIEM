import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const pptxgen = require("./node_modules/pptxgenjs");

const out = "C:/Users/bpava/OneDrive/Documents/New project/AI_SIEM_Platform_Simple_Presentation.pptx";

const pptx = new pptxgen();
pptx.defineLayout({ name: "CUSTOM_4X3", width: 10, height: 7.5 });
pptx.layout = "CUSTOM_4X3";
pptx.author = "AI SIEM Platform";
pptx.subject = "Simple project presentation";
pptx.title = "AI SIEM Platform";
pptx.theme = {
  headFontFace: "Times New Roman",
  bodyFontFace: "Times New Roman",
  lang: "en-US",
};

const C = {
  bg: "F4F8FC",
  dark: "0B1B2B",
  blue: "0A6EA8",
  cyan: "16A3D7",
  white: "FFFFFF",
  ink: "142336",
  gray: "5D6978",
  gold: "F1B434",
  red: "D94343",
  green: "1E8E4D",
  card: "EAF3FB",
};

function base(slide, title, no) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addText(title, { x: 0.35, y: 0.17, w: 8.8, h: 0.35, fontFace: "Times New Roman", fontSize: 19, bold: true, color: C.white, margin: 0 });
  slide.addText(String(no), { x: 9.32, y: 0.22, w: 0.36, h: 0.2, fontFace: "Times New Roman", fontSize: 9, color: C.white, align: "right", margin: 0 });
}

function bullets(title, items, no) {
  const slide = pptx.addSlide();
  base(slide, title, no);
  let y = 1.25;
  for (const item of items) {
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.82, y: y + 0.08, w: 0.16, h: 0.16, fill: { color: C.cyan }, line: { color: C.cyan } });
    slide.addText(item, { x: 1.15, y, w: 8.0, h: 0.48, fontFace: "Times New Roman", fontSize: 21, color: C.ink, fit: "shrink", margin: 0.02 });
    y += 0.78;
  }
}

function titleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0.45, y: 0.5, w: 9.1, h: 6.5, fill: { color: "102A43" }, line: { color: C.cyan, width: 1.2 } });
  slide.addText("AI SIEM PLATFORM", { x: 0.85, y: 1.25, w: 8.3, h: 0.55, fontFace: "Times New Roman", fontSize: 32, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("Security Monitoring and Incident Response System", { x: 0.85, y: 2.0, w: 8.3, h: 0.35, fontFace: "Times New Roman", fontSize: 17, color: C.gold, align: "center", margin: 0 });
  slide.addText("Developed using React, Node.js, PostgreSQL, Redis and Docker", { x: 0.85, y: 2.55, w: 8.3, h: 0.3, fontFace: "Times New Roman", fontSize: 13, color: "D7EAF8", align: "center", margin: 0 });
  slide.addText("Presented By: __________________________\nGuide: _________________________________", { x: 1.55, y: 4.0, w: 6.9, h: 0.75, fontFace: "Times New Roman", fontSize: 16, color: C.white, align: "center", margin: 0 });
  slide.addText("Department of Computer Applications", { x: 1.2, y: 5.75, w: 7.6, h: 0.3, fontFace: "Times New Roman", fontSize: 15, bold: true, color: C.white, align: "center", margin: 0 });
}

function diagramNode(slide, x, y, w, h, text, fill = C.card) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: C.blue, width: 1.2 } });
  slide.addText(text, { x: x + 0.08, y: y + 0.08, w: w - 0.16, h: h - 0.16, fontFace: "Times New Roman", fontSize: 14, bold: true, color: C.ink, align: "center", valign: "mid", fit: "shrink", margin: 0 });
}

function arrow(slide, x1, y1, x2, y2) {
  slide.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: C.blue, width: 2, endArrowType: "triangle" } });
}

function workingSlide() {
  const slide = pptx.addSlide();
  base(slide, "How The Application Works", 8);
  const nodes = [
    ["Security Logs", 0.6, 1.4], ["Collector", 2.35, 1.4], ["Backend", 4.1, 1.4], ["Database", 5.85, 1.4], ["Dashboard", 7.6, 1.4],
    ["Rules Check", 2.35, 3.55], ["Alerts", 4.1, 3.55], ["Incidents", 5.85, 3.55], ["AI Analysis", 7.6, 3.55],
  ];
  for (const [t, x, y] of nodes) diagramNode(slide, x, y, 1.35, 0.7, t);
  arrow(slide, 1.95, 1.75, 2.35, 1.75);
  arrow(slide, 3.7, 1.75, 4.1, 1.75);
  arrow(slide, 5.45, 1.75, 5.85, 1.75);
  arrow(slide, 7.2, 1.75, 7.6, 1.75);
  arrow(slide, 3.0, 2.1, 3.0, 3.55);
  arrow(slide, 3.7, 3.9, 4.1, 3.9);
  arrow(slide, 5.45, 3.9, 5.85, 3.9);
  arrow(slide, 7.2, 3.9, 7.6, 3.9);
  slide.addText("The system collects security events, checks rules, stores records, shows alerts, and helps analysts respond.", { x: 0.8, y: 5.75, w: 8.4, h: 0.55, fontFace: "Times New Roman", fontSize: 18, color: C.ink, align: "center", margin: 0.02 });
}

function architectureSlide() {
  const slide = pptx.addSlide();
  base(slide, "Architecture Diagram", 9);
  diagramNode(slide, 0.7, 1.25, 1.55, 0.75, "Frontend\nReact");
  diagramNode(slide, 3.0, 1.25, 1.55, 0.75, "Backend\nNode.js");
  diagramNode(slide, 5.3, 1.25, 1.55, 0.75, "PostgreSQL\nDatabase");
  diagramNode(slide, 7.55, 1.25, 1.55, 0.75, "Redis\nQueue");
  diagramNode(slide, 3.0, 3.35, 1.55, 0.75, "Collector\nAPI/Syslog", "FFF0D4");
  diagramNode(slide, 5.3, 3.35, 1.55, 0.75, "Alert Rules", "FFE4E2");
  diagramNode(slide, 7.55, 3.35, 1.55, 0.75, "AI Analysis", "EAE0FF");
  arrow(slide, 2.25, 1.63, 3.0, 1.63);
  arrow(slide, 4.55, 1.63, 5.3, 1.63);
  arrow(slide, 6.85, 1.63, 7.55, 1.63);
  arrow(slide, 3.78, 2.0, 3.78, 3.35);
  arrow(slide, 4.55, 3.72, 5.3, 3.72);
  arrow(slide, 6.85, 3.72, 7.55, 3.72);
}

function pagesSlide() {
  const slide = pptx.addSlide();
  base(slide, "Main Pages In The Application", 10);
  const data = [
    ["Dashboard", "Shows overall security status"],
    ["Logs", "Shows collected security events"],
    ["Alerts", "Shows detected suspicious activity"],
    ["Incidents", "Tracks serious security cases"],
    ["Rules", "Controls detection logic"],
    ["AI Analysis", "Gives investigation summary and response steps"],
  ];
  let y = 1.15;
  for (const [name, desc] of data) {
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.75, y, w: 2.15, h: 0.48, rectRadius: 0.05, fill: { color: C.blue }, line: { color: C.blue } });
    slide.addText(name, { x: 0.85, y: y + 0.12, w: 1.95, h: 0.18, fontFace: "Times New Roman", fontSize: 12, bold: true, color: C.white, align: "center", margin: 0 });
    slide.addText(desc, { x: 3.15, y: y + 0.08, w: 5.9, h: 0.25, fontFace: "Times New Roman", fontSize: 16, color: C.ink, margin: 0 });
    y += 0.75;
  }
}

function screenshotSlide() {
  const slide = pptx.addSlide();
  base(slide, "Screenshots / Demo Pages", 14);
  slide.addShape(pptx.ShapeType.rect, { x: 0.75, y: 1.15, w: 8.5, h: 5.25, fill: { color: "091827" }, line: { color: C.blue, width: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.75, y: 1.15, w: 1.35, h: 5.25, fill: { color: "0F2237" }, line: { color: "0F2237" } });
  ["Dashboard", "Logs", "Alerts", "Incidents", "AI Analysis", "Rules"].forEach((text, i) => {
    slide.addText(text, { x: 0.92, y: 1.55 + i * 0.55, w: 0.95, h: 0.2, fontFace: "Times New Roman", fontSize: 8.5, color: i === 4 ? C.cyan : C.white, margin: 0 });
  });
  slide.addText("Application Demo Screen", { x: 2.45, y: 1.45, w: 5.8, h: 0.35, fontFace: "Times New Roman", fontSize: 20, bold: true, color: C.white, align: "center", margin: 0 });
  ["Live Logs", "Alerts", "Incidents", "AI Output"].forEach((text, i) => {
    const x = 2.55 + (i % 2) * 3.0;
    const y = 2.35 + Math.floor(i / 2) * 1.35;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.55, h: 0.78, rectRadius: 0.05, fill: { color: "162B45" }, line: { color: "31577C" } });
    slide.addText(text, { x: x + 0.1, y: y + 0.27, w: 2.35, h: 0.18, fontFace: "Times New Roman", fontSize: 13, bold: true, color: C.white, align: "center", margin: 0 });
  });
}

function thankYou() {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };
  slide.addText("Thank You", { x: 1.2, y: 2.55, w: 7.6, h: 0.8, fontFace: "Times New Roman", fontSize: 44, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("AI SIEM Platform", { x: 1.2, y: 3.45, w: 7.6, h: 0.36, fontFace: "Times New Roman", fontSize: 18, color: C.gold, align: "center", margin: 0 });
  slide.addText("Questions?", { x: 1.2, y: 4.05, w: 7.6, h: 0.36, fontFace: "Times New Roman", fontSize: 18, color: "D7EAF8", align: "center", margin: 0 });
}

titleSlide();
bullets("Abstract", [
  "This project is a security monitoring application.",
  "It collects logs and shows suspicious activity.",
  "It creates alerts and incidents for security issues.",
  "It also gives AI-based analysis for investigation.",
], 2);
bullets("Introduction", [
  "Every system creates security logs.",
  "Checking logs manually takes more time.",
  "A SIEM tool helps monitor logs in one place.",
  "This project works like a small SOC platform.",
], 3);
bullets("Problem Statement", [
  "Logs are stored in different places.",
  "Manual checking may miss attacks.",
  "There is no proper alert and incident tracking.",
  "Security teams need faster analysis.",
], 4);
bullets("Proposed Solution", [
  "Build one platform to collect and monitor logs.",
  "Use rules to detect suspicious events.",
  "Show alerts on the dashboard.",
  "Use AI to explain the threat and response steps.",
], 5);
bullets("Project Objectives", [
  "Collect logs from security sources.",
  "Store logs safely in the database.",
  "Detect attacks using rules.",
  "Help analysts manage incidents.",
  "Provide AI analysis for faster response.",
], 6);
bullets("Technologies Used", [
  "React for frontend pages.",
  "Node.js and Express for backend APIs.",
  "PostgreSQL for database storage.",
  "Redis for queue and cache support.",
  "Docker for easy application setup.",
], 7);
workingSlide();
architectureSlide();
pagesSlide();
bullets("Database Tables", [
  "users table stores login details.",
  "logs table stores security events.",
  "alerts table stores detected threats.",
  "incidents table stores investigation cases.",
  "rules table stores detection rules.",
], 11);
bullets("AI Analysis Module", [
  "Reads selected log or alert evidence.",
  "Finds important indicators like IP, user and host.",
  "Maps the attack to MITRE ATT&CK.",
  "Suggests immediate response actions.",
  "Works in offline mode if API key is not added.",
], 12);
bullets("Real World Use", [
  "Can monitor Windows, firewall and endpoint logs.",
  "Can detect brute force and credential dumping.",
  "Can help SOC analysts during investigation.",
  "Can be expanded with Wazuh, Sysmon and Suricata.",
], 13);
screenshotSlide();
bullets("Testing", [
  "Docker containers were built successfully.",
  "Database migration and seed commands are available.",
  "Demo attack script creates sample logs.",
  "AI analysis page gives threat summary.",
  "Database records can be checked using psql commands.",
], 15);
bullets("Future Enhancements", [
  "Deploy with HTTPS and domain name.",
  "Add real Wazuh and Sysmon agents.",
  "Add email or SMS alert notifications.",
  "Add automatic PDF incident reports.",
  "Improve security with more production hardening.",
], 16);
bullets("Conclusion", [
  "The project reduces manual log checking.",
  "It improves security visibility.",
  "It stores logs, alerts and incidents properly.",
  "AI analysis helps understand attacks quickly.",
  "The project is suitable as a real-world SIEM prototype.",
], 17);
thankYou();

await fs.mkdir(path.dirname(out), { recursive: true });
await pptx.writeFile({ fileName: out });
console.log(out);
