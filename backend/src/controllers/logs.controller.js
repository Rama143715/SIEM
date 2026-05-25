const logModel = require("../models/log.model");
const logSourceModel = require("../models/logSource.model");
const logIngestionService = require("../services/logIngestion.service");
const { writeAuditLog } = require("../services/audit.service");

function parseSeverityParam(raw) {
  if (!raw) {
    return [];
  }

  return String(raw)
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
}

async function listLogs(request, response, next) {
  try {
    const filters = {
      severity: parseSeverityParam(request.query.severity),
      source: request.query.source || "",
      search: request.query.search || "",
      ip: request.query.ip || "",
      from: request.query.from || null,
      to: request.query.to || null,
      page: request.query.page || 1,
      limit: request.query.limit || 100,
    };

    const result = await logModel.listLogs(filters);
    return response.json(result);
  } catch (error) {
    return next(error);
  }
}

async function ingestBulk(request, response, next) {
  try {
    const { source_api_key, logs } = request.body;

    if (!source_api_key || !Array.isArray(logs) || logs.length === 0) {
      return response.status(400).json({ error: "source_api_key and logs[] are required." });
    }

    const source = await logSourceModel.getSourceByApiKey(source_api_key);
    if (!source) {
      return response.status(401).json({ error: "Invalid source API key." });
    }

    await logSourceModel.touchSource(source.id);

    for (const log of logs) {
      await logIngestionService.queueIngestion({
        sourceId: source.id,
        rawLog: {
          ...log,
          source_name: source.name,
        },
        receivedAt: new Date().toISOString(),
      });
    }

    await writeAuditLog({
      userId: request.user?.id || null,
      action: "logs.ingest.bulk",
      target: "logs",
      targetId: source.id,
      ipAddress: request.ip,
      metadata: { count: logs.length, source: source.name },
    });

    return response.status(202).json({
      accepted: logs.length,
      source: source.name,
    });
  } catch (error) {
    return next(error);
  }
}

async function ingestSingle(request, response, next) {
  try {
    const { source_api_key, log } = request.body;

    if (!source_api_key || !log) {
      return response.status(400).json({ error: "source_api_key and log are required." });
    }

    const source = await logSourceModel.getSourceByApiKey(source_api_key);
    if (!source) {
      return response.status(401).json({ error: "Invalid source API key." });
    }

    await logSourceModel.touchSource(source.id);

    await logIngestionService.queueIngestion({
      sourceId: source.id,
      rawLog: {
        ...log,
        source_name: source.name,
      },
      receivedAt: new Date().toISOString(),
    });

    return response.status(202).json({ accepted: 1, source: source.name });
  } catch (error) {
    return next(error);
  }
}

async function uploadFile(request, response, next) {
  try {
    const { source_api_key } = request.body;

    if (!request.file) {
      return response.status(400).json({ error: "File is required." });
    }

    const source = await logSourceModel.getSourceByApiKey(source_api_key);
    if (!source) {
      return response.status(401).json({ error: "Invalid source API key." });
    }

    const content = request.file.buffer.toString("utf-8");
    const lines = content.split(/\r?\n/).filter(Boolean);

    for (const line of lines) {
      await logIngestionService.queueIngestion({
        sourceId: source.id,
        rawLog: {
          message: line,
          raw: line,
          severity: "INFO",
          category: "file_upload",
          source_name: source.name,
        },
        receivedAt: new Date().toISOString(),
      });
    }

    return response.status(202).json({ accepted: lines.length, source: source.name });
  } catch (error) {
    return next(error);
  }
}

async function getLogById(request, response, next) {
  try {
    const log = await logModel.getLogById(request.params.id);
    if (!log) {
      return response.status(404).json({ error: "Log not found." });
    }

    return response.json({ log });
  } catch (error) {
    return next(error);
  }
}

async function exportLogs(request, response, next) {
  try {
    const formatType = String(request.query.format || "json").toLowerCase();
    const result = await logModel.listLogs({
      ...request.query,
      severity: parseSeverityParam(request.query.severity),
      limit: Math.min(Number(request.query.limit) || 500, 500),
      page: request.query.page || 1,
    });

    if (formatType === "csv") {
      const fields = ["id", "ts", "severity", "source_name", "category", "message", "ip_src", "ip_dst", "user_name", "host_name"];
      const escapeCell = (value) => {
        if (value === null || value === undefined) {
          return "";
        }
        const text = String(value).replace(/"/g, "\"\"");
        return `"${text}"`;
      };
      const rows = result.logs.map((log) => fields.map((field) => escapeCell(log[field])).join(","));
      const csv = [fields.join(","), ...rows].join("\n");
      response.setHeader("Content-Type", "text/csv; charset=utf-8");
      response.setHeader("Content-Disposition", "attachment; filename=logs-export.csv");
      return response.send(csv);
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Disposition", "attachment; filename=logs-export.json");
    return response.send(JSON.stringify(result, null, 2));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listLogs,
  ingestBulk,
  ingestSingle,
  uploadFile,
  getLogById,
  exportLogs,
};
