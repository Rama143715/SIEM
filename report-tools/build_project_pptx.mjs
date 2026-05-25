import pptxgen from "pptxgenjs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "AI SIEM Platform";
pptx.subject = "Lab submission presentation";
pptx.title = "AI SIEM Platform Project Presentation";
pptx.company = "SOC Platform Lab";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const C = {
  bg: "F7F8FC",
  navy: "0A2342",
  blue: "1557B0",
  cyan: "1AA6D9",
  teal: "0E8F7C",
  orange: "B45A1C",
  ink: "14213D",
  soft: "64748B",
  line: "D8E0EA",
  dark: "06111F",
  white: "FFFFFF",
  paleBlue: "EDF6FF",
  paleGreen: "F0FDF4",
  paleOrange: "FFF7ED",
};

const slides = [
  ["cover", "AI SIEM Platform", "Real-Time Threat Monitoring and Security Operations Center", ["Lab Submission Project Presentation", "React, Node.js, PostgreSQL, Redis, Docker"]],
  ["basic", "Abstract", "", ["The AI SIEM Platform centralizes security logs, detects suspicious activity, and supports SOC-style alert investigation.", "It demonstrates authentication, live dashboards, alert lifecycle handling, incident tracking, AI-assisted analysis, rule management, and database visibility.", "The project is containerized with Docker Compose so the full lab can be started and tested consistently."], ["Collect", "Detect", "Respond"]],
  ["basic", "Introduction", "", ["Security teams need continuous visibility into application and infrastructure events.", "A SIEM collects logs from multiple sources, correlates events, raises alerts, and supports investigation workflows.", "This project implements a compact SOC portal suitable for demonstrating SIEM concepts in a lab environment."], ["Logs", "Rules", "Alerts"]],
  ["basic", "Problem Statement", "", ["Manual log checking is slow and important events can be missed.", "Students need a working platform that shows alerts, incidents, logs, and database records in one place.", "The system should be easy to start before a lab demo and clear enough for examiners to understand."], ["Missed Events", "Slow Triage", "No Evidence"]],
  ["basic", "Objectives", "", ["Provide secure login/logout and role-based access for SOC users.", "Display logs, alerts, incidents, rules, and AI analysis from one dashboard.", "Support alert acknowledgement, resolution, blocked-threat clearing, and password change rotation.", "Run as a multi-container application using Docker."], ["Secure", "Live", "Auditable"]],
  ["basic", "Project Scope", "", ["Covers SIEM dashboard, log ingestion simulation, alert monitoring, incident management, AI analysis, settings, and database GUI access.", "Designed for academic lab demonstration rather than production SOC deployment.", "Includes guidance for starting services, login credentials, API endpoints, and database viewing."], ["SOC Portal", "Database", "Docker"]],
  ["basic", "Proposed Solution", "", ["A web-based SOC portal backed by REST APIs and PostgreSQL storage.", "Docker Compose runs frontend, backend, database, cache, and Adminer GUI together.", "Analysts can authenticate, review logs, manage alerts, investigate incidents, and explain project workflow."], ["Frontend", "API", "DB"]],
  ["basic", "Domain Survey", "", ["SIEM platforms such as Wazuh, Splunk, Elastic Security, and QRadar are used for log correlation and alerting.", "Common SOC operations include triage, acknowledgement, incident creation, investigation, and resolution.", "This project maps those concepts into a small practical implementation."], ["Wazuh", "Elastic", "Splunk"]],
  ["basic", "Existing System", "", ["Logs are often checked separately from alerts and incidents.", "Database records may only be visible through command-line tools.", "Password and access settings are usually not demonstrated in student mini-projects."], ["Manual", "Separate", "Slow"]],
  ["basic", "Proposed System", "", ["Unified portal for dashboard metrics, logs, alerts, incidents, AI analysis, rules, and settings.", "Adminer provides a browser-based database GUI for all application tables.", "Password change support encourages secure credential rotation every 15 days."], ["Unified", "Visible", "Guided"]],
  ["basic", "Project Modules", "", ["Authentication and access management", "Dashboard and SOC metrics", "Logs and log sources", "Alerts and incident workflow", "AI analysis and rule management", "Settings, password rotation, and project about section", "Database GUI using Adminer"], ["Auth", "Alerts", "Incidents"]],
  ["basic", "Hardware Requirements", "", ["Laptop or desktop with 8 GB RAM minimum", "Modern 64-bit processor", "10 GB free disk space for containers and volumes", "Stable local network/browser environment"], ["8 GB RAM", "CPU", "Disk"]],
  ["basic", "Software Requirements", "", ["Docker Desktop", "React frontend with Vite", "Express backend API", "PostgreSQL 16 database", "Redis cache", "Adminer database GUI"], ["Docker", "React", "Postgres"]],
  ["basic", "Technology: React", "", ["React builds the interactive SOC user interface.", "Reusable pages support dashboard, logs, alerts, incidents, AI analysis, rules, and settings.", "State management keeps authentication and profile data available across the app."], ["Pages", "State", "Routes"]],
  ["basic", "Technology: JavaScript and Vite", "", ["JavaScript is used across frontend and backend for faster development.", "Vite provides the frontend dev server at port 5173.", "REST API calls connect the browser UI to the backend service."], ["Vite", "REST", "Express"]],
  ["basic", "Technology: Tailwind CSS", "", ["Tailwind CSS creates the dark SOC-style interface.", "Utility classes make layout, spacing, color, and responsive behavior consistent.", "The settings page was simplified for access, login/logout, password change, and project information."], ["Layout", "Theme", "Responsive"]],
  ["basic", "Technology: Node.js, PostgreSQL and Redis", "", ["Node.js and Express expose authentication, logs, alerts, incidents, rules, and settings APIs.", "PostgreSQL stores users, alerts, audit log, incidents, rules, logs, and AI analyses.", "Redis supports fast state/cache operations in the stack."], ["Node", "SQL", "Redis"]],
  ["architecture", "System Architecture Diagram", "", ["Browser frontend communicates with backend REST APIs.", "Backend reads/writes PostgreSQL and uses Redis where needed.", "Adminer connects directly to PostgreSQL for GUI database inspection."]],
  ["basic", "Architecture Explanation", "", ["Frontend container serves the React application to the browser on port 5173.", "Backend container exposes API endpoints on port 3001 and handles business logic.", "PostgreSQL is the source of truth for records; Adminer is only a viewing and management tool.", "Redis is included to support fast temporary data handling."], ["Frontend", "Backend", "Database"]],
  ["flow", "Process Flow Diagram", "", ["Login", "Review dashboard", "Open logs/alerts", "Acknowledge or resolve", "Create/review incidents", "Check database records"]],
  ["basic", "Process Flow Explanation", "", ["The analyst logs in using lab credentials and receives access to SOC pages.", "Incoming or simulated events appear as logs and alerts.", "Open alerts can be acknowledged during investigation or resolved after action is complete.", "Database records can be checked in Adminer for verification."], ["Open", "Investigate", "Close"]],
  ["usecase", "Use Case Diagram", "", ["SOC Admin", "Login / Logout", "View dashboard", "Manage alerts", "Investigate incidents", "Change password", "View database"]],
  ["basic", "Use Case Explanation", "", ["The SOC Admin is the primary user for the lab submission.", "The user can authenticate, monitor threats, inspect logs, manage alerts, and update credentials.", "Adminer is used separately to validate stored records such as users, logs, alerts, and incidents."], ["Admin", "Actions", "Records"]],
  ["database", "Database Design", "", ["Main tables include users, logs, alerts, incidents, rules, ai_analyses, audit_log, log_sources, and dashboard_configs.", "User records include email, password hash, role, and password_changed_at for 15-day rotation tracking.", "Alerts and incidents support operational SOC workflows."]],
  ["basic", "Screenshots Section", "", ["The following slides describe the important application screens used in the lab demonstration.", "Actual running screens can be opened at the local frontend URL after Docker starts.", "Database screens can be verified through Adminer on port 8080."], ["Login", "Dashboard", "Adminer"]],
  ["ui", "Login and Dashboard UI", "", ["Login portal protects the SOC application.", "Dashboard gives a quick view of live status, alerts, logs, and security operations context.", "Default lab account: admin@siem.local / changeme123"], "login"],
  ["ui", "Logs and Alerts UI", "", ["Logs page shows collected event records.", "Alerts page separates open, acknowledged, resolved, and blocked-threat states.", "Acknowledge means investigation started; resolve means the issue is closed."], "alerts"],
  ["ui", "Incidents and AI Analysis UI", "", ["Incidents organize important alerts into investigation cases.", "AI Analysis page explains suspicious activity when an API key is configured.", "Without a real API key, AI analysis remains offline or demo-only."], "incidents"],
  ["ui", "Settings and Password Rotation UI", "", ["Settings now focuses on access, login/logout, password change, and about project.", "Users can update display name/email and change password after confirming current password.", "The application tracks a 15-day password change cycle."], "settings"],
  ["ui", "Database GUI with Adminer", "", ["Adminer lets the examiner see all database records in the browser.", "Server: postgres; Database: siem_db; Username: siem_user.", "Tables include alerts, logs, users, incidents, rules, and audit_log."], "adminer"],
  ["basic", "Admin Dashboard View", "", ["SOC dashboard summarizes the operational state of the platform.", "It helps demonstrate whether services are live, which threats are active, and what actions have been taken.", "The dashboard is the first screen to show after successful login."], ["Live", "Metrics", "SOC"]],
  ["basic", "Future Enhancements", "", ["Integrate real Wazuh/Elastic log ingestion.", "Add live syslog collectors and stronger correlation rules.", "Enable real AI provider keys with usage controls.", "Add report export, role permissions, and richer incident timelines."], ["Wazuh", "Reports", "Roles"]],
  ["basic", "Conclusion", "", ["The AI SIEM Platform demonstrates core SOC workflows in a working full-stack project.", "Docker makes the lab repeatable, while Adminer makes database evidence easy to show.", "The final system includes authentication, alert workflow, password change, and project documentation."], ["Working", "Repeatable", "Demo Ready"]],
  ["basic", "Bibliography", "", ["Docker documentation", "React and Vite documentation", "Express.js documentation", "PostgreSQL documentation", "Redis documentation", "Wazuh and SIEM concept references", "Project source code and lab guide"], ["Docs", "Sources", "Guide"]],
  ["thanks", "Thank You", "AI SIEM Platform", ["Questions and Demonstration"]],
];

function addHeader(slide, idx) {
  slide.background = { color: C.bg };
  slide.addText("SECURITY OPERATIONS CENTER", { x: 0.62, y: 0.3, w: 4.4, h: 0.2, fontFace: "Aptos", fontSize: 8.5, bold: true, color: C.blue, margin: 0 });
  slide.addText(`${String(idx).padStart(2, "0")} / 35`, { x: 11.45, y: 0.3, w: 1.1, h: 0.2, fontSize: 8.5, bold: true, color: C.soft, align: "right", margin: 0 });
  slide.addShape(pptx.ShapeType.line, { x: 0.62, y: 0.58, w: 11.7, h: 0, line: { color: C.line, width: 1 } });
}

function addFooter(slide) {
  slide.addText("AI SIEM Platform | Lab Submission", { x: 0.62, y: 7.08, w: 4.2, h: 0.15, fontSize: 7.3, color: C.soft, margin: 0 });
}

function addBullets(slide, items, x = 0.92, y = 1.8, w = 6.35) {
  const size = items.length > 5 ? 12.8 : 14.2;
  const step = items.length > 5 ? 0.48 : 0.62;
  items.forEach((text, i) => {
    const yy = y + i * step;
    slide.addShape(pptx.ShapeType.ellipse, { x, y: yy + 0.09, w: 0.08, h: 0.08, fill: { color: i % 2 ? C.cyan : C.orange }, line: { color: i % 2 ? C.cyan : C.orange } });
    slide.addText(text, { x: x + 0.18, y: yy, w, h: step, fontSize: size, color: C.ink, breakLine: false, fit: "shrink", margin: 0 });
  });
}

function visualCards(slide, labels) {
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.15, y: 1.62, w: 3.05, h: 3.1, rectRadius: 0.06, fill: { color: C.white }, line: { color: C.line, width: 1 } });
  labels.forEach((label, i) => {
    const colors = [[C.paleBlue, C.blue], [C.paleGreen, C.teal], [C.paleOrange, C.orange]][i % 3];
    slide.addShape(pptx.ShapeType.roundRect, { x: 8.55, y: 2.0 + i * 0.75, w: 2.25, h: 0.4, rectRadius: 0.04, fill: { color: colors[0] }, line: { color: colors[1], width: 1 } });
    slide.addText(label, { x: 8.55, y: 2.12 + i * 0.75, w: 2.25, h: 0.16, fontSize: 9.5, bold: true, color: C.navy, align: "center", margin: 0 });
  });
}

function coverSlide(item) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.2, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 6.25, w: 13.333, h: 1.25, fill: { color: "EDF4FB" }, line: { color: "EDF4FB" } });
  slide.addText("PROJECT PRESENTATION", { x: 0.75, y: 0.58, w: 3.6, h: 0.25, fontSize: 10, color: "A9D8FF", bold: true, margin: 0 });
  slide.addText(item[1], { x: 0.75, y: 1.8, w: 6.4, h: 0.75, fontSize: 36, bold: true, color: C.navy, margin: 0 });
  slide.addText(item[2], { x: 0.78, y: 2.72, w: 6.2, h: 0.4, fontSize: 15, color: C.soft, margin: 0 });
  addBullets(slide, item[3], 0.8, 3.75, 5.4);
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.15, y: 1.55, w: 3.0, h: 3.1, fill: { color: C.white }, line: { color: C.line, width: 1 } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 9.25, y: 2.2, w: 0.8, h: 1.12, fill: { color: C.blue }, line: { color: C.blue } });
  slide.addText("SOC", { x: 9.32, y: 2.62, w: 0.66, h: 0.2, fontSize: 13, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("Monitor  Detect  Respond", { x: 8.55, y: 4.02, w: 2.2, h: 0.22, fontSize: 9.5, color: C.soft, align: "center", margin: 0 });
  slide.addText("Submitted for Lab Demonstration", { x: 0.78, y: 6.48, w: 4.2, h: 0.3, fontSize: 12.5, bold: true, color: C.navy, margin: 0 });
}

function basicSlide(item, idx) {
  const slide = pptx.addSlide();
  addHeader(slide, idx);
  slide.addText(item[1], { x: 0.62, y: 0.95, w: 8.0, h: 0.48, fontSize: 24, bold: true, color: C.navy, margin: 0 });
  addBullets(slide, item[3]);
  visualCards(slide, item[4] || ["SIEM", "SOC", "Lab"]);
  addFooter(slide);
}

function architectureSlide(item, idx) {
  const slide = pptx.addSlide();
  addHeader(slide, idx);
  slide.addText(item[1], { x: 0.62, y: 0.95, w: 8.0, h: 0.48, fontSize: 24, bold: true, color: C.navy, margin: 0 });
  const nodes = [["Browser\nReact UI", 1.0, 2.55, C.blue], ["Backend API\nNode.js / Express", 4.05, 2.55, C.teal], ["PostgreSQL\nsiem_db", 7.4, 1.85, C.orange], ["Redis\nCache", 7.4, 3.25, "7C3AED"], ["Adminer GUI\nDB Browser", 10.35, 2.55, C.cyan]];
  nodes.forEach(([label, x, y, color]) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 1.8, h: 0.75, fill: { color: C.white }, line: { color: C.line, width: 1 } });
    slide.addText(label, { x: x + 0.12, y: y + 0.18, w: 1.55, h: 0.36, fontSize: 9.8, bold: true, color, align: "center", margin: 0 });
  });
  [[2.8, 2.93, 4.05], [5.85, 2.75, 7.4], [5.85, 3.12, 7.4], [9.2, 2.93, 10.35]].forEach(([x, y, x2]) => {
    slide.addShape(pptx.ShapeType.line, { x, y, w: x2 - x, h: 0, line: { color: C.navy, width: 1.5 } });
  });
  addBullets(slide, item[3], 1.0, 4.75, 10.2);
  addFooter(slide);
}

function flowSlide(item, idx) {
  const slide = pptx.addSlide();
  addHeader(slide, idx);
  slide.addText(item[1], { x: 0.62, y: 0.95, w: 8.0, h: 0.48, fontSize: 24, bold: true, color: C.navy, margin: 0 });
  const steps = ["Login", "Dashboard", "Logs", "Alerts", "Incidents", "Database"];
  steps.forEach((s, i) => {
    const x = 1.0 + i * 1.9;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.7, w: 1.35, h: 0.72, fill: { color: C.white }, line: { color: C.line, width: 1 } });
    slide.addText(`${i + 1}`, { x: x + 0.1, y: 2.92, w: 0.25, h: 0.2, fontSize: 12, bold: true, color: C.orange, margin: 0 });
    slide.addText(s, { x: x + 0.38, y: 2.92, w: 0.8, h: 0.2, fontSize: 9.5, bold: true, color: C.navy, margin: 0 });
    if (i < 5) slide.addShape(pptx.ShapeType.line, { x: x + 1.35, y: 3.06, w: 0.55, h: 0, line: { color: C.blue, width: 2 } });
  });
  addBullets(slide, ["Events move from collection to investigation and final verification.", "Each status change is saved so the lab record can be shown later."], 1.2, 4.75, 9.5);
  addFooter(slide);
}

function databaseSlide(item, idx) {
  const slide = pptx.addSlide();
  addHeader(slide, idx);
  slide.addText(item[1], { x: 0.62, y: 0.95, w: 8.0, h: 0.48, fontSize: 24, bold: true, color: C.navy, margin: 0 });
  ["users", "logs", "alerts", "incidents", "rules", "ai_analyses", "audit_log", "log_sources", "dashboard_configs"].forEach((t, i) => {
    const x = 1.0 + (i % 3) * 3.4;
    const y = 1.9 + Math.floor(i / 3) * 0.85;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.65, h: 0.45, fill: { color: C.white }, line: { color: C.line, width: 1 } });
    slide.addText(t, { x: x + 0.15, y: y + 0.13, w: 2.3, h: 0.18, fontSize: 10.5, bold: true, color: i === 0 ? C.orange : C.navy, margin: 0 });
  });
  addBullets(slide, item[3], 1.0, 4.95, 10.2);
  addFooter(slide);
}

function usecaseSlide(item, idx) {
  const slide = pptx.addSlide();
  addHeader(slide, idx);
  slide.addText(item[1], { x: 0.62, y: 0.95, w: 8.0, h: 0.48, fontSize: 24, bold: true, color: C.navy, margin: 0 });
  slide.addShape(pptx.ShapeType.roundRect, { x: 1.0, y: 2.25, w: 1.4, h: 2.0, fill: { color: C.white }, line: { color: C.line, width: 1 } });
  slide.addText("SOC Admin", { x: 1.15, y: 3.2, w: 1.1, h: 0.2, fontSize: 11, bold: true, color: C.navy, align: "center", margin: 0 });
  ["Login / Logout", "View Dashboard", "Manage Alerts", "Investigate Incidents", "Change Password", "View Database"].forEach((s, i) => {
    const x = 3.6 + (i % 2) * 3.1;
    const y = 1.85 + Math.floor(i / 2) * 1.05;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.35, h: 0.55, fill: { color: C.white }, line: { color: C.blue, width: 1 } });
    slide.addText(s, { x: x + 0.1, y: y + 0.18, w: 2.15, h: 0.16, fontSize: 9.5, bold: true, color: C.ink, align: "center", margin: 0 });
  });
  addFooter(slide);
}

function uiSlide(item, idx) {
  const slide = pptx.addSlide();
  addHeader(slide, idx);
  slide.addText(item[1], { x: 0.62, y: 0.95, w: 8.0, h: 0.48, fontSize: 24, bold: true, color: C.navy, margin: 0 });
  slide.addShape(pptx.ShapeType.roundRect, { x: 1.0, y: 1.85, w: 4.9, h: 3.1, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pptx.ShapeType.rect, { x: 1.0, y: 1.85, w: 4.9, h: 0.42, fill: { color: "0F2742" }, line: { color: "0F2742" } });
  slide.addText(item[4] === "login" ? "AI SIEM Login" : "SOC Platform", { x: 1.25, y: 1.99, w: 2.1, h: 0.14, fontSize: 8.2, bold: true, color: C.white, margin: 0 });
  if (item[4] === "login") {
    slide.addShape(pptx.ShapeType.roundRect, { x: 2.55, y: 2.75, w: 1.8, h: 0.34, fill: { color: C.white }, line: { color: C.line } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 2.55, y: 3.35, w: 1.8, h: 0.34, fill: { color: C.white }, line: { color: C.line } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 2.9, y: 4.05, w: 1.1, h: 0.35, fill: { color: C.blue }, line: { color: C.blue } });
    slide.addText("Sign In", { x: 3.1, y: 4.17, w: 0.7, h: 0.12, fontSize: 8, color: C.white, bold: true, align: "center", margin: 0 });
  } else if (item[4] === "adminer") {
    ["users", "alerts", "logs", "incidents", "rules"].forEach((r, i) => slide.addText(r, { x: 1.35, y: 2.65 + i * 0.35, w: 1.4, h: 0.12, fontSize: 8.5, color: "A9D8FF", margin: 0 }));
    slide.addShape(pptx.ShapeType.rect, { x: 3.35, y: 2.55, w: 1.75, h: 1.55, fill: { color: C.white }, line: { color: C.line } });
  } else {
    [C.blue, C.orange, C.teal].forEach((c, i) => slide.addShape(pptx.ShapeType.roundRect, { x: 1.35 + i * 1.25, y: 2.55, w: 0.95, h: 0.65, fill: { color: c }, line: { color: c } }));
    [0, 1, 2, 3].forEach((_, i) => slide.addShape(pptx.ShapeType.roundRect, { x: 1.45, y: 3.65 + i * 0.35, w: 3.95, h: 0.22, fill: { color: "19324D" }, line: { color: "19324D" } }));
  }
  addBullets(slide, item[3], 6.65, 1.95, 4.65);
  addFooter(slide);
}

function thanksSlide(item, idx) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.92, y: 0.8, w: 11.5, h: 5.85, fill: { color: C.white }, line: { color: C.line } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 1.6, y: 2.05, w: 1.1, h: 1.1, fill: { color: C.paleBlue }, line: { color: C.line } });
  slide.addShape(pptx.ShapeType.roundRect, { x: 1.92, y: 2.28, w: 0.45, h: 0.55, fill: { color: C.blue }, line: { color: C.blue } });
  slide.addText("SOC", { x: 1.96, y: 2.48, w: 0.38, h: 0.11, fontSize: 6, bold: true, color: C.white, align: "center", margin: 0 });
  slide.addText("Thank You", { x: 3.75, y: 2.08, w: 5.4, h: 0.65, fontSize: 38, bold: true, color: C.navy, margin: 0 });
  slide.addText("AI SIEM Platform", { x: 3.78, y: 2.95, w: 4.2, h: 0.25, fontSize: 15.5, bold: true, color: C.blue, margin: 0 });
  slide.addText("Questions and Demonstration", { x: 3.78, y: 3.55, w: 4.2, h: 0.25, fontSize: 14, color: C.soft, margin: 0 });
  slide.addText(`${idx} / 35`, { x: 11.25, y: 6.2, w: 0.65, h: 0.14, fontSize: 8, color: C.soft, align: "right", margin: 0 });
}

slides.forEach((item, i) => {
  const idx = i + 1;
  if (item[0] === "cover") coverSlide(item);
  else if (item[0] === "architecture") architectureSlide(item, idx);
  else if (item[0] === "flow") flowSlide(item, idx);
  else if (item[0] === "usecase") usecaseSlide(item, idx);
  else if (item[0] === "database") databaseSlide(item, idx);
  else if (item[0] === "ui") uiSlide(item, idx);
  else if (item[0] === "thanks") thanksSlide(item, idx);
  else basicSlide(item, idx);
});

await pptx.writeFile({ fileName: "docs/AI_SIEM_Platform_Project_Presentation.pptx" });
