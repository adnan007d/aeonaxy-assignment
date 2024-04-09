"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../middleware/auth");
const express_1 = require("express");
const user_1 = __importDefault(require("../../routes/admin/user"));
const course_1 = __importDefault(require("../../routes/admin/course"));
const enrollment_1 = __importDefault(require("../../routes/admin/enrollment"));
const adminRouter = (0, express_1.Router)();
adminRouter.use(auth_1.authenticate);
adminRouter.use(auth_1.checkAdmin);
adminRouter.use("/users", user_1.default);
adminRouter.use("/courses", course_1.default);
adminRouter.use("/enrollments", enrollment_1.default);
exports.default = adminRouter;
