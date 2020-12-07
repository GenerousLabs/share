import { join } from "path";
import winston from "winston";

const devTransports = [
  new winston.transports.Console({
    level: "devug",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({ filename: "debug.log", level: "debug" }),
];

const prodTransports = [
  new winston.transports.Console({
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: join(__dirname, "../data/error.log"),
    level: "error",
  }),
];

const options: winston.LoggerOptions = {
  transports:
    process.env.NODE_ENV === "production" ? prodTransports : devTransports,
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
