// src/utils/morganLogger.js
import logger from "./logger.js";

const stream = {
  write: (message) => {
    logger.http(message.trim()); // Use .http() or .info()
  },
};

export default stream;
