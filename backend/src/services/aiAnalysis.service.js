const Bull = require("bull");
const Anthropic = require("@anthropic-ai/sdk");
const env = require("../config/env");
const db = require("../config/database");
const logger = require("../utils/logger");

const aiQueue = new Bull("ai-analysis", env.REDIS_URL, {
  limiter: {
    max: 20,
    duration: 60000,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;

const systemPrompt = `You are an expert SOC analyst and threat intelligence specialist with deep knowledge of:
- MITRE ATT&CK framework (all tactics and techniques)
- Common attack patterns: brute force, SQLi, XSS, RCE, lateral movement, privilege escalation, data exfiltration
- Malware families and C2 infrastructure patterns
- Compliance frameworks: SOC2, PCI-DSS, HIPAA, ISO27001, NIST
- Digital forensics and incident response (DFIR)
- Log analysis across: firewalls, IDS/IPS, endpoints, web proxies, authentication systems

When analyzing, always provide:
1. Executive Summary (2-3 sentences)
2. Detailed Findings with severity ratings
3. MITRE ATT&CK Mapping (Tactic ? Technique ? Sub-technique)
4. Indicators of Compromise (structured list)
5. Immediate Response Actions (prioritized)
6. Long-term Remediation Recommendations
7. Confidence Score (0-100%) for your assessment

Format with clear markdown sections. Be specific and actionable.`;

const userPrompts = {
  threat_hunt: "Perform a comprehensive threat hunt over these security events.",
  anomaly: "Detect statistical and behavioral anomalies in these events.",
  forensics: "Conduct forensic analysis and reconstruct a probable attack chain.",
  compliance: "Assess events against SOC2, PCI-DSS, HIPAA, ISO27001, and NIST controls.",
  ioc: "Extract all IOCs and return both explanation and structured IOC list.",
  triage: "Triage and prioritize these alerts for SOC workflow.",
  incident: "Investigate this incident and provide a full incident response report.",
};

const severityRank = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  INFO: 0,
};

const techniqueHints = [
  {
    pattern: /mimikatz|sekurlsa|credential dump|credential dumping/i,
    tactic: "Credential Access",
    technique: "OS Credential Dumping",
    id: "T1003",
  },
  {
    pattern: /sql injection|union select|select .* from|waf blocked sqli/i,
    tactic: "Initial Access",
    technique: "Exploit Public-Facing Application",
    id: "T1190",
  },
  {
    pattern: /brute force|failed login|failed logon|failed to log on|account failed to log on|multiple failed|password spray|event_id"?\s*:\s*4625/i,
    tactic: "Credential Access",
    technique: "Brute Force",
    id: "T1110",
  },
  {
    pattern: /suspicious login|impossible travel|login success after failures/i,
    tactic: "Initial Access",
    technique: "Valid Accounts",
    id: "T1078",
  },
  {
    pattern: /powershell|encodedcommand|invoke-|downloadstring/i,
    tactic: "Execution",
    technique: "Command and Scripting Interpreter: PowerShell",
    id: "T1059.001",
  },
  {
    pattern: /c2|command and control|beacon|callback/i,
    tactic: "Command and Control",
    technique: "Application Layer Protocol",
    id: "T1071",
  },
];

function getTextContent(response) {
  if (!response?.content?.length) {
    return "No analysis output returned.";
  }

  return response.content.map((block) => block.text || "").join("\n");
}

function parseInputEvents(inputText) {
  return inputText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line, raw_log: line };
      }
    });
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractIps(text) {
  return uniqueValues(text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []);
}

function getHighestSeverity(events) {
  return events
    .map((event) => String(event.severity || "INFO").toUpperCase())
    .sort((a, b) => (severityRank[b] ?? 0) - (severityRank[a] ?? 0))[0] || "INFO";
}

function getTechniqueMatches(inputText) {
  return techniqueHints.filter((hint) => hint.pattern.test(inputText));
}

function buildOfflineAnalysis({ analysisType, inputText }) {
  const events = parseInputEvents(inputText);
  const highestSeverity = getHighestSeverity(events);
  const criticalCount = events.filter((event) => String(event.severity || "").toUpperCase() === "CRITICAL").length;
  const highCount = events.filter((event) => String(event.severity || "").toUpperCase() === "HIGH").length;
  const messages = events.map((event) => event.message || event.raw_log || JSON.stringify(event));
  const ips = uniqueValues(events.flatMap((event) => [event.ip_src, event.ip_dst, ...extractIps(event.message || event.raw_log || "")]));
  const users = uniqueValues(events.map((event) => event.user_name || event.user));
  const hosts = uniqueValues(events.map((event) => event.host_name || event.host || event.hostname));
  const categories = uniqueValues(events.map((event) => event.category));
  const sources = uniqueValues(events.map((event) => event.source_name));
  const techniques = getTechniqueMatches(inputText);
  const topEvents = events
    .slice()
    .sort((a, b) => (severityRank[String(b.severity || "INFO").toUpperCase()] ?? 0) - (severityRank[String(a.severity || "INFO").toUpperCase()] ?? 0))
    .slice(0, 5);

  const likelyCompromise = highestSeverity === "CRITICAL" || criticalCount > 0;
  const summary = likelyCompromise
    ? `The submitted evidence contains ${criticalCount || highCount} high-priority event(s) and should be handled as an active security incident until contained. The strongest indicators point to ${techniques.map((item) => item.technique).join(", ") || "suspicious activity requiring analyst validation"}.`
    : `The submitted evidence contains ${events.length} event(s) with highest severity ${highestSeverity}. No API key is configured, so this deterministic offline analysis highlights observable indicators and recommended triage steps.`;

  const mitreRows = techniques.length
    ? techniques.map((item) => `- ${item.tactic} -> ${item.technique} (${item.id})`).join("\n")
    : "- No confident MITRE mapping detected from the submitted text.";

  const findingRows = topEvents.length
    ? topEvents
        .map((event, index) => `- ${index + 1}. [${String(event.severity || "INFO").toUpperCase()}] ${event.message || event.raw_log || "Security event"}${event.host_name ? ` on ${event.host_name}` : ""}${event.user_name ? ` for user ${event.user_name}` : ""}`)
        .join("\n")
    : "- No parseable events were provided.";

  const iocRows = [
    ips.length ? `- IP addresses: ${ips.join(", ")}` : "- IP addresses: none observed",
    users.length ? `- Users: ${users.join(", ")}` : "- Users: none observed",
    hosts.length ? `- Hosts: ${hosts.join(", ")}` : "- Hosts: none observed",
    sources.length ? `- Sources: ${sources.join(", ")}` : "- Sources: none observed",
    categories.length ? `- Categories: ${categories.join(", ")}` : "- Categories: none observed",
  ].join("\n");

  return `## AI Analysis (Offline SOC Mode)

Anthropic API key is not configured, so the platform generated deterministic SOC analysis from the submitted evidence.

Requested analysis type: ${analysisType}

## Executive Summary
${summary}

## Detailed Findings
- Events reviewed: ${events.length}
- Highest severity: ${highestSeverity}
- Critical events: ${criticalCount}
- High events: ${highCount}
${findingRows}

## MITRE ATT&CK Mapping
${mitreRows}

## Indicators of Compromise
${iocRows}

## Immediate Response Actions
1. Isolate affected endpoint(s), especially ${hosts[0] || "the host(s) named in the alert"}, if credential theft or execution behavior is confirmed.
2. Disable or reset credentials for ${users[0] || "affected user accounts"} and review recent authentication activity.
3. Block or investigate external IPs ${ips.filter((ip) => !ip.startsWith("10.") && !ip.startsWith("192.168.") && !ip.startsWith("172.16.")).join(", ") || "identified in the evidence"}.
4. Preserve related logs, EDR telemetry, process trees, and web/WAF request details for incident evidence.
5. Escalate to incident response if the same host, user, or source appears across multiple alert categories.

## Long-term Remediation Recommendations
- Tune detection rules for repeated credential access, SQL injection, and suspicious login chains.
- Enforce MFA and privileged access controls for sensitive users and systems.
- Patch and harden public web applications, then validate WAF coverage with controlled tests.
- Add endpoint containment and credential rotation steps to the incident runbook.

## Confidence Score
75% based on parsed fields, keyword detection, and severity context. Configure ANTHROPIC_API_KEY for model-assisted reasoning and richer narrative analysis.`;
}

async function saveAnalysis({ userId, analysisType, inputData, outputData, tokensUsed, relatedLogs, incidentId }) {
  const query = `
    INSERT INTO ai_analyses (user_id, analysis_type, input_data, output_data, tokens_used, related_logs, incident_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  const values = [
    userId,
    analysisType,
    inputData,
    outputData,
    tokensUsed,
    relatedLogs || [],
    incidentId || null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}

async function analyzeWithClaude({ analysisType, inputText, userId, relatedLogs = [], incidentId = null, model = "claude-sonnet-4-20250514" }) {
  if (!anthropic) {
    const fallback = buildOfflineAnalysis({ analysisType, inputText });

    const saved = await saveAnalysis({
      userId,
      analysisType,
      inputData: inputText,
      outputData: fallback,
      tokensUsed: 0,
      relatedLogs,
      incidentId,
    });

    return {
      analysis_id: saved.id,
      result: fallback,
      tokens_used: 0,
    };
  }

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `${userPrompts[analysisType] || userPrompts.triage}\n\n${inputText}`,
      },
    ],
  });

  const outputText = getTextContent(response);
  const usage = response.usage || { input_tokens: 0, output_tokens: 0 };
  const tokensUsed = Number(usage.input_tokens || 0) + Number(usage.output_tokens || 0);

  const saved = await saveAnalysis({
    userId,
    analysisType,
    inputData: inputText,
    outputData: outputText,
    tokensUsed,
    relatedLogs,
    incidentId,
  });

  return {
    analysis_id: saved.id,
    result: outputText,
    tokens_used: tokensUsed,
  };
}

async function queueAnalysis(payload) {
  const job = await aiQueue.add(payload, {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });

  return job.id;
}

async function getAnalysisHistory(userId) {
  const query = `
    SELECT *
    FROM ai_analyses
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 100
  `;

  const { rows } = await db.query(query, [userId]);
  return rows;
}

async function getAnalysisById(id, userId) {
  const query = `
    SELECT *
    FROM ai_analyses
    WHERE id = $1 AND user_id = $2
    LIMIT 1
  `;

  const { rows } = await db.query(query, [id, userId]);
  return rows[0] || null;
}

async function start() {
  aiQueue.process(async (job) => {
    const { analysisType, inputText, userId, relatedLogs, incidentId, model } = job.data;
    try {
      return await analyzeWithClaude({ analysisType, inputText, userId, relatedLogs, incidentId, model });
    } catch (error) {
      logger.error({ message: "AI queue job failed", error: error.message });
      throw error;
    }
  });
}

module.exports = {
  start,
  analyzeWithClaude,
  queueAnalysis,
  getAnalysisHistory,
  getAnalysisById,
};
