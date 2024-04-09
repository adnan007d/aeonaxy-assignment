import PinoHttp from "pino-http";
import pino from "pino";
import { env } from "@/env";


function getDestination(file: string) {
  if (env.NODE_ENV === "development" || env.VERCEL) {
    return 1; // STDOUT
  } else {
    return file;
  }
}

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      destination: getDestination(env.LOG_FILE),
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
      destination: getDestination(env.ACCESS_LOG_FILE),
      translateTime: "SYS:standard",
      colorize: env.NODE_ENV === "development",
      ignore: "pid,hostname",
    },
  },
});

export default logger;
