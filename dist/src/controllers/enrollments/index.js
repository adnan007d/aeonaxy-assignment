"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unenrollCourse = exports.enrollCourse = exports.getUserEnrollmentById = exports.getUserEnrollments = void 0;
const drizzle_1 = __importDefault(require("../../db/drizzle"));
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const validations_1 = require("../../util/validations");
const util_1 = require("../../util/util");
const serverless_1 = require("@neondatabase/serverless");
const resend_1 = require("../../util/resend");
// GET /api/v1/enrollments
// TODO: Handle what happen if the course is deleted or unpublished
async function getUserEnrollments(req, res, next) {
    try {
        const pageQuery = validations_1.paginateSchema.parse(req.query);
        const whereOptions = (0, drizzle_orm_1.eq)(schema_1.enrollments.user_id, req.user.id);
        const results = await drizzle_1.default
            .select()
            .from(schema_1.enrollments)
            .where((0, drizzle_orm_1.eq)(schema_1.enrollments.user_id, req.user.id))
            .limit(pageQuery.limit)
            .offset(pageQuery.limit * (pageQuery.page - 1));
        const countResult = await drizzle_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.enrollments)
            .where(whereOptions);
        return res.json({ total: countResult[0]?.count, enrollments: results });
    }
    catch (error) {
        return next(error);
    }
}
exports.getUserEnrollments = getUserEnrollments;
// GET /api/v1/enrollments/:id
// TODO: Handle what happen if the course is deleted or unpublished
async function getUserEnrollmentById(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new util_1.APIError(400, "Enrollment ID is required"));
    }
    try {
        const result = await drizzle_1.default
            .select()
            .from(schema_1.enrollments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.enrollments.user_id, req.user.id), (0, drizzle_orm_1.eq)(schema_1.enrollments.enrollment_id, id)));
        if (result.length === 0) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        return res.json({ result: result[0] });
    }
    catch (error) {
        return next(error);
    }
}
exports.getUserEnrollmentById = getUserEnrollmentById;
// POST /api/v1/enrollments
// TODO: Handle what happen if the course is deleted or unpublished
async function enrollCourse(req, res, next) {
    // Body will only contain course_id: Reason validate middleware
    const body = req.body;
    body.user_id = req.user.id;
    try {
        const result = await drizzle_1.default.insert(schema_1.enrollments).values(body).returning();
        if (!result[0]) {
            return next(new util_1.APIError(500, "Enrollment failed"));
        }
        // NOTE: Doing this only for email
        const course = await drizzle_1.default
            .select({ name: schema_1.courses.name })
            .from(schema_1.courses)
            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, result[0].course_id));
        await (0, resend_1.sendMail)({
            to: req.user.email,
            subject: "Enrollment Confirmation",
            html: `<h1>You have successfully enrolled for ${course[0]?.name} course</h1>`,
        });
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
exports.enrollCourse = enrollCourse;
// DELETE /api/v1/enrollments/:id
async function unenrollCourse(req, res, next) {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
        return next(new util_1.APIError(400, "Enrollment ID is required"));
    }
    try {
        const result = await drizzle_1.default
            .delete(schema_1.enrollments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.enrollments.user_id, req.user.id), (0, drizzle_orm_1.eq)(schema_1.enrollments.enrollment_id, id)));
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        return res.json({ message: "Enrollment deleted successfully" });
    }
    catch (error) {
        return next(error);
    }
}
exports.unenrollCourse = unenrollCourse;
