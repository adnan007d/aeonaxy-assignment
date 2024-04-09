"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validations_1 = require("../util/validations");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const enrollments_1 = require("../controllers/enrollments");
const enrollmentRouter = (0, express_1.Router)();
enrollmentRouter.use(auth_1.authenticate);
enrollmentRouter.get("/", enrollments_1.getUserEnrollments);
enrollmentRouter.post("/", (0, validate_1.validate)(validations_1.enrollSchema), enrollments_1.enrollCourse);
enrollmentRouter.get("/:id", enrollments_1.getUserEnrollmentById);
// eslint-disable-next-line drizzle/enforce-delete-with-where
enrollmentRouter.delete("/:id", enrollments_1.unenrollCourse);
exports.default = enrollmentRouter;
