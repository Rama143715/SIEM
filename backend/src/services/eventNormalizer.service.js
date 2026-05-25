function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function cleanString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  return String(value);
}

function severityFromLevel(level) {
  const numeric = Number(level);
  if (Number.isFinite(numeric)) {
    if (numeric >= 12) return "CRITICAL";
    if (numeric >= 8) return "HIGH";
    if (numeric >= 4) return "MEDIUM";
    if (numeric >= 1) return "LOW";
  }

  const text = String(level || "").toLowerCase();
  if (/(critical|fatal|emergency|alert)/.test(text)) return "CRITICAL";
  if (/(high|error|err)/.test(text)) return "HIGH";
  if (/(medium|warning|warn)/.test(text)) return "MEDIUM";
  if (/(low|notice)/.test(text)) return "LOW";
  return "INFO";
}

function severityFromWindowsEventId(eventId, fallbackSeverity) {
  const id = Number(eventId);

  if ([1102, 4720, 4728, 4732, 4756].includes(id)) {
    return "HIGH";
  }

  if ([4625, 4648, 4672, 4688, 4697, 7045].includes(id)) {
    return "MEDIUM";
  }

  if ([4624, 4634, 4689].includes(id)) {
    return "INFO";
  }

  return fallbackSeverity;
}

function normalizeWazuh(event) {
  const rule = event.rule || {};
  const agent = event.agent || {};
  const data = event.data || {};

  return {
    severity: severityFromLevel(firstValue(rule.level, event.level)),
    category: firstValue(rule.groups?.[0], event.location, "wazuh"),
    message: cleanString(firstValue(rule.description, event.full_log, event.message)),
    raw_log: cleanString(firstValue(event.full_log, event.message)),
    ip_src: cleanString(firstValue(data.srcip, data.src_ip, event.srcip)),
    ip_dst: cleanString(firstValue(data.dstip, data.dest_ip, event.dstip)),
    user_name: cleanString(firstValue(data.srcuser, data.user, event.user?.name)),
    host_name: cleanString(firstValue(agent.name, data.hostname, event.hostname)),
    session_id: cleanString(firstValue(data.session_id, event.session_id)),
    extra_data: {
      format: "wazuh",
      rule_id: rule.id,
      rule_level: rule.level,
      mitre: rule.mitre || null,
      location: event.location,
      decoder: event.decoder || null,
      raw_event: event,
    },
    ts: firstValue(event.timestamp, event["@timestamp"], event.ts),
  };
}

function normalizeSuricata(event) {
  const alert = event.alert || {};

  return {
    severity: severityFromLevel(alert.severity ? 5 - Number(alert.severity) : event.severity),
    category: firstValue(event.event_type, alert.category, "suricata"),
    message: cleanString(firstValue(alert.signature, event.message, event.flow_id)),
    raw_log: cleanString(event.payload_printable || event.raw || event.message),
    ip_src: cleanString(firstValue(event.src_ip, event.srcip)),
    ip_dst: cleanString(firstValue(event.dest_ip, event.dst_ip, event.dstip)),
    user_name: null,
    host_name: cleanString(firstValue(event.host, event.hostname)),
    session_id: cleanString(firstValue(event.flow_id, event.community_id)),
    extra_data: {
      format: "suricata_eve",
      signature_id: alert.signature_id,
      category: alert.category,
      protocol: event.proto,
      source_port: event.src_port,
      destination_port: event.dest_port,
      raw_event: event,
    },
    ts: firstValue(event.timestamp, event["@timestamp"], event.ts),
  };
}

function normalizeWindowsEvent(event) {
  const eventData = event.EventData || event.event_data || event.winlog?.event_data || {};
  const system = event.System || {};
  const winlog = event.winlog || {};
  const eventId = firstValue(event.EventID, event.event_id, winlog.event_id, system.EventID);
  const fallbackSeverity = severityFromLevel(firstValue(event.LevelDisplayName, event.level, winlog.level));

  return {
    severity: severityFromWindowsEventId(eventId, fallbackSeverity),
    category: firstValue(event.ProviderName, winlog.channel, event.channel, "windows"),
    message: cleanString(firstValue(event.Message, event.message, winlog.message, `Windows event ${eventId}`)),
    raw_log: cleanString(firstValue(event.raw, event.Message, event.message)),
    ip_src: cleanString(firstValue(eventData.IpAddress, eventData.SourceIp, event.source?.ip)),
    ip_dst: cleanString(firstValue(eventData.DestinationIp, event.destination?.ip)),
    user_name: cleanString(firstValue(eventData.TargetUserName, eventData.SubjectUserName, event.user?.name)),
    host_name: cleanString(firstValue(event.Computer, event.host?.name, event.agent?.name)),
    session_id: cleanString(firstValue(eventData.LogonId, eventData.ProcessGuid, event.session_id)),
    extra_data: {
      format: "windows_event",
      event_id: eventId,
      provider: firstValue(event.ProviderName, winlog.provider_name),
      process: firstValue(eventData.Image, event.process?.executable),
      command_line: firstValue(eventData.CommandLine, event.process?.command_line),
      raw_event: event,
    },
    ts: firstValue(event.TimeCreated, event["@timestamp"], event.timestamp, event.ts),
  };
}

function normalizeZeek(event) {
  return {
    severity: severityFromLevel(event.severity),
    category: firstValue(event._path, event.log_type, "zeek"),
    message: cleanString(firstValue(event.note, event.msg, event.message, `${event._path || "zeek"} event`)),
    raw_log: cleanString(event.raw || event.message),
    ip_src: cleanString(firstValue(event["id.orig_h"], event.src_ip, event.uid_orig_h)),
    ip_dst: cleanString(firstValue(event["id.resp_h"], event.dest_ip, event.dst_ip)),
    user_name: cleanString(firstValue(event.user, event.username)),
    host_name: cleanString(firstValue(event.host, event.hostname)),
    session_id: cleanString(firstValue(event.uid, event.session_id)),
    extra_data: {
      format: "zeek",
      protocol: firstValue(event.proto, event.service),
      source_port: event["id.orig_p"],
      destination_port: event["id.resp_p"],
      raw_event: event,
    },
    ts: firstValue(event.ts, event.timestamp, event["@timestamp"]),
  };
}

function normalizeGeneric(event) {
  return {
    severity: severityFromLevel(firstValue(event.severity, event.level, event.priority)),
    category: firstValue(event.category, event.event_type, event.type, "general"),
    message: cleanString(firstValue(event.message, event.msg, event.raw_log, event.raw, JSON.stringify(event))),
    raw_log: cleanString(firstValue(event.raw_log, event.raw, event.full_log)),
    ip_src: cleanString(firstValue(event.ip_src, event.src_ip, event.source?.ip, event.client_ip)),
    ip_dst: cleanString(firstValue(event.ip_dst, event.dest_ip, event.destination?.ip, event.server_ip)),
    user_name: cleanString(firstValue(event.user_name, event.username, event.user?.name)),
    host_name: cleanString(firstValue(event.host_name, event.hostname, event.host?.name, event.agent?.name)),
    session_id: cleanString(firstValue(event.session_id, event.flow_id, event.uid)),
    extra_data: {
      ...(event.extra_data || {}),
      format: "generic_json",
      raw_event: event,
    },
    ts: firstValue(event.ts, event.timestamp, event["@timestamp"], event.time),
  };
}

function detectFormat(event = {}) {
  if (event.rule && (event.agent || event.manager || event.decoder)) return "wazuh";
  if (event.event_type && (event.alert || event.flow || event.dns)) return "suricata";
  if (event.EventID || event.winlog || event.EventData || event.event_data) return "windows";
  if (event._path || event.uid || event["id.orig_h"]) return "zeek";
  return "generic";
}

function normalizeEvent(event = {}) {
  const format = detectFormat(event);

  if (format === "wazuh") return normalizeWazuh(event);
  if (format === "suricata") return normalizeSuricata(event);
  if (format === "windows") return normalizeWindowsEvent(event);
  if (format === "zeek") return normalizeZeek(event);
  return normalizeGeneric(event);
}

function normalizeEvents(events = []) {
  return events.map(normalizeEvent);
}

module.exports = {
  normalizeEvent,
  normalizeEvents,
  detectFormat,
};
