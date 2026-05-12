const logger = require("../utils/logger");

function notFoundHandler(request, response) {
  response.status(404).json({ error: "Route not found." });
}

function errorHandler(error, request, response, next) {
  const status = error.status || 500;
  const message = error.expose ? error.message : "Internal server error.";

  logger.error({
    message: error.message,
    stack: error.stack,
    path: request.path,
    method: request.method,
    status,
  });

  response.status(status).json({ error: message });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};