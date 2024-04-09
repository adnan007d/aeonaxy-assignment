"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const util_1 = require("../util/util");
/**
 * Middleware to validate request body
 * @description
 * Changes `req.body` to the validated body if validation is successful
 */
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (result.success) {
            req.body = result.data;
        }
        else {
            return next(new util_1.APIError(400, "Validation error", result.error.errors));
        }
        return next();
    };
}
exports.validate = validate;
