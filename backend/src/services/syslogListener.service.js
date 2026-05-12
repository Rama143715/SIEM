const dgram = require("node:dgram");
const net = require("node:net");
const env = require("../config/env");
const logIngestionService = require("./logIngestion.service");
const logger = require("../utils/logger");

let udpServer = null;
let tcpServer = null;

function mapSyslogSeverity(priority = 13) {
  const severityCode = Number(priority) % 8;

  if (severityCode <= 2) return "CRITICAL";
  if (severityCode === 3) return "HIGH";
  if (severityCode === 4) return "MEDIUM";
  if (severityCode === 5) return "LOW";
  return "INFO";
}

function parseSyslog(raw) {
  const text = String(raw || "").trim();
  const match = text.match(/^<(?<pri>\d+)>(?<rest>.*)$/);
  const pri = match?.groups?.pri ? Number(match.groups.pri) : 13;
  const rest = match?.groups?.rest || text;

  return {
    priority: pri,
    message: rest,
    timestamp: new Date(),
  };
}

function startUdpListener() {
  if (udpServer) {
    return;
  }

  udpServer = dgram.createSocket("udp4");

  udpServer.on("error", (error) => {
    logger.error({ message: "Syslog UDP server error", error: error.message });
  });

  udpServer.on("message", async (message, rinfo) => {
    try {
      const raw = message.toString();
      const parsed = parseSyslog(raw);

      await logIngestionService.ingest({
        source_name: rinfo.address,
        severity: mapSyslogSeverity(parsed.priority),
        message: parsed.message,
        raw_log: raw,
        ip_src: rinfo.address,
        category: "syslog",
        ts: parsed.timestamp,
      }, "syslog");
    } catch (error) {
      logger.error({ message: "Failed to process syslog packet", error: error.message });
    }
  });

  udpServer.bind(env.SYSLOG_UDP_PORT, () => {
    logger.info({ message: `Syslog UDP listener running on port ${env.SYSLOG_UDP_PORT}` });
  });
}

function startTcpListener() {
  if (tcpServer) {
    return;
  }

  tcpServer = net.createServer((socket) => {
    socket.on("data", async (chunk) => {
      const text = chunk.toString("utf-8");
      const lines = text.split(/\r?\n/).filter(Boolean);

      for (const line of lines) {
        try {
          const parsed = parseSyslog(line);
          await logIngestionService.ingest({
            source_name: socket.remoteAddress,
            severity: mapSyslogSeverity(parsed.priority),
            message: parsed.message,
            raw_log: line,
            ip_src: socket.remoteAddress,
            category: "syslog",
            ts: parsed.timestamp,
          }, "syslog");
        } catch (error) {
          logger.error({ message: "Failed to process syslog TCP frame", error: error.message });
        }
      }
    });
  });

  tcpServer.on("error", (error) => {
    logger.error({ message: "Syslog TCP server error", error: error.message });
  });

  tcpServer.listen(env.SYSLOG_TCP_PORT, () => {
    logger.info({ message: `Syslog TCP listener running on port ${env.SYSLOG_TCP_PORT}` });
  });
}

function start() {
  startUdpListener();
  startTcpListener();
}

module.exports = {
  start,
};
