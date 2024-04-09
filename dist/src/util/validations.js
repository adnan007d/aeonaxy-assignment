"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.enrollmentFilterSchema = exports.enrollSchema = exports.insertEnrollmentSchema = exports.courseFilterSchema = exports.paginateSchema = exports.insertCourseSchema = exports.userFilterSchema = exports.loginUserSchema = exports.insertUserSchema = exports.insertUserAdminSchema = void 0;
const zod_1 = require("zod");
const drizzle_zod_1 = require("drizzle-zod");
const schema_1 = require("../db/schema");
exports.insertUserAdminSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.users, {
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters")
        .refine((password) => {
        // Change to a custom and efficient util function
        return (/[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password));
    }, "Password must contain at least one uppercase, one lowercase, and one number"),
}).omit({
    id: true,
    created_at: true,
    updated_at: true,
});
exports.insertUserSchema = exports.insertUserAdminSchema.omit({
    role: true,
});
exports.loginUserSchema = exports.insertUserSchema.pick({
    email: true,
    password: true,
});
exports.userFilterSchema = zod_1.z.object({
    email: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    role: (0, drizzle_zod_1.createInsertSchema)(schema_1.users).shape.role.optional().catch(undefined),
});
exports.insertCourseSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.courses).omit({
    created_at: true,
    updated_at: true,
    id: true,
});
// default page 1
// default limit 12
exports.paginateSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1).catch(1),
    limit: zod_1.z.coerce.number().int().positive().max(12).default(12).catch(12),
});
exports.courseFilterSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    price: zod_1.z.coerce.number().optional(),
    duration: zod_1.z.coerce.number().optional(),
    published: zod_1.z.coerce.boolean().optional(),
});
exports.insertEnrollmentSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.enrollments).omit({
    created_at: true,
    updated_at: true,
    enrollment_id: true,
});
exports.enrollSchema = exports.insertEnrollmentSchema.pick({
    course_id: true,
});
exports.enrollmentFilterSchema = zod_1.z.object({
    course_id: zod_1.z.coerce.number().optional(),
    user_id: zod_1.z.coerce.number().optional(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
});
exports.resetPasswordSchema = zod_1.z.object({
    password: exports.insertUserAdminSchema.shape.password,
});
