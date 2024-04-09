"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../routes/auth"));
const user_1 = __importDefault(require("../routes/user"));
const admin_1 = __importDefault(require("../routes/admin"));
const course_1 = __importDefault(require("../routes/course"));
const enrollment_1 = __importDefault(require("../routes/enrollment"));
const v1Router = (0, express_1.Router)();
v1Router.use("/auth", auth_1.default);
v1Router.use("/user", user_1.default);
v1Router.use("/admin", admin_1.default);
v1Router.use("/courses", course_1.default);
v1Router.use("/enrollments", enrollment_1.default);
exports.default = v1Router;
