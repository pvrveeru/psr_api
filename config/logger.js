const winston = require("winston");
const config = require("./config");
require("winston-daily-rotate-file");
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  transports: new winston.transports.DailyRotateFile({
    dirname: "logs/APILogs",
    level: config.env === "development" ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      enumerateErrorFormat(),
      config.env === "development"
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.splat(),
      winston.format.printf(
        ({ level, message, timestamp }) => `${level}: ${timestamp}: ${message}`
      )
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ["error"],
      }),
    ],
  }),
});

module.exports = logger;
