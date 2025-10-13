// src/middleware/logger.js
import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

export default requestLogger;
