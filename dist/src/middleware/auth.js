"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = exports.authenticate = void 0;
const drizzle_1 = __importDefault(require("../db/drizzle"));
const util_1 = require("../util/util");
const util_2 = require("../util/util");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const logger_1 = __importDefault(require("../util/logger"));
async function authenticate(req, _res, next) {
    // Check for token in headers
    const token = req.headers.authorization?.split(" ")?.[1];
    if (!token) {
        logger_1.default.error(token, "No token Provided");
        return next(new util_1.APIError(401, "Unauthorized"));
    }
    try {
        // verify token
        const payload = (0, util_2.verifyToken)(token);
        if (typeof payload === "string" || !payload.id) {
            logger_1.default.error(payload, "Payload is not correct");
            return next(new util_1.APIError(401, "Unauthorized"));
        }
        // check for user
        const result = await drizzle_1.default
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, payload.id));
        if (!result?.[0]) {
            logger_1.default.error(result[0], "User not found");
            return next(new util_1.APIError(401, "Unauthorized"));
        }
        // set user
        req.user = result[0];
        return next();
    }
    catch (error) {
        return next(new util_1.APIError(401, "Unauthorized"));
    }
}
exports.authenticate = authenticate;
function checkAdmin(req, _res, next) {
    if (req.user.role !== "ADMIN") {
        return next(new util_1.APIError(403, "Forbidden"));
    }
    return next();
}
exports.checkAdmin = checkAdmin;
