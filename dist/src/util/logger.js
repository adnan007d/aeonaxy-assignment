"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const pino_1 = __importDefault(require("pino"));
const env_1 = require("../env");
function getDestination(file) {
    if (env_1.env.NODE_ENV === "development" || env_1.env.VERCEL) {
        return 1; // STDOUT
    }
    else {
        return file;
    }
}
const logger = (0, pino_1.default)({
    transport: {
        target: "pino-pretty",
        options: {
            destination: getDestination(env_1.env.LOG_FILE),
            translateTime: "SYS:standard",
            colorize: env_1.env.NODE_ENV === "development",
            ignore: "pid,hostname",
        },
    },
});
exports.requestLogger = (0, pino_http_1.default)({
    transport: {
        target: "pino-http-print",
        options: {
            all: false,
            destination: getDestination(env_1.env.ACCESS_LOG_FILE),
            translateTime: "SYS:standard",
            colorize: env_1.env.NODE_ENV === "development",
            ignore: "pid,hostname",
        },
    },
});
exports.default = logger;
