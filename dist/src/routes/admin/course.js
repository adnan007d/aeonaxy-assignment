"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../../controllers/courses/admin");
const courses_1 = require("../../controllers/courses");
const validate_1 = require("../../middleware/validate");
const validations_1 = require("../../util/validations");
const adminCoursesRouter = (0, express_1.Router)();
// Same as user one but with also return if course is published or not
adminCoursesRouter.get("/", courses_1.getAllCourses);
adminCoursesRouter.post("/", (0, validate_1.validate)(validations_1.insertCourseSchema), admin_1.addCourse);
adminCoursesRouter.put("/:id", (0, validate_1.validate)(validations_1.insertCourseSchema), admin_1.updateCourse);
// Same as user added for consistency
adminCoursesRouter.get("/categories", courses_1.getAllCategories);
// eslint-disable-next-line drizzle/enforce-delete-with-where
adminCoursesRouter.delete("/:id", admin_1.deleteCourse);
// Same as user one but with also return if course is published or not
adminCoursesRouter.get("/:id", courses_1.getCourseById);
exports.default = adminCoursesRouter;
