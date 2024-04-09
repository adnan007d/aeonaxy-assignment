"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.addCourse = void 0;
const drizzle_1 = __importDefault(require("../../db/drizzle"));
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const util_1 = require("../../util/util");
// POST /api/v1/admin/courses
async function addCourse(req, res, next) {
    try {
        const course = await drizzle_1.default.insert(schema_1.courses).values(req.body).returning();
        return res.json({ course });
    }
    catch (error) {
        return next(error);
    }
}
exports.addCourse = addCourse;
// PUT /api/v1/admin/courses/:id
async function updateCourse(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new Error("Course ID is required"));
    }
    const body = req.body;
    body.updated_at = new Date();
    try {
        const course = await drizzle_1.default
            .update(schema_1.courses)
            .set(body)
            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, id))
            .returning();
        if (course.length === 0) {
            return next(new util_1.APIError(404, "Course not found"));
        }
        return res.json({ course });
    }
    catch (error) {
        return next(error);
    }
}
exports.updateCourse = updateCourse;
// DELETE /api/v1/admin/courses/:id
async function deleteCourse(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new util_1.APIError(400, "Course ID is required"));
    }
    try {
        const result = await drizzle_1.default.delete(schema_1.courses).where((0, drizzle_orm_1.eq)(schema_1.courses.id, id));
        if (result.rowCount === 0) {
            return next(new util_1.APIError(404, "Course not found"));
        }
        return res.json({ message: "Course deleted successfully" });
    }
    catch (error) {
        return next(error);
    }
}
exports.deleteCourse = deleteCourse;
