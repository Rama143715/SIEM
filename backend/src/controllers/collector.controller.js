const logSourceModel = require("../models/logSource.model");
const logIngestionService = require("../services/logIngestion.service");
const eventNormalizer = require("../services/eventNormalizer.service");

function getSourceApiKey(request) {
  return request.get("x-siem-source-key") || request.body.source_api_key;
}

function getEvents(body = {}) {
  if (Array.isArray(body.events)) {
    return body.events;
  }

  if (Array.isArray(body.logs)) {
    return body.logs;
  }

  if (body.event && typeof body.event === "object") {
    return [body.event];
  }

  if (body.log && typeof body.log === "object") {
    return [body.log];
  }

  return [];
}

async function ingestEvents(request, response, next) {
  try {
    const sourceApiKey = getSourceApiKey(request);
    const events = getEvents(request.body);

    if (!sourceApiKey || !events.length) {
      return response.status(400).json({ error: "x-siem-source-key/source_api_key and events[] are required." });
    }

    const source = await logSourceModel.getSourceByApiKey(sourceApiKey);
    if (!source) {
      return response.status(401).json({ error: "Invalid source API key." });
    }

    const normalizedEvents = eventNormalizer.normalizeEvents(events);
    await logSourceModel.touchSource(source.id);

    for (const event of normalizedEvents) {
      await logIngestionService.queueIngestion({
        sourceId: source.id,
        rawLog: {
          ...event,
          source_name: source.name,
          extra_data: {
            ...(event.extra_data || {}),
            collector: "real_world",
          },
        },
        receivedAt: new Date().toISOString(),
      });
    }

    return response.status(202).json({
      accepted: normalizedEvents.length,
      source: source.name,
      formats: [...new Set(normalizedEvents.map((event) => event.extra_data?.format || "unknown"))],
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  ingestEvents,
};
