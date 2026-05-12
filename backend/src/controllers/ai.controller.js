const aiService = require("../services/aiAnalysis.service");
const { writeAuditLog } = require("../services/audit.service");

function buildInputText(logs, rawText) {
  if (rawText) {
    return rawText;
  }

  if (!Array.isArray(logs) || logs.length === 0) {
    return "";
  }

  return logs.map((log) => JSON.stringify(log)).join("\n");
}

async function analyze(request, response, next) {
  try {
    const analysisType = request.body.analysis_type;
    const inputText = buildInputText(request.body.logs, request.body.raw_text);

    if (!analysisType || !inputText) {
      return response.status(400).json({ error: "analysis_type and logs/raw_text are required." });
    }

    const relatedLogs = Array.isArray(request.body.logs)
      ? request.body.logs.map((log) => Number(log.id)).filter(Number.isFinite)
      : [];

    const result = await aiService.analyzeWithClaude({
      analysisType,
      inputText,
      userId: request.user.id,
      relatedLogs,
      incidentId: request.body.incident_id || null,
      model: request.body.model || "claude-sonnet-4-20250514",
    });

    await writeAuditLog({
      userId: request.user.id,
      action: "ai.analyze",
      target: "ai",
      targetId: result.analysis_id,
      ipAddress: request.ip,
      metadata: { analysisType },
    });

    return response.json(result);
  } catch (error) {
    return next(error);
  }
}

async function history(request, response, next) {
  try {
    const items = await aiService.getAnalysisHistory(request.user.id);
    return response.json({ analyses: items });
  } catch (error) {
    return next(error);
  }
}

async function getAnalysis(request, response, next) {
  try {
    const item = await aiService.getAnalysisById(request.params.id, request.user.id);
    if (!item) {
      return response.status(404).json({ error: "Analysis not found." });
    }

    return response.json({ analysis: item });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  analyze,
  history,
  getAnalysis,
};