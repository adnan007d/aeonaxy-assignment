"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminEnrollCourse = exports.adminUpdateEnrollment = exports.adminDeleteEnrollment = exports.adminGetEnrollmentById = exports.adminGetEnrollments = void 0;
const drizzle_1 = __importDefault(require("../../db/drizzle"));
const schema_1 = require("../../db/schema");
const validations_1 = require("../../util/validations");
const util_1 = require("../../util/util");
const drizzle_orm_1 = require("drizzle-orm");
const serverless_1 = require("@neondatabase/serverless");
// GET /api/v1/admin/enrollments
async function adminGetEnrollments(req, res, next) {
    try {
        const pageQuery = validations_1.paginateSchema.parse(req.query);
        const filters = validations_1.enrollmentFilterSchema.parse(req.query);
        // NOTE: can populate and course and user here
        const results = await drizzle_1.default
            .select()
            .from(schema_1.enrollments)
            .limit(pageQuery.limit)
            .offset(pageQuery.limit * (pageQuery.page - 1))
            .where((0, drizzle_orm_1.and)(filters.course_id
            ? (0, drizzle_orm_1.eq)(schema_1.enrollments.course_id, filters.course_id)
            : undefined, filters.user_id ? (0, drizzle_orm_1.eq)(schema_1.enrollments.user_id, filters.user_id) : undefined));
        return res.json({ enrollments: results });
    }
    catch (error) {
        return next(error);
    }
}
exports.adminGetEnrollments = adminGetEnrollments;
// GET /api/v1/admin/enrollments/:id
async function adminGetEnrollmentById(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new util_1.APIError(400, "Enrollment ID is required"));
    }
    try {
        const result = await drizzle_1.default
            .select()
            .from(schema_1.enrollments)
            .where((0, drizzle_orm_1.eq)(schema_1.enrollments.enrollment_id, id));
        if (result.length === 0) {
            return next(new util_1.APIError(404, "Enrollment not found"));
        }
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
exports.adminGetEnrollmentById = adminGetEnrollmentById;
// DELETE /api/v1/admin/enrollments/:id
async function adminDeleteEnrollment(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new util_1.APIError(400, "Enrollment ID is required"));
    }
    try {
        const result = await drizzle_1.default
            .delete(schema_1.enrollments)
            .where((0, drizzle_orm_1.eq)(schema_1.enrollments.enrollment_id, id));
        if (result.rowCount === 0) {
            return next(new util_1.APIError(404, "Enrollment not found"));
        }
        return res.json({ message: "Enrollment deleted successfully" });
    }
    catch (error) {
        return next(error);
    }
}
exports.adminDeleteEnrollment = adminDeleteEnrollment;
// PUT /api/v1/admin/enrollments/:id
async function adminUpdateEnrollment(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new util_1.APIError(400, "Enrollment ID is required"));
    }
    req.body.updated_at = new Date();
    try {
        const result = await drizzle_1.default
            .update(schema_1.enrollments)
            .set(req.body)
            .where((0, drizzle_orm_1.eq)(schema_1.enrollments.enrollment_id, id))
            .returning();
        if (result.length === 0) {
            return next(new util_1.APIError(404, "Enrollment not found"));
        }
        return res.json({
            message: "Enrollment updated successfully",
            enrollment: result[0],
        });
    }
    catch (error) {
        return next(error);
    }
}
exports.adminUpdateEnrollment = adminUpdateEnrollment;
// POST /api/v1/admin/enrollments
async function adminEnrollCourse(req, res, next) {
    try {
        const result = await drizzle_1.default.insert(schema_1.enrollments).values(req.body).returning();
        if (result.length === 0) {
            return next(new util_1.APIError(500, "Failed to create enrollment"));
        }
        return res.status(201).json({ enrollment: result[0] });
    }
    catch (error) {
        if (error instanceof serverless_1.NeonDbError) {
            if (error.code === "23503") {
                return next(new util_1.APIError(404, "Course not found"));
            }
            else if (error.code === "23505") {
                return next(new util_1.APIError(400, "User already enrolled in course"));
            }
            else {
                return next(error);
            }
        }
        return next(error);
    }
}
exports.adminEnrollCourse = adminEnrollCourse;
