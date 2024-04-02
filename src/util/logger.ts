import PinoHttp from "pino-http";
import pino from "pino";
import { env } from "@/env";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      destination:
        env.NODE_ENV === "development"
          ? 1 // STDOUT
          : env.LOG_FILE,
      translateTime: "SYS:standard",
      colorize: env.NODE_ENV === "development",
      ignore: "pid,hostname",
    },
  },
});

export const requestLogger = PinoHttp({
  transport: {
    target: "pino-http-print",
    options: {
      all: false,
      destination:
        env.NODE_ENV === "development"
          ? 1 // STDOUT
          : env.ACCESS_LOG_FILE,
      translateTime: "SYS:standard",
      colorize: env.NODE_ENV === "development",
      ignore: "pid,hostname",
    },
  },
});

export default logger;
