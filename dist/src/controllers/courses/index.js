"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = exports.getCourseById = exports.getAllCourses = void 0;
const drizzle_1 = __importDefault(require("../../db/drizzle"));
const schema_1 = require("../../db/schema");
const validations_1 = require("../../util/validations");
const drizzle_orm_1 = require("drizzle-orm");
const util_1 = require("../../util/util");
// GET /api/v1/courses
// GET /api/v1/admin/courses
async function getAllCourses(req, res, next) {
    try {
        const pageQuery = validations_1.paginateSchema.parse(req.query);
        const filters = validations_1.courseFilterSchema.parse(req.query);
        let publihedCourses = true;
        if (req.user?.role === "ADMIN") {
            publihedCourses = filters.published ?? undefined;
        }
        const whereOptions = (0, drizzle_orm_1.and)(filters.name ? (0, drizzle_orm_1.ilike)(schema_1.courses.name, `%${filters.name}%`) : undefined, filters.category
            ? (0, drizzle_orm_1.ilike)(schema_1.courses.category, `%${filters.category}%`)
            : undefined, filters.price ? (0, drizzle_orm_1.eq)(schema_1.courses.price, filters.price) : undefined, filters.duration ? (0, drizzle_orm_1.eq)(schema_1.courses.duration, filters.duration) : undefined, 
        // Only show published courses to non-admin users
        // And admin can see all courses with filter
        publihedCourses !== undefined
            ? (0, drizzle_orm_1.eq)(schema_1.courses.published, publihedCourses)
            : undefined);
        const countResult = await drizzle_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.courses)
            .where(whereOptions);
        const result = await drizzle_1.default
            .select()
            .from(schema_1.courses)
            .limit(pageQuery.limit)
            .offset(pageQuery.limit * (pageQuery.page - 1))
            .where(whereOptions);
        return res.json({ total: countResult?.[0]?.count, courses: result });
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllCourses = getAllCourses;
// GET /api/v1/courses/:id
async function getCourseById(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!id && isNaN(id)) {
            return next(new util_1.APIError(400, "Course ID is required"));
        }
        const { published: _, ...columnsWithoutPublish } = (0, drizzle_orm_1.getTableColumns)(schema_1.courses);
        console.log(columnsWithoutPublish);
        const course = await drizzle_1.default
            .select(columnsWithoutPublish)
            .from(schema_1.courses)
            .where((0, drizzle_orm_1.and)(
        // Only show published courses to non-admin users
        req.user?.role !== "ADMIN" ? (0, drizzle_orm_1.eq)(schema_1.courses.published, true) : undefined, (0, drizzle_orm_1.eq)(schema_1.courses.id, id)));
        if (course.length === 0) {
            return next(new util_1.APIError(404, "Course not found"));
        }
        return res.json({ course: course[0] });
    }
    catch (error) {
        return next(error);
    }
}
exports.getCourseById = getCourseById;
// Get all categories
// GET /api/v1/courses/categories
// GET /api/v1/admin/courses/categories
async function getAllCategories(_req, res, next) {
    try {
        // Get all distinct categories
        // and return only the category field
        const categories = (await drizzle_1.default.selectDistinct({ category: schema_1.courses.category }).from(schema_1.courses)).map((category) => category.category);
        return res.json({ categories });
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllCategories = getAllCategories;
