"use strict";
// APIError class
// errorHanlder
// ---- Auth ----
// generateToken
// verifyToken
// hashPassword
// comparePassword
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor1_2Seconds = exports.PASSWORD_RESET_EXPIRY_IN_MINS = exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateToken = exports.errorHandler = exports.APIError = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const bcrypt_1 = __importDefault(require("bcrypt"));
class APIError extends Error {
    status;
    zodError;
    constructor(status, message, zodError) {
        super(message ?? "An error occurred");
        this.status = status;
        this.zodError = zodError;
    }
}
exports.APIError = APIError;
function errorHandler(err, _req, res, _next) {
    logger_1.default.error(err);
    if (err instanceof APIError) {
        return (res
            .status(err.status)
            // if zodError doesn't exist it will result in undefined and not get passed to the client
            .json({ message: err.message, zodError: err.zodError ?? undefined }));
    }
    return res.status(500).send("Internal Server Error");
}
exports.errorHandler = errorHandler;
const SALT_ROUNDS = 10;
function generateToken(payload, options) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, options);
}
exports.generateToken = generateToken;
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
}
exports.verifyToken = verifyToken;
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
exports.hashPassword = hashPassword;
async function comparePassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
exports.comparePassword = comparePassword;
exports.PASSWORD_RESET_EXPIRY_IN_MINS = 5;
async function waitFor1_2Seconds() {
    const seconds = Math.floor(Math.random() * 2) + 1 * 1000;
    return new Promise((resolve) => setTimeout(resolve, seconds));
}
exports.waitFor1_2Seconds = waitFor1_2Seconds;
