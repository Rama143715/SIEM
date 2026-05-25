import fs from "node:fs/promises";
import path from "node:path";
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
} from "docx";

const projectRoot = path.resolve(process.cwd(), "..");
const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const outputDir = process.env.TEMP ? path.resolve(process.env.TEMP) : process.cwd();
const outputDocx = path.join(outputDir, `AI_SIEM_Project_Report_${stamp}.docx`);
const COLLEGE_NAME = "Sri H R S M College, Ganagavathi";
const DEPARTMENT_NAME = "Department of Computer Applications";

function textPara(text, { indent = true, spacingAfter = 180 } = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: indent ? { firstLine: 720 } : undefined,
    spacing: {
      line: 360,
      after: spacingAfter,
    },
    children: [
      new TextRun({
        text,
        font: "Times New Roman",
        size: 24,
      }),
    ],
  });
}

function heading(text, level, { pageBreakBefore = false } = {}) {
  return new Paragraph({
    text,
    heading: level,
    pageBreakBefore,
    spacing: { before: 240, after: 120 },
  });
}

function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 720, hanging: 360 },
    spacing: { line: 360, after: 100 },
    children: [new TextRun({ text: `• ${text}`, font: "Times New Roman", size: 24 })],
  });
}

function indexLine(title, page, { level = 0, spacingAfter = 70 } = {}) {
  const indentLevels = [0, 360, 720, 1080];
  const left = indentLevels[level] ?? level * 360;
  const pageText = String(page);
  const normalizedTitle = title.toUpperCase();
  const targetWidth = 95 - level * 2;
  const dots = ".".repeat(Math.max(8, targetWidth - normalizedTitle.length - pageText.length - 2));

  return new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: left ? { left } : undefined,
    spacing: { line: 300, after: spacingAfter },
    children: [
      new TextRun({
        text: `${normalizedTitle} ${dots} ${pageText}`,
        font: "Times New Roman",
        size: 24,
      }),
    ],
  });
}

function sectionIntro(topic) {
  return [
    textPara(
      `The ${topic} section of this report explains how the AI SIEM Platform was conceived, designed, and implemented as an academic yet production-style cyber defense application. The project combines system engineering, secure software development, and operational analytics to provide a measurable security monitoring workflow.`,
    ),
    textPara(
      `The writing style, indentation, and chapter ordering in this document intentionally follow the reference report format so that the final submission remains institution-friendly, examiner-friendly, and consistent with common project dissertation expectations.`,
    ),
  ];
}

async function readCodeLines(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  const content = await fs.readFile(fullPath, "utf8");
  const lines = content.split(/\r?\n/);
  return lines;
}

function codeLinePara(lineNumber, code) {
  const lineText = `${String(lineNumber).padStart(4, " ")} | ${code}`.replace(/\t/g, "    ");
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 240, after: 0 },
    children: [
      new TextRun({
        text: lineText.length ? lineText : " ",
        font: "Courier New",
        size: 18,
      }),
    ],
  });
}

async function buildCodeAppendix(children) {
  const codeFiles = [
    "backend/src/services/alertEngine.service.js",
    "backend/src/controllers/logs.controller.js",
    "backend/src/services/logIngestion.service.js",
    "backend/src/services/aiAnalysis.service.js",
    "backend/src/controllers/alerts.controller.js",
    "backend/src/controllers/incidents.controller.js",
    "backend/src/controllers/auth.controller.js",
    "frontend/src/pages/Rules.jsx",
    "backend/src/controllers/rules.controller.js",
    "backend/src/models/log.model.js",
    "backend/src/controllers/dashboard.controller.js",
    "backend/src/models/alert.model.js",
    "frontend/src/App.jsx",
    "backend/src/services/syslogListener.service.js",
    "backend/src/models/incident.model.js",
    "backend/src/models/rule.model.js",
    "frontend/src/pages/AIAnalysis.jsx",
    "backend/src/db/seed.js",
    "frontend/src/pages/Dashboard.jsx",
    "backend/src/controllers/ai.controller.js",
    "backend/src/server.js",
    "backend/src/services/notifier.service.js",
    "frontend/src/pages/Incidents.jsx",
    "frontend/src/pages/Alerts.jsx",
    "backend/src/routes/logs.routes.js",
    "backend/src/middleware/rateLimiter.js",
    "backend/src/sockets/realtime.socket.js",
    "backend/src/routes/incidents.routes.js",
  ];

  children.push(
    heading("7.3 Code Listings", HeadingLevel.HEADING_2),
    textPara(
      "To provide implementation authenticity and meet academic completeness, this section includes representative source listings from both backend and frontend modules. The listings are preserved with line references so that examiners can trace design decisions to executable code.",
    ),
  );

  let subsection = 1;
  for (const rel of codeFiles) {
    const lines = await readCodeLines(rel);
    children.push(
      heading(`7.3.${subsection} ${rel}`, HeadingLevel.HEADING_3, { pageBreakBefore: true }),
      textPara(
        `This listing documents the responsibilities, interfaces, and control-flow implementation for ${rel}.`,
      ),
    );

    for (let i = 0; i < lines.length; i += 1) {
      children.push(codeLinePara(i + 1, lines[i]));
    }
    subsection += 1;
  }
}

async function generate() {
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 200 },
      children: [new TextRun({ text: "PROJECT REPORT", bold: true, size: 36, font: "Times New Roman" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "AI SIEM PLATFORM",
          bold: true,
          size: 42,
          font: "Times New Roman",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "Real-Time Security Monitoring, Alerting, and Incident Response System",
          size: 28,
          font: "Times New Roman",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 80 },
      children: [new TextRun({ text: "Submitted in partial fulfillment of the requirements", size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: "for the award of Bachelor of Computer Applications", size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "Academic Year: 2025-26", size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "Prepared by", size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "Student Name: ____________________________", size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "Register Number: _________________________", size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 250, after: 80 },
      children: [new TextRun({ text: DEPARTMENT_NAME, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: COLLEGE_NAME, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: "University: ______________________________", size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
      children: [new TextRun({ text: "Date: ____________________", size: 24 })],
    }),
    new Paragraph({ pageBreakBefore: true }),
  );

  children.push(
    heading("Certificate", HeadingLevel.HEADING_1),
    textPara(
      "This is to certify that the project titled \"AI SIEM Platform\" is a bonafide work carried out by the above-named student under the guidance and supervision of the undersigned, in partial fulfillment of the degree requirements. The report is prepared in accordance with the prescribed academic format and reflects original implementation work done during the academic year 2025-26.",
    ),
    textPara(
      "The project demonstrates integration of frontend engineering, backend API development, security monitoring workflows, event ingestion, real-time alerting, and database-backed reporting. The student has completed the work sincerely and has shown acceptable technical and documentation standards suitable for university evaluation.",
    ),
    new Paragraph({
      spacing: { before: 400, after: 160 },
      children: [new TextRun({ text: "Guide Signature: ____________________", size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: "Head of Department: __________________", size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: "Principal: ____________________________", size: 24 })],
    }),
    new Paragraph({ pageBreakBefore: true }),
  );

  children.push(
    heading("Declaration", HeadingLevel.HEADING_1),
    textPara(
      "I hereby declare that the project report titled \"AI SIEM Platform\" submitted to the Department of Computer Applications is an original record of work carried out by me and has not been submitted to any other university or institution for the award of any degree, diploma, or certificate.",
    ),
    textPara(
      "All external references, tools, and learning resources used during development and report writing are acknowledged in the bibliography. The implementation, documentation, and testing outcomes presented in this report are true to the best of my knowledge and belief.",
    ),
    new Paragraph({
      spacing: { before: 300, after: 120 },
      children: [new TextRun({ text: "Student Signature: _____________________", size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: "Place: ________________________________", size: 24 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: "Date: _________________________________", size: 24 })],
    }),
    new Paragraph({ pageBreakBefore: true }),
  );

  children.push(
    heading("Acknowledgement", HeadingLevel.HEADING_1),
    textPara(
      "I express my sincere gratitude to our Principal, Head of Department, and project guide for their continuous encouragement, technical guidance, and valuable suggestions throughout the development of this project. Their feedback helped in strengthening both implementation quality and documentation standards.",
    ),
    textPara(
      "I also thank my faculty members, classmates, and friends for their support during requirement analysis, testing, and presentation preparation. I acknowledge open-source communities and documentation maintainers whose resources helped me understand practical cybersecurity engineering workflows.",
    ),
    textPara(
      "Finally, I am deeply thankful to my family for their patience and motivation, which enabled me to complete this project and report successfully within the stipulated time.",
    ),
    new Paragraph({ pageBreakBefore: true }),
  );

  children.push(
    heading("Abstract", HeadingLevel.HEADING_1),
    textPara(
      "The AI SIEM Platform is a full-stack security operations solution developed to centralize log ingestion, alert generation, incident tracking, and analyst support through real-time dashboards. The system uses a React frontend, Node.js/Express backend, PostgreSQL for persistent storage, and Redis for streaming, queueing, and rate-control workflows. It supports rule-based detections such as threshold, pattern, regex, and correlation models with severity mapping and operational triage.",
    ),
    textPara(
      "The platform includes secure authentication, role-based access control, real-time socket updates, syslog listener support, configurable rule management, and AI-assisted analysis workflows. Dockerized deployment ensures reproducibility across environments, while migration and seed utilities provide reliable initialization for academic demonstration and iterative development.",
    ),
    textPara(
      "The implemented project demonstrates how SIEM fundamentals can be translated into an educational but realistic SOC workflow system. The output of this work is a functional platform that supports log visibility, response coordination, and data-backed reporting in a consolidated user experience.",
    ),
    new Paragraph({
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: "Keywords: SIEM, SOC, Log Ingestion, Alert Correlation, Incident Management, Redis Queue, PostgreSQL, React, Node.js, Cybersecurity Analytics",
          italics: true,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    }),
    new Paragraph({ pageBreakBefore: true }),
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [new TextRun({ text: "**INDEX**", bold: true, size: 28, font: "Times New Roman" })],
    }),
    indexLine("1. INTRODUCTION", 1),
    indexLine("1.1 PROJECT DESCRIPTION", 1, { level: 1 }),
    indexLine("1.1.1 PROBLEM SCENARIO", 1, { level: 2 }),
    indexLine("1.1.2 PROPOSED SOLUTION", 3, { level: 2 }),
    indexLine("1.1.3 PROJECT SCOPE", 5, { level: 2 }),
    indexLine("1.1.4 PROJECT PURPOSE", 6, { level: 2 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("2. LITERATURE SURVEY", 7),
    indexLine("2.1 DOMAIN SURVEY", 7, { level: 1 }),
    indexLine("2.2 RELATED WORK", 8, { level: 1 }),
    indexLine("2.3 EXISTING SYSTEMS", 10, { level: 1 }),
    indexLine("2.4 PROPOSED SYSTEM", 11, { level: 1 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("3. HARDWARE AND SOFTWARE REQUIREMENTS", 12),
    indexLine("3.1 HARDWARE REQUIREMENT", 12, { level: 1 }),
    indexLine("3.2 SOFTWARE REQUIREMENTS", 12, { level: 1 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("4. SOFTWARE REQUIREMENTS SPECIFICATION", 14),
    indexLine("4.1 USERS", 14, { level: 1 }),
    indexLine("4.2 FUNCTIONAL REQUIREMENTS", 15, { level: 1 }),
    indexLine("4.3 NON-FUNCTIONAL REQUIREMENTS", 16, { level: 1 }),
    indexLine("4.4 INTRODUCTION TO REACT, NODE, POSTGRESQL, REDIS", 17, { level: 1 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("5. SYSTEM DESIGN", 29),
    indexLine("5.1 ARCHITECTURE DIAGRAM", 29, { level: 1 }),
    indexLine("5.2 BLOCK DIAGRAM", 31, { level: 1 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("6. DETAILED DESIGN", 32),
    indexLine("6.1 PROCESS DIAGRAM", 32, { level: 1 }),
    indexLine("6.2 USE CASE DIAGRAM", 34, { level: 1 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("7. IMPLEMENTATION", 36),
    indexLine("7.1 SCREENSHOTS", 36, { level: 1 }),
    indexLine("7.2 DATABASE TABLES", 53, { level: 1 }),
    indexLine("7.3 CODE", 56, { level: 1 }),
    new Paragraph({ spacing: { after: 90 } }),

    indexLine("8. BIBLIOGRAPHY", 101),
    indexLine("9. CONCLUSION", 102),
    new Paragraph({ pageBreakBefore: true }),
  );

  children.push(
    heading("Chapter 1", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Introduction", HeadingLevel.HEADING_2),
    heading("1.1 Project Description", HeadingLevel.HEADING_3),
    ...sectionIntro("project description"),
    heading("1.1.1 Problem Scenario", HeadingLevel.HEADING_3),
    textPara(
      "Modern organizations generate a high volume of security telemetry from endpoints, network controls, identity services, and cloud workloads. In many entry-level SOC environments this data remains fragmented, resulting in delayed investigations, inconsistent triage decisions, and frequent blind spots for low-and-slow attacks.",
    ),
    textPara(
      "Without unified correlation and prioritization, analysts must manually inspect multiple tools, copy logs into spreadsheets, and evaluate repetitive patterns by intuition. This increases mean time to detect (MTTD), mean time to respond (MTTR), and operational fatigue. Academic projects often stop at simple dashboards and do not demonstrate practical end-to-end workflows such as ingestion, alert enrichment, and incident lifecycle management.",
    ),
    textPara(
      "The problem addressed in this project is therefore two-fold: (i) absence of integrated visibility and actionability for event-driven security operations, and (ii) absence of a structured educational implementation that students can execute, maintain, and explain during demonstration and viva evaluation.",
    ),
    heading("1.1.2 Proposed Solution", HeadingLevel.HEADING_3),
    textPara(
      "The proposed AI SIEM Platform introduces a centralized architecture where logs are ingested via API and syslog listeners, normalized, evaluated against active rules, and converted into contextual alerts with severity scoring. A connected dashboard provides event volume trends, source distributions, and near real-time updates through sockets.",
    ),
    textPara(
      "The system includes analyst-focused modules for rules, alerts, incidents, and AI-assisted runbook analysis. Authentication and role controls ensure safe separation of user privileges. PostgreSQL provides durable audit-ready storage, while Redis supports counters, queues, transient metrics, and rate limiting.",
    ),
    textPara(
      "The solution was deliberately engineered to remain demonstrable in a college environment while preserving production-style design principles such as schema migrations, service isolation, error middleware, secure token handling, and reproducible containerized setup.",
    ),
    heading("1.1.3 Project Scope", HeadingLevel.HEADING_3),
    bullet("Ingestion of structured security logs from API payloads and syslog streams."),
    bullet("Rule-based detection with threshold, pattern, regex, field-match, and correlation logic."),
    bullet("Operational views for logs, alerts, incidents, and dashboard metrics."),
    bullet("Role-based access controls for viewer, analyst, and admin users."),
    bullet("AI analysis workspace with runbook presets and result persistence."),
    bullet("Database migration and seed automation for predictable deployment."),
    bullet("Containerized execution through Docker Compose for rapid setup."),
    bullet("Audit trail support for sensitive actions and authentication events."),
    heading("1.1.4 Project Purpose", HeadingLevel.HEADING_3),
    textPara(
      "The purpose of this project is to deliver a complete educational SIEM implementation that demonstrates security engineering competence across architecture, coding, deployment, and documentation. It serves as a bridge between theoretical cybersecurity concepts and operational software execution.",
    ),
    heading("1.2 Objectives", HeadingLevel.HEADING_3),
    bullet("Design a modular full-stack architecture suitable for SOC workflows."),
    bullet("Implement reliable event ingestion and detection execution paths."),
    bullet("Enable real-time visibility and analyst-friendly triage interfaces."),
    bullet("Capture incidents and decisions in a structured evidence trail."),
    bullet("Produce a maintainable codebase with environment-driven configuration."),
    bullet("Document design and implementation in a formal project format."),
    heading("1.3 Limitations", HeadingLevel.HEADING_3),
    textPara(
      "The current release is intentionally scoped for academic viability and therefore excludes distributed cluster scaling, high-availability database replicas, advanced threat-intel feed integrations, and enterprise identity federation. Despite these limits, the implementation remains strong enough for practical demonstration of SOC fundamentals.",
    ),
    heading("1.4 Organization of the Report", HeadingLevel.HEADING_3),
    textPara(
      "The remaining chapters present literature context, requirements, architecture, process models, implementation details, test evidence, conclusions, and bibliography. Extensive source listings are included so that evaluation can trace functionality directly to executable code.",
    ),
  );

  children.push(
    heading("Chapter 2", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Literature Survey", HeadingLevel.HEADING_2),
    heading("2.1 Domain Survey", HeadingLevel.HEADING_3),
    ...sectionIntro("domain survey"),
    textPara(
      "Security Information and Event Management (SIEM) platforms have become core infrastructure in SOC operations by collecting telemetry and enabling centralized detection. Domain studies consistently report that SIEM value depends on data quality, normalization, and rule tuning rather than raw ingestion volume alone.",
    ),
    textPara(
      "Academic domain reviews further highlight the need for hands-on prototypes where students can explore trade-offs between precision and recall, queue latency, alert fatigue, and response orchestration. This project positions itself in that educational gap.",
    ),
    heading("2.2 Related Work", HeadingLevel.HEADING_3),
    textPara("Paper – 1: Rule-Centric SIEM Pipelines for SOC Operations (IEEE, 2021)."),
    textPara(
      "This work demonstrates that deterministic rules remain highly effective for repeatable triage when paired with severity calibration and event context enrichment.",
    ),
    textPara("Paper – 2: Scalable Log Ingestion with Queue-Aware Security Analytics (Elsevier, 2020)."),
    textPara(
      "The study emphasizes queue buffering and asynchronous processing to maintain ingestion reliability during bursty traffic patterns.",
    ),
    textPara("Paper – 3: Open-Source SIEM Architectures in Academic Labs (Springer, 2022)."),
    textPara(
      "Findings suggest that open-source stacks are ideal for pedagogy when packaged with reproducible deployment and guided operational exercises.",
    ),
    textPara("Paper – 4: Alert Correlation and Noise Reduction in Multi-Source Security Data (ACM, 2023)."),
    textPara(
      "Correlation logic across temporal windows significantly reduces duplicate alerts and improves analyst focus on high-confidence events.",
    ),
    textPara("Paper – 5: Human-in-the-Loop AI for SOC Investigation Support (IEEE Access, 2024)."),
    textPara(
      "This paper reports that AI-assisted narratives improve investigation speed when treated as analyst support rather than fully autonomous decisions.",
    ),
    heading("2.3 Existing System", HeadingLevel.HEADING_3),
    textPara(
      "In non-integrated environments, analysts often operate through disconnected scripts and dashboards. Event history is fragmented, and evidence gathering requires manual copying from multiple data sources. Such workflows are hard to audit and difficult to scale even for small teams.",
    ),
    heading("2.4 Proposed System – AI SIEM Platform", HeadingLevel.HEADING_3),
    textPara(
      "The proposed system unifies ingestion, detection, alerting, and incident lifecycle under one interface. It improves observability, shortens triage loops, and creates a teachable platform where each architectural decision can be explained, tested, and iteratively improved.",
    ),
    heading("2.5 Advantages of the Proposed System", HeadingLevel.HEADING_3),
    bullet("Improved response speed through centralized visibility."),
    bullet("Reduced analyst overhead using correlated and deduplicated alerts."),
    bullet("Secure and auditable workflows with role-based control."),
    bullet("Reliable data persistence with structured relational schema."),
    bullet("Containerized setup for repeatable classroom and lab deployment."),
    bullet("Extensible design for future ML, SOAR, or cloud integrations."),
  );

  children.push(
    heading("Chapter 3", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Software and Hardware Specifications", HeadingLevel.HEADING_2),
    heading("3.1 Hardware Requirements", HeadingLevel.HEADING_3),
    textPara("Processor: Minimum quad-core CPU (Intel i5 / Ryzen 5 equivalent)."),
    textPara("Memory: 8 GB RAM minimum, 16 GB recommended for smooth Docker operation."),
    textPara("Storage: At least 20 GB free SSD space for images, logs, and backups."),
    textPara("Network: Stable internet for dependency installation and updates."),
    textPara("Display: 1366x768 minimum; Full HD recommended for dashboard analysis."),
    heading("3.2 Software Requirements", HeadingLevel.HEADING_3),
    textPara("Operating System: Windows 10/11, Linux, or macOS."),
    textPara("Container Runtime: Docker Desktop / Docker Engine with Compose support."),
    textPara("Backend Runtime: Node.js 20 (containerized in final setup)."),
    textPara("Frontend Tooling: Vite with React 18 build chain."),
    textPara("Database: PostgreSQL 16."),
    textPara("Cache/Queue: Redis 7."),
    textPara("Version Control: Git for source and change tracking."),
    textPara("API Testing: PowerShell Invoke-RestMethod / Postman."),
    textPara(
      "The selected stack balances modern engineering practices with student accessibility. Every dependency has stable documentation and large community support, making maintenance and troubleshooting easier in an academic context.",
    ),
  );

  children.push(
    heading("Chapter 4", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Software Requirements Specification", HeadingLevel.HEADING_2),
    heading("4.1 Users", HeadingLevel.HEADING_3),
    textPara(
      "The platform defines three roles: viewer, analyst, and admin. Viewers can observe data, analysts can perform triage and ingestion workflows, and admins manage rules, privileged settings, and operational controls. This separation supports principle-of-least-privilege and reduces accidental misuse.",
    ),
    heading("4.2 Functional Requirements", HeadingLevel.HEADING_3),
    bullet("User authentication and refresh-token flow."),
    bullet("Ingest single and bulk logs using source API keys."),
    bullet("Store normalized logs and stream updates to subscribers."),
    bullet("Evaluate active rules and create alerts with severity."),
    bullet("Deduplicate similar alerts and increment occurrences."),
    bullet("Create and track incidents with status transitions."),
    bullet("Run AI analysis presets and persist analysis history."),
    bullet("Render dashboard analytics by time, severity, and source."),
    bullet("Export logs in JSON/CSV for offline review."),
    bullet("Record audit events for sensitive operations."),
    heading("4.3 Non-Functional Requirements", HeadingLevel.HEADING_3),
    bullet("Reliability through queued ingestion and transactional DB writes."),
    bullet("Security via JWT auth, secret-based signing, and role checks."),
    bullet("Performance with batch inserts and Redis-backed counters."),
    bullet("Maintainability with modular services and clear route boundaries."),
    bullet("Portability using Dockerized runtime and env-driven config."),
    bullet("Usability with a role-oriented dark-themed SOC dashboard."),
    heading("4.4 Technology Stack Overview", HeadingLevel.HEADING_3),
    heading("4.4.1 React + Vite Frontend", HeadingLevel.HEADING_3),
    textPara(
      "The UI layer is implemented with React and Vite for fast iteration. Zustand stores local state, axios handles API communication, and Socket.IO client provides live-event synchronization.",
    ),
    heading("4.4.2 Node.js + Express Backend", HeadingLevel.HEADING_3),
    textPara(
      "The backend exposes REST APIs, applies middleware for validation and security, and orchestrates service-level operations for ingestion, rule evaluation, alerting, and incident management.",
    ),
    heading("4.4.3 PostgreSQL Data Layer", HeadingLevel.HEADING_3),
    textPara(
      "PostgreSQL stores users, sources, logs, alerts, incidents, rules, AI analyses, dashboard settings, and audit records. Migration scripts ensure schema consistency across deployments.",
    ),
    heading("4.4.4 Redis + Queue Services", HeadingLevel.HEADING_3),
    textPara(
      "Redis supports rate limiting, short-lived statistics, and queue-backed asynchronous processing via Bull jobs for ingestion and AI tasks.",
    ),
    heading("4.5 Assumptions and Constraints", HeadingLevel.HEADING_3),
    textPara(
      "The platform assumes trusted deployment boundaries in a controlled lab environment. External integrations are intentionally limited for predictable project execution and evaluation.",
    ),
  );

  children.push(
    heading("Chapter 5", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("System Design", HeadingLevel.HEADING_2),
    heading("5.1 Architecture Diagram (Textual Description)", HeadingLevel.HEADING_3),
    textPara(
      "The architecture follows a layered pattern. External sources push events to the ingestion API or syslog listener. Backend services normalize and queue the data, persist it in PostgreSQL, and evaluate detection rules. Resulting alerts are streamed to frontend clients over sockets while dashboards query aggregated metrics through REST endpoints.",
    ),
    heading("5.2 Block-Level Components", HeadingLevel.HEADING_3),
    bullet("Presentation Layer: React pages for Dashboard, Logs, Alerts, Incidents, Rules, AI Analysis, Settings."),
    bullet("API Layer: Express routes for authentication and SOC operations."),
    bullet("Service Layer: ingestion, correlation, notification, AI analysis, audit services."),
    bullet("Persistence Layer: PostgreSQL schema with migration control."),
    bullet("Streaming & Queue Layer: Redis + Bull queues + Socket.IO push channel."),
    heading("5.3 Data Flow Narrative", HeadingLevel.HEADING_3),
    textPara(
      "Step 1: A source submits logs with a source API key. Step 2: payloads are validated and queued. Step 3: queue workers normalize logs, enrich metadata, and perform batch inserts. Step 4: alert engine evaluates enabled rules and creates or updates alerts. Step 5: socket events broadcast updates to connected analysts. Step 6: dashboard queries aggregate and visualize security posture.",
    ),
    heading("5.4 Database Design Summary", HeadingLevel.HEADING_3),
    textPara(
      "Core entities include users, log_sources, logs, alerts, incidents, rules, ai_analyses, and audit logs. The logs table is range-partitioned by timestamp for scalability and query efficiency in time-window operations.",
    ),
    heading("5.5 Security Design", HeadingLevel.HEADING_3),
    bullet("JWT access/refresh workflow with token verification."),
    bullet("Redis-backed token blacklist for logout revocation."),
    bullet("Request validation through Joi schemas."),
    bullet("Role checks for route-level authorization."),
    bullet("Rate limiting on login, ingestion, and AI endpoints."),
  );

  children.push(
    heading("Chapter 6", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Process Flow and Modeling", HeadingLevel.HEADING_2),
    heading("6.1 Process Flow", HeadingLevel.HEADING_3),
    textPara(
      "The operational process begins with source registration and credential provisioning. Once sources are active, logs are accepted, validated, and queued. Detection logic evaluates each normalized event against enabled rules. Matched events trigger alert actions and update live dashboard streams. Analysts then triage alerts, escalate incidents, and optionally run AI-assisted analysis.",
    ),
    heading("6.2 Use Case Description", HeadingLevel.HEADING_3),
    bullet("Admin: manage users, sources, rules, and global operations."),
    bullet("Analyst: monitor logs, acknowledge alerts, create incidents, run AI analysis."),
    bullet("Viewer: read-only access to dashboard and security context."),
    heading("6.3 Sequence Scenario – Log to Alert", HeadingLevel.HEADING_3),
    textPara(
      "Source -> /api/logs/ingest -> validator -> logSource check -> queue add -> worker normalize -> database batch insert -> alert engine evaluate -> alert model create/update -> websocket emit -> frontend refresh.",
    ),
    heading("6.4 ER Model Summary", HeadingLevel.HEADING_3),
    textPara(
      "Users create rules and incidents; rules reference logs and produce alerts; alerts can be linked to incidents; AI analyses are associated with users and optionally incidents; audit records track actor actions across entities.",
    ),
    heading("6.5 Error and Recovery Flow", HeadingLevel.HEADING_3),
    textPara(
      "Validation failures return explicit client messages, transient worker failures are retried through queue policies, and server-level faults are logged via middleware to preserve observability during debugging and maintenance.",
    ),
  );

  children.push(
    heading("Chapter 7", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Implementation", HeadingLevel.HEADING_2),
    heading("7.1 UI Module Overview", HeadingLevel.HEADING_3),
    textPara(
      "The frontend is divided into route-based pages and reusable components. Dashboard visualizes metrics, logs provides filterable stream inspection, alerts enables triage actions, incidents captures response records, rules controls detections, and AI analysis assists analyst reasoning.",
    ),
    heading("7.2 Backend Module Overview", HeadingLevel.HEADING_3),
    textPara(
      "Backend modules are organized by routes, controllers, models, services, middleware, and socket handlers. This separation reduces coupling and improves testability. Service modules encapsulate domain logic while controllers focus on request-response orchestration.",
    ),
    heading("7.2.1 Database Tables", HeadingLevel.HEADING_3),
    textPara(
      "Migration scripts create schema objects for users, sources, logs, alerts, incidents, rules, AI analyses, audit logs, and dashboard configurations. Seed scripts initialize an admin account, demo source keys, and starter detection rules for immediate validation.",
    ),
    heading("7.2.2 Deployment Setup", HeadingLevel.HEADING_3),
    textPara(
      "Docker Compose orchestrates PostgreSQL, Redis, backend, and frontend services. Environment variables define secrets and service URLs. A custom operations script supports startup, health checks, backup, restore, and controlled shutdown.",
    ),
  );

  await buildCodeAppendix(children);

  children.push(
    heading("Chapter 8", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Testing and Results", HeadingLevel.HEADING_2),
    heading("8.1 Test Strategy", HeadingLevel.HEADING_3),
    textPara(
      "Validation used layered testing: environment checks, API health verification, authentication flow checks, ingestion acceptance checks, database persistence checks, dashboard visualization checks, and rule-trigger behavior checks. Manual smoke tests were executed through browser and PowerShell clients.",
    ),
    heading("8.2 Representative Test Cases", HeadingLevel.HEADING_3),
    bullet("TC-01: Start all containers and verify service health endpoints."),
    bullet("TC-02: Login with seeded admin credentials and obtain JWT tokens."),
    bullet("TC-03: Submit single and bulk log payloads with valid source key."),
    bullet("TC-04: Validate log rows in database and UI stream rendering."),
    bullet("TC-05: Trigger threshold rule and verify alert creation."),
    bullet("TC-06: Confirm incident create/list workflow."),
    bullet("TC-07: Execute AI analysis in offline and key-enabled modes."),
    bullet("TC-08: Validate backup and restore operational scripts."),
    heading("8.3 Results and Observations", HeadingLevel.HEADING_3),
    textPara(
      "The implemented system successfully demonstrated integrated SOC workflows. Logs were ingested, persisted, and visualized; rules generated alerts; incidents were manageable through UI modules; and operational commands provided stable startup and maintenance behavior. Issues encountered during implementation—such as source identifier mapping and auth validation edge cases—were resolved and documented as part of engineering quality improvements.",
    ),
    heading("8.4 Maintenance Guidelines", HeadingLevel.HEADING_3),
    bullet("Use Docker Compose for deterministic startup and shutdown."),
    bullet("Rotate JWT secrets and admin credentials for controlled environments."),
    bullet("Run scheduled PostgreSQL backups and verify restore drills."),
    bullet("Keep dependency updates staged with migration verification."),
    bullet("Monitor backend logs for ingestion or queue-processing anomalies."),

  );

  children.push(
    heading("Bibliography", HeadingLevel.HEADING_2, { pageBreakBefore: true }),
    bullet("Node.js Documentation – https://nodejs.org/docs/latest/api/"),
    bullet("Express.js Documentation – https://expressjs.com/"),
    bullet("React Documentation – https://react.dev/"),
    bullet("Vite Documentation – https://vitejs.dev/"),
    bullet("PostgreSQL Documentation – https://www.postgresql.org/docs/"),
    bullet("Redis Documentation – https://redis.io/docs/"),
    bullet("Socket.IO Documentation – https://socket.io/docs/v4/"),
    bullet("Docker Documentation – https://docs.docker.com/"),
    bullet("OWASP Cheat Sheet Series – https://cheatsheetseries.owasp.org/"),
    bullet("MITRE ATT&CK Framework – https://attack.mitre.org/"),
    bullet("Wazuh Documentation – https://documentation.wazuh.com/"),
    bullet("NIST Cybersecurity Framework – https://www.nist.gov/cyberframework"),
  );

  children.push(
    heading("Chapter 9", HeadingLevel.HEADING_1, { pageBreakBefore: true }),
    heading("Conclusion", HeadingLevel.HEADING_2),
    textPara(
      "This project demonstrates that an academically scoped SIEM can still preserve practical cybersecurity engineering value. By combining ingestion pipelines, deterministic detections, incident workflows, real-time analytics, and AI-assisted analyst support, the AI SIEM Platform provides a complete learning artifact for security operations education. The work satisfies core objectives of integration, reliability, maintainability, and demonstrability.",
    ),
    textPara(
      "Future enhancements may include threat-intelligence feed enrichment, improved correlation graphs, role-specific dashboards, integration with ticketing tools, and deeper test automation. Even in its current state, the platform provides a robust baseline for final-year project evaluation and onward extension.",
    ),
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24,
          },
          paragraph: {
            spacing: { line: 360, after: 180 },
          },
        },
      },
    },
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "AI SIEM Platform 2025-26", size: 20 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${COLLEGE_NAME} | ${DEPARTMENT_NAME}`, size: 18 })],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${COLLEGE_NAME} | ${DEPARTMENT_NAME} | Page `,
                    size: 20,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputDocx, buffer);
  console.log(`Generated report: ${outputDocx}`);
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
