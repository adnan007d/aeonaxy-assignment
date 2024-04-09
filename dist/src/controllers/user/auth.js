"use strict";
// Sign up
// Login
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const schema_1 = require("../../db/schema");
const drizzle_1 = __importDefault(require("../../db/drizzle"));
const util_1 = require("../../util/util");
const drizzle_orm_1 = require("drizzle-orm");
const util_2 = require("../../util/util");
const serverless_1 = require("@neondatabase/serverless");
const resend_1 = require("../../util/resend");
const crypto_1 = require("crypto");
// POST /api/v1/auth/signup
async function signup(req, res, next) {
    const body = req.body;
    try {
        body.password = await (0, util_1.hashPassword)(body.password);
        const result = await drizzle_1.default
            .insert(schema_1.users)
            .values(body)
            .returning({ id: schema_1.users.id });
        await (0, resend_1.sendMail)({
            to: body.email,
            subject: "Welcome to E-Learning",
            // Can write more complex HTML here
            html: "<h1>Your account has been created</h1>",
        });
        return res.status(201).json({ id: result[0]?.id });
    }
    catch (error) {
        if (error instanceof serverless_1.NeonDbError && error.code === "23505") {
            return next(new util_2.APIError(400, "User already exists"));
        }
        return next(error);
    }
}
exports.signup = signup;
// POST /api/v1/auth/login
async function login(req, res, next) {
    const body = req.body;
    try {
        // Check if user exists
        const result = await drizzle_1.default
            .select({ id: schema_1.users.id, password: schema_1.users.password })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, body.email));
        // Check if password matches
        const user = result[0];
        if (result.length === 0 || !user) {
            return next(new util_2.APIError(401, "Invalid email or password"));
        }
        const isMatch = await (0, util_1.comparePassword)(body.password, user.password);
        if (!isMatch) {
            return next(new util_2.APIError(401, "Invalid email or password"));
        }
        // Return JWT token
        const token = (0, util_1.generateToken)({ id: user.id });
        return res.json({ token });
    }
    catch (error) {
        return next(error);
    }
}
exports.login = login;
// POST /api/v1/auth/password/forgot
async function forgotPassword(req, res, next) {
    const email = req.body.email;
    try {
        const result = await drizzle_1.default
            .select({ id: schema_1.users.id })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!result[0]) {
            // Note: To prevent timing attack
            // To prevent user enumeration
            await (0, util_1.waitFor1_2Seconds)();
            return res.json({
                message: "If user exists you will recieve a reset email",
            });
        }
        const token = (0, crypto_1.randomUUID)();
        const recoveryResult = await drizzle_1.default.insert(schema_1.passwordRecovery).values({
            user_id: result[0].id,
            token,
        });
        if (recoveryResult.rowCount === 0) {
            return next(new util_2.APIError(500, "Cannot reset password now, please try again later"));
        }
        await (0, resend_1.sendMail)({
            to: email,
            subject: "Password Reset",
            html: `<strong>/api/v1/password/reset/${token}</strong> For Password Reset<br /> <small valid for ${util_1.PASSWORD_RESET_EXPIRY_IN_MINS} mins`,
        });
        return res.json({
            message: "If user exists you will recieve a reset email",
        });
    }
    catch (error) {
        return next(error);
    }
}
exports.forgotPassword = forgotPassword;
// POST /api/v1/auth/password/reset/:token
async function resetPassword(req, res, next) {
    const token = req.params.token;
    if (!token || typeof token !== "string") {
        return next(new util_2.APIError(400, "Invalid token"));
    }
    const body = req.body;
    try {
        const validTill = new Date(Date.now() - util_1.PASSWORD_RESET_EXPIRY_IN_MINS * 60 * 1000);
        const result = await drizzle_1.default
            .select({ user_id: schema_1.passwordRecovery.user_id })
            .from(schema_1.passwordRecovery)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.passwordRecovery.token, token), (0, drizzle_orm_1.gt)(schema_1.passwordRecovery.created_at, validTill)));
        if (!result[0]) {
            return next(new util_2.APIError(400, "Invalid token"));
        }
        const hashedPassword = await (0, util_1.hashPassword)(body.password);
        await drizzle_1.default
            .update(schema_1.users)
            .set({ password: hashedPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, result[0].user_id));
        return res.json({ message: "Password reset successful" });
    }
    catch (error) {
        return next(error);
    }
}
exports.resetPassword = resetPassword;
