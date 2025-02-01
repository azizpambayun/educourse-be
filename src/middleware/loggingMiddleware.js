const logger = require('../utils/logger');

const loggingMiddleware = (req, res, next) => {
  // Track the start time of the request
  const start = Date.now();

  // Log the incoming request
  logger.info(`Incoming Request ${req.method} ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
  });

  // Capture the response finish event
  res.on('finish', () => {
    // Calculate response duration
    const duration = Date.now() - start;
    logger.info(`Outgoing Response ${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  // Capture the response error event
  res.on('error', error => {
    logger.error(`Response Error: ${req.method} ${req.originalUrl}`, {
      error: error.message,
      stack: error.stack,
    });
  });

  next();
};

module.exports = loggingMiddleware;
