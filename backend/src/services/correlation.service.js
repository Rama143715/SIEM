function correlationKey(log) {
  const ip = log.ip_src || "unknown";
  const user = log.user_name || "unknown";
  return `${ip}:${user}`;
}

function detectSimpleCorrelation(log, history = []) {
  const windowMs = 120000;
  const now = new Date(log.ts || Date.now()).getTime();
  const key = correlationKey(log);

  const recent = history.filter((item) => {
    const itemTs = new Date(item.ts).getTime();
    return correlationKey(item) === key && now - itemTs <= windowMs;
  });

  const failedAuthCount = recent.filter((item) => {
    const message = String(item.message || "").toLowerCase();
    return message.includes("failed") && message.includes("login");
  }).length;

  const successAfterFailures = failedAuthCount >= 5 && String(log.message || "").toLowerCase().includes("login success");

  if (successAfterFailures) {
    return {
      triggered: true,
      title: "Suspicious authentication sequence detected",
      detail: "Multiple failed login attempts followed by a successful login from same entity.",
    };
  }

  return { triggered: false };
}

module.exports = {
  detectSimpleCorrelation,
};