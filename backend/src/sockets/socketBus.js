let io = null;

function setIO(instance) {
  io = instance;
}

function getIO() {
  return io;
}

function emitNewLogs(logs) {
  if (!io) {
    return;
  }

  io.to("log_stream").emit("new_logs", logs);
}

function emitNewAlert(alert) {
  if (!io) {
    return;
  }

  io.emit("new_alert", alert);
}

function emitStatsUpdate(stats) {
  if (!io) {
    return;
  }

  io.emit("stats_update", stats);
}

module.exports = {
  setIO,
  getIO,
  emitNewLogs,
  emitNewAlert,
  emitStatsUpdate,
};