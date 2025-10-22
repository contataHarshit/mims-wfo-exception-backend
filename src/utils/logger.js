import { createLogger, format, transports } from "winston";

const loggerTransports = [new transports.File({ filename: "logs/app.log" })];

if (process.env.NODE_ENV !== "production") {
  loggerTransports.push(new transports.Console());
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // to log stack trace if available
    format.metadata({ fillExcept: ["message", "level", "timestamp"] }), // keep all other properties in metadata
    format.printf(({ level, message, timestamp, metadata }) => {
      const metaString = Object.keys(metadata).length
        ? ` | metadata: ${JSON.stringify(metadata)}`
        : "";
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
    })
  ),
  transports: loggerTransports,
});

export default logger;
