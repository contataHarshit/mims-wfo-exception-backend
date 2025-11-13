import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotateTransport = new DailyRotateFile({
  filename: "logs/%DATE%-app.log", // file name with date
  datePattern: "YYYY-MM-DD", // new file every day
  zippedArchive: true, // compress old logs (optional)
  maxSize: "20m", // max size per file
  maxFiles: "14d", // keep logs for 14 days
});

const loggerTransports = [dailyRotateTransport];

if (process.env.NODE_ENV !== "production") {
  loggerTransports.push(new transports.Console());
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
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
