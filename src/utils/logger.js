import { createLogger, format, transports } from "winston";

const loggerTransports = [new transports.File({ filename: "logs/app.log" })];
console.log("NODE_ENV is", process.env.NODE_ENV);
// Only log to console if NOT in production
if (process.env.NODE_ENV !== "production") {
  loggerTransports.push(new transports.Console());
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: loggerTransports,
});

export default logger;
