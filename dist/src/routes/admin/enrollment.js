"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../../controllers/enrollments/admin");
const validations_1 = require("../../util/validations");
const validate_1 = require("../../middleware/validate");
const adminEnrollmentsRouter = (0, express_1.Router)();
adminEnrollmentsRouter.get("/", admin_1.adminGetEnrollments);
adminEnrollmentsRouter.post("/", (0, validate_1.validate)(validations_1.insertEnrollmentSchema), admin_1.adminEnrollCourse);
adminEnrollmentsRouter.put("/:id", (0, validate_1.validate)(validations_1.insertEnrollmentSchema), admin_1.adminUpdateEnrollment);
adminEnrollmentsRouter.get("/:id", admin_1.adminGetEnrollmentById);
// eslint-disable-next-line drizzle/enforce-delete-with-where
adminEnrollmentsRouter.delete("/:id", admin_1.adminDeleteEnrollment);
exports.default = adminEnrollmentsRouter;
