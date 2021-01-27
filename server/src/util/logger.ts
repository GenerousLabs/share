import winston from "winston";

const devTransports = [
  new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: "data/debug.log",
    level: "debug",
  }),
];

const prodTransports = [
  new winston.transports.Console({
    level: "warn",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: "data/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "data/warn.log",
    level: "warn",
  }),
];

const options: winston.LoggerOptions = {
  transports:
    process.env.NODE_ENV === "production" ? prodTransports : devTransports,
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level #tKMPf1");
}

export default logger;
