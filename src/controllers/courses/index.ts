// Get all courses
import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { courseFilterSchema, paginateSchema } from "@/util/validations";
import { eq, ilike, count, and } from "drizzle-orm";

// GET /api/v1/courses
// GET /api/v1/admin/courses
export async function getAllCourses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageQuery = paginateSchema.parse(req.query);
    const filters = courseFilterSchema.parse(req.query);

    let publihedCourses: boolean | undefined = true;

    if (req.user?.role === "ADMIN") {
      publihedCourses = filters.published ?? undefined;
    }

    const whereOptions = and(
      filters.name ? ilike(courses.name, `%${filters.name}%`) : undefined,
      filters.category
        ? ilike(courses.category, `%${filters.category}%`)
        : undefined,
      filters.price ? eq(courses.price, filters.price) : undefined,
      filters.duration ? eq(courses.duration, filters.duration) : undefined,

      // Only show published courses to non-admin users
      // And admin can see all courses with filter
      publihedCourses !== undefined
        ? eq(courses.published, publihedCourses)
        : undefined
    );

    const countResult = await db
      .select({ count: count() })
      .from(courses)
      .where(whereOptions);

    const result = await db
      .select()
      .from(courses)
      .limit(pageQuery.limit)
      .offset(pageQuery.limit * (pageQuery.page - 1))
      .where(whereOptions);

    return res.json({ total: countResult?.[0]?.count, courses: result });
  } catch (error) {
    return next(error);
  }
}
