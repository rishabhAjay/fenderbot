import winston, { format } from "winston";
import "winston-daily-rotate-file";
import { env } from "../env";

const volume = format.printf((info) => {
  const d = new Date();
  const seqWinstonLevelMapper: { [key: string]: string } = {
    info: "Information",
    error: "Error",
    warn: "Warning",
    debug: "Debug",
  };
  return JSON.stringify({
    "@t": d,
    "@m": info.message,
    "@l": seqWinstonLevelMapper[info.level],
    "@x": info.stack,
  });
});

const logger = winston.createLogger({
  format: format.combine(
    volume,
    format.splat(),
    format.errors({ stack: true })
  ), // <-- use errors format),
  defaultMeta: {
    application: env.BOT_NAME,
  },
  transports: [
    new winston.transports.Console({}),
    new winston.transports.DailyRotateFile({
      level: "info",
      filename: "logs/info-%DATE%.clef",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30",
    }),
    new winston.transports.DailyRotateFile({
      level: "warn",
      filename: "logs/warn-%DATE%.clef",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30",
    }),
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: "logs/error-%DATE%.clef",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30",
    }),
  ],
});

export default logger;
