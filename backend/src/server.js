const express = require("express");
const http = require("node:http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const env = require("./config/env");
const logger = require("./utils/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const logsRoutes = require("./routes/logs.routes");
const alertsRoutes = require("./routes/alerts.routes");
const incidentsRoutes = require("./routes/incidents.routes");
const rulesRoutes = require("./routes/rules.routes");
const aiRoutes = require("./routes/ai.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const collectorRoutes = require("./routes/collector.routes");

const logIngestionService = require("./services/logIngestion.service");
const alertEngineService = require("./services/alertEngine.service");
const aiAnalysisService = require("./services/aiAnalysis.service");
const syslogListenerService = require("./services/syslogListener.service");
const setupRealtimeSocket = require("./sockets/realtime.socket");

const app = express();
const server = http.createServer(app);
const allowedFrontendOrigins = Array.from(new Set([
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]));

const io = new Server(server, {
  cors: {
    origin: allowedFrontendOrigins,
    credentials: true,
  },
});

app.use(helmet());
app.use(cors({
  origin: allowedFrontendOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/", (request, response) => {
  response.redirect(env.FRONTEND_URL);
});

app.get("/health", (request, response) => {
  response.json({
    status: "ok",
    service: "siem-backend",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/rules", rulesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/collector", collectorRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  setupRealtimeSocket(io);

  await logIngestionService.start();
  await alertEngineService.start();
  await aiAnalysisService.start();
  syslogListenerService.start();

  server.listen(env.PORT, () => {
    logger.info({ message: `SIEM backend running on port ${env.PORT}` });
  });
}

start().catch((error) => {
  logger.error({ message: "Failed to start backend", error: error.message, stack: error.stack });
  process.exit(1);
});
