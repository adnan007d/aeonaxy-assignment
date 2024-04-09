"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/user/auth");
const validations_1 = require("../util/validations");
const validate_1 = require("../middleware/validate");
const authRouter = (0, express_1.Router)();
// Auth Login/Register user
authRouter.post("/login", (0, validate_1.validate)(validations_1.loginUserSchema), auth_1.login);
authRouter.post("/signup", (0, validate_1.validate)(validations_1.insertUserSchema), auth_1.signup);
authRouter.post("/password/forgot", (0, validate_1.validate)(validations_1.forgotPasswordSchema), auth_1.forgotPassword);
authRouter.post("/password/reset/:token", (0, validate_1.validate)(validations_1.resetPasswordSchema), auth_1.resetPassword);
exports.default = authRouter;
