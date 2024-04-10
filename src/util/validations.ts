import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";
import { courses, enrollments, users } from "@/db/schema";
import { type InferInsertModel } from "drizzle-orm";

export const insertUserAdminSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
      "Password must contain at least one uppercase, one lowercase, and one number"
    ),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertUserSchema = insertUserAdminSchema.omit({
  role: true,
});

export const loginUserSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

export type IUser = InferInsertModel<typeof users>;

export const userFilterSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  role: createInsertSchema(users).shape.role.optional().catch(undefined),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  created_at: true,
  updated_at: true,
  id: true,
});

// default page 1
// default limit 12
export const paginateSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().max(12).default(12).catch(12),
});

export const courseFilterSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  price: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
  published: z.coerce.boolean().optional(),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  created_at: true,
  updated_at: true,
  enrollment_id: true,
});

export const enrollSchema = insertEnrollmentSchema.pick({
  course_id: true,
});

export const enrollmentFilterSchema = z.object({
  course_id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  password: insertUserAdminSchema.shape.password,
});
