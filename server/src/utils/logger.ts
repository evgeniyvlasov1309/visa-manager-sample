import fs from "fs";
import winston from "winston";

const logDir = "logs";

// Delete log files at startup
fs.readdirSync(logDir).forEach((file) => {
  if (file.endsWith(".log")) {
    fs.unlinkSync(`${logDir}/${file}`);
  }
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      let logMessage = `${timestamp} [${level.toUpperCase()}] - ${message}`;
      if (stack) {
        logMessage += `\n${stack}`;
      }
      return logMessage;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: `${logDir}/info.log`,
      maxsize: 1024 * 1024 * 10,
      maxFiles: 10,
      tailable: true,
    }),
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: "error",
      maxsize: 1024 * 1024 * 10,
      maxFiles: 10,
      tailable: true,
    }),
  ],
});
