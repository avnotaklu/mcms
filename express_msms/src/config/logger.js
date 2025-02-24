const winston = require("winston");

const logFormat = winston.format.printf(function (info) {
  return `${new Date().toLocaleDateString()}:${new Date().toLocaleTimeString()}  [${info.level}]: ${info.message}\n`;
});

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
