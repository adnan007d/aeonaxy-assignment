"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controllers/courses");
const courseRouter = (0, express_1.Router)();
courseRouter.get("/", courses_1.getAllCourses);
courseRouter.get("/categories", courses_1.getAllCategories);
courseRouter.get("/:id", courses_1.getCourseById);
exports.default = courseRouter;
