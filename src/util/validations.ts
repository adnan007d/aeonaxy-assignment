import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";
import { courses, users } from "@/db/schema";
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .refine((password) => {
      // Change to a custom and efficient util function
      return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
      );
    }, "Password must contain at least one uppercase, one lowercase, and one number"),
});

export const loginUserSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

export type IUser = z.infer<typeof insertUserSchema>;

export const insertCourseSchema = createInsertSchema(courses);
