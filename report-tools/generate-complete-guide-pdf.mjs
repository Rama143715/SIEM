import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd(), "..");
const outputPath = path.join(projectRoot, "docs", "SOC_Platform_AI_SIEM_Complete_Guide.pdf");

const page = {
  width: 595.28,
  height: 841.89,
  marginLeft: 54,
  marginRight: 54,
  marginTop: 56,
  marginBottom: 56,
};

const fonts = {
  regular: "F1",
  bold: "F2",
  mono: "F3",
};

function escapePdfText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "");
}

function sanitize(text) {
  return String(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/•/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function approxWidth(text, fontSize, isMono = false) {
  const factor = isMono ? 0.6 : 0.52;
  return sanitize(text).length * fontSize * factor;
}

function wrapText(text, fontSize, maxWidth, isMono = false) {
  const clean = sanitize(text);
  if (!clean.trim()) return [""];

  const words = clean.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (approxWidth(candidate, fontSize, isMono) <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) lines.push(line);

    if (approxWidth(word, fontSize, isMono) <= maxWidth) {
      line = word;
      continue;
    }

    let chunk = "";
    for (const char of word) {
      const candidateChunk = chunk + char;
      if (approxWidth(candidateChunk, fontSize, isMono) <= maxWidth) {
        chunk = candidateChunk;
      } else {
        lines.push(chunk);
        chunk = char;
      }
    }
    line = chunk;
  }

  if (line) lines.push(line);
  return lines;
}

function paragraph(text, opts = {}) {
  return { type: "paragraph", text, ...opts };
}

function heading(text, level = 1) {
  return { type: "heading", text, level };
}

function code(text) {
  return { type: "code", text };
}

function bullet(text) {
  return { type: "bullet", text };
}

const content = [
  { type: "title", text: "SOC Platform AI SIEM Complete Guide" },
  paragraph("Real-world attack monitoring, log analysis, alerts, incidents, AI Analysis, rules, and database access.", { align: "center" }),
  paragraph(`Generated for project: ${projectRoot}`, { align: "center", size: 9 }),
  { type: "pageBreak" },

  heading("1. Platform Overview"),
  paragraph("Your SOC Platform AI SIEM is a full-stack security monitoring application. The frontend shows Dashboard, Logs, Alerts, Incidents, AI Analysis, Rules, and Settings. The backend receives logs, stores records in PostgreSQL, evaluates rules, creates alerts, supports incidents, and saves AI analysis history."),
  bullet("Frontend: React + Vite SOC dashboard."),
  bullet("Backend: Node.js + Express API."),
  bullet("Database: PostgreSQL for users, logs, rules, alerts, incidents, AI analyses, and audit records."),
  bullet("Redis: queueing, rate limits, temporary counters, and real-time statistics."),
  bullet("Detection: pattern, regex, field match, threshold, and correlation rules."),

  heading("2. Start the Platform"),
  code(`cd "C:\\Users\\bpava\\OneDrive\\Documents\\New project\\Wazuh-SIEM-Security-Lab\\siem-platform"
docker compose up -d postgres redis
docker compose run --rm backend npm run migrate
docker compose run --rm backend npm run seed
docker compose up -d`),
  paragraph("Open the application in your browser:"),
  bullet("Frontend: http://localhost:5173"),
  bullet("Backend health: http://localhost:3001/health"),
  bullet("Default admin email: admin@siem.local"),
  bullet("Default admin password: changeme123"),

  heading("3. Prove Real-World Attack Monitoring"),
  paragraph("Use the simulator to prove that ingestion, detection, alerting, and dashboard updates work end to end."),
  code(`.\\tools\\simulate-attacks.ps1`),
  paragraph("The simulator logs in to the API, creates missing demo rules, sends attack logs, waits for processing, and prints a run id for evidence tracking."),
  bullet("Brute force login attempts."),
  bullet("Successful login after repeated failures."),
  bullet("SQL injection against a web asset."),
  bullet("Credential dumping indicator from endpoint logs."),
  paragraph("Expected UI proof: Dashboard counters change, Logs page shows the run id, Alerts page shows triggered detections, Incidents can link the evidence, and AI Analysis can summarize the case."),

  heading("4. Manual Log Ingestion"),
  paragraph("Authenticate first and store the JWT token:"),
  code(`$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/auth/login" -ContentType "application/json" -Body (@{
  email = "admin@siem.local"
  password = "changeme123"
} | ConvertTo-Json)

$token = $login.access_token
$headers = @{ Authorization = "Bearer $token" }`),
  paragraph("Send one SQL injection log:"),
  code(`Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/logs/ingest/single" -Headers $headers -ContentType "application/json" -Body (@{
  source_api_key = "firewall_demo_key"
  log = @{
    severity = "CRITICAL"
    category = "web"
    message = "WAF blocked SQL injection: /login?id=1 UNION SELECT password FROM users"
    ip_src = "198.51.100.77"
    ip_dst = "10.0.0.80"
    user_name = "anonymous"
    host_name = "public-web-01"
  }
} | ConvertTo-Json -Depth 10)`),
  paragraph("Send brute force logs in bulk:"),
  code(`$logs = @()
for ($i = 1; $i -le 10; $i++) {
  $logs += @{
    severity = "HIGH"
    category = "authentication"
    message = "failed login for user admin from 203.0.113.50 attempt=$i"
    ip_src = "203.0.113.50"
    ip_dst = "10.0.0.25"
    user_name = "admin"
    host_name = "vpn-gateway-01"
  }
}

Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/logs/ingest" -Headers $headers -ContentType "application/json" -Body (@{
  source_api_key = "firewall_demo_key"
  logs = $logs
} | ConvertTo-Json -Depth 10)`),

  heading("5. How to Analyze Logs"),
  bullet("Open Logs and filter by severity: CRITICAL and HIGH first."),
  bullet("Filter by source: firewall-main for network/web logs, endpoint-edr for host logs."),
  bullet("Search by IOC: attacker IP, username, host name, URL path, payload, or simulator run id."),
  bullet("Review timestamp, source, severity, category, message, ip_src, ip_dst, user_name, host_name, and extra_data."),
  bullet("Decide if the event is true positive, false positive, or needs more evidence."),

  heading("6. Alerts Workflow"),
  paragraph("The alert engine evaluates each ingested log against enabled rules. When a rule matches, the platform creates or updates an alert and streams it to the frontend."),
  bullet("pattern: text match against a selected field."),
  bullet("regex: regular expression match against the message."),
  bullet("field_match: contains, equals, or regex against any log field."),
  bullet("threshold: repeated matching events in a time window."),
  bullet("correlation: suspicious login success after repeated failures from same source and user."),
  paragraph("Alert triage steps: open Alerts, review severity/detail/source/log IDs, acknowledge the alert, create an incident if confirmed, then resolve only after response is complete."),

  heading("7. Incident Workflow"),
  bullet("Create an incident for confirmed compromise, repeated activity, or multiple related alerts."),
  bullet("Use a clear title such as SQL Injection Attempt Against public-web-01."),
  bullet("Set severity based on the highest confirmed alert."),
  bullet("Link alert IDs and log IDs as evidence."),
  bullet("Add timeline notes for detection, validation, containment, eradication, recovery, and closure."),
  bullet("Close the incident only after evidence and response actions are documented."),

  heading("8. AI Analysis"),
  paragraph("AI Analysis supports SOC-style investigation. If ANTHROPIC_API_KEY is empty, the app records offline fallback analysis. Add the key in .env and restart backend for real AI output."),
  bullet("triage: prioritize alert handling."),
  bullet("forensics: reconstruct likely attack chain."),
  bullet("ioc: extract IPs, users, hosts, URLs, and suspicious strings."),
  bullet("threat_hunt: recommend additional searches."),
  bullet("incident: create an incident response summary."),
  code(`Example AI input:
Alert: SQL Injection Pattern triggered
Severity: CRITICAL
Source: firewall-main
Log: WAF blocked SQL injection: /login?id=1 UNION SELECT password FROM users
ip_src: 198.51.100.77
ip_dst: 10.0.0.80
host: public-web-01

Question: Triage this alert, map MITRE ATT&CK, list IOCs, and recommend response steps.`),

  heading("9. Rules"),
  paragraph("Rules define how the SIEM detects attacks. Start with a simple rule, test it with sample logs, then tune threshold, field, or regex to reduce false positives."),
  paragraph("Seeded rules include Brute Force Login Attempts and SQL Injection Pattern."),
  code(`Pattern rule example:
{
  "name": "Malware Keyword Detected",
  "severity": "HIGH",
  "type": "pattern",
  "conditions": {
    "field": "message",
    "operator": "contains",
    "value": "malware detected"
  },
  "actions": [{ "type": "create_alert" }],
  "is_enabled": true
}`),
  code(`Threshold rule example:
{
  "name": "Password Spray",
  "severity": "HIGH",
  "type": "threshold",
  "conditions": {
    "field": "message",
    "operator": "contains",
    "value": "failed login",
    "threshold": 10,
    "timeWindowSeconds": 60
  },
  "actions": [{ "type": "create_alert" }],
  "is_enabled": true
}`),

  heading("10. Database Access"),
  paragraph("The app stores records in PostgreSQL running inside Docker."),
  bullet("Database: siem_db"),
  bullet("User: siem_user"),
  bullet("Password: POSTGRES_PASSWORD from .env"),
  bullet("Host from laptop: localhost"),
  bullet("Port: 5432"),
  paragraph("Enter the database terminal:"),
  code(`docker compose exec postgres psql -U siem_user -d siem_db`),
  paragraph("Show tables inside PostgreSQL:"),
  code(`\\dt`),
  paragraph("Show records:"),
  code(`SELECT * FROM users;
SELECT * FROM log_sources;
SELECT * FROM logs ORDER BY ts DESC LIMIT 20;
SELECT * FROM alerts ORDER BY created_at DESC LIMIT 20;
SELECT * FROM incidents ORDER BY created_at DESC LIMIT 20;
SELECT * FROM rules ORDER BY created_at DESC;
SELECT * FROM ai_analyses ORDER BY created_at DESC LIMIT 10;`),
  paragraph("Exit PostgreSQL:"),
  code(`\\q`),

  heading("11. Useful One-Line Database Commands"),
  code(`docker compose exec -T postgres psql -U siem_user -d siem_db -c "SELECT id, ts, severity, source_name, category, message, ip_src, user_name, host_name FROM logs ORDER BY ts DESC LIMIT 20;"`),
  code(`docker compose exec -T postgres psql -U siem_user -d siem_db -c "SELECT id, title, severity, status, source_name, occurrence, created_at FROM alerts ORDER BY created_at DESC LIMIT 20;"`),
  code(`docker compose exec -T postgres psql -U siem_user -d siem_db -c "SELECT id, name, severity, type, is_enabled, mitre_tactic, mitre_tech FROM rules ORDER BY created_at DESC;"`),

  heading("12. How the Database Works"),
  paragraph("Frontend UI sends requests to the Backend API. The backend validates input, applies authentication and role checks, then writes or reads records from PostgreSQL. Redis assists with queueing, rate limits, and temporary dashboard counters."),
  bullet("users: login accounts and roles."),
  bullet("log_sources: firewall/endpoint source identities and hashed API keys."),
  bullet("logs: raw and normalized SIEM events."),
  bullet("rules: detection logic."),
  bullet("alerts: detections generated from matching rules."),
  bullet("incidents: SOC cases created from alerts/logs."),
  bullet("ai_analyses: saved AI outputs and offline fallback records."),
  bullet("audit_log: important admin and analyst actions."),

  heading("13. Evidence Checklist for Final Demo"),
  bullet("Dashboard before and after simulation."),
  bullet("Simulator terminal output with accepted logs and run id."),
  bullet("Logs page filtered by the run id."),
  bullet("Alerts page showing triggered detections."),
  bullet("Alert acknowledgement screenshot."),
  bullet("Incident with linked alert/log evidence and timeline."),
  bullet("AI Analysis output for selected alert or incident evidence."),
  bullet("Rules page showing enabled detection logic."),
  bullet("Database terminal showing rows in logs, alerts, incidents, rules, and ai_analyses."),
];

function renderPages(items) {
  const pages = [];
  let lines = [];
  let y = page.height - page.marginTop;
  const maxWidth = page.width - page.marginLeft - page.marginRight;

  function newPage() {
    if (lines.length) pages.push(lines);
    lines = [];
    y = page.height - page.marginTop;
  }

  function ensure(space) {
    if (y - space < page.marginBottom) newPage();
  }

  function addLine(text, { size = 11, font = fonts.regular, x = page.marginLeft, leading = 15 } = {}) {
    ensure(leading);
    lines.push({ text: sanitize(text), size, font, x, y });
    y -= leading;
  }

  for (const item of items) {
    if (item.type === "pageBreak") {
      newPage();
      continue;
    }

    if (item.type === "title") {
      y -= 210;
      for (const line of wrapText(item.text, 24, maxWidth)) {
        addLine(line, { size: 24, font: fonts.bold, x: page.marginLeft + 28, leading: 32 });
      }
      y -= 16;
      continue;
    }

    if (item.type === "heading") {
      const size = item.level === 1 ? 17 : 14;
      const leading = item.level === 1 ? 25 : 20;
      ensure(leading + 10);
      y -= item.level === 1 ? 8 : 4;
      for (const line of wrapText(item.text, size, maxWidth)) {
        addLine(line, { size, font: fonts.bold, leading });
      }
      y -= 4;
      continue;
    }

    if (item.type === "bullet") {
      const bulletIndent = page.marginLeft + 16;
      const textIndent = page.marginLeft + 28;
      const wrapped = wrapText(item.text, 10.5, maxWidth - 28);
      ensure(wrapped.length * 14 + 2);
      addLine("-", { size: 10.5, font: fonts.regular, x: bulletIndent, leading: 0 });
      for (let i = 0; i < wrapped.length; i += 1) {
        addLine(wrapped[i], { size: 10.5, font: fonts.regular, x: textIndent, leading: i === 0 ? 14 : 14 });
      }
      y -= 2;
      continue;
    }

    if (item.type === "code") {
      y -= 4;
      for (const rawLine of sanitize(item.text).split("\n")) {
        for (const wrapped of wrapText(rawLine || " ", 8.5, maxWidth - 22, true)) {
          addLine(wrapped, { size: 8.5, font: fonts.mono, x: page.marginLeft + 12, leading: 12 });
        }
      }
      y -= 6;
      continue;
    }

    const size = item.size || 10.8;
    const x = item.align === "center" ? page.marginLeft + 20 : page.marginLeft;
    for (const line of wrapText(item.text, size, maxWidth - (item.align === "center" ? 40 : 0))) {
      addLine(line, { size, font: fonts.regular, x, leading: 15 });
    }
    y -= 7;
  }

  if (lines.length) pages.push(lines);
  return pages;
}

function buildPdf(pageLines) {
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const fontMonoId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");

  const pageIds = [];
  for (let i = 0; i < pageLines.length; i += 1) {
    const streamLines = [
      "BT",
      ...pageLines[i].map((line) => `/${line.font} ${line.size} Tf 1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm (${escapePdfText(line.text)}) Tj`),
      "ET",
      "BT",
      `/F1 8 Tf 1 0 0 1 ${(page.width / 2 - 42).toFixed(2)} 28 Tm (Page ${i + 1} of ${pageLines.length}) Tj`,
      "ET",
    ];
    const stream = streamLines.join("\n");
    const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R /F3 ${fontMonoId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  }

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "binary");
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const pdfBuffer = buildPdf(renderPages(content));
await fs.writeFile(outputPath, pdfBuffer);
console.log(outputPath);
