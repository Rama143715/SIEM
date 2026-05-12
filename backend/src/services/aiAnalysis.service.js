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

function getTextContent(response) {
  if (!response?.content?.length) {
    return "No analysis output returned.";
  }

  return response.content.map((block) => block.text || "").join("\n");
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
    const fallback = `## AI Analysis (Offline Mode)\n\nAnthropic API key is not configured.\n\nRequested analysis type: ${analysisType}\n\nInput length: ${inputText.length} characters.`;

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