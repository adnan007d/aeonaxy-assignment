// Get all courses
import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { courseFilterSchema, paginateSchema } from "@/util/validations";
import { eq, ilike, count, and, type SQLWrapper } from "drizzle-orm";

export async function getAllCourses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageQuery = paginateSchema.parse(req.query);
    const filters = courseFilterSchema.parse(req.query);

    const whereOptions: (SQLWrapper | undefined)[] = [];

    // Only show published courses to non-admins
    if (req.user?.role !== "ADMIN") {
      whereOptions.push(eq(courses.published, true));
    }

    // Is there a better way to do this?
    if (filters.name) {
      whereOptions.push(ilike(courses.name, `%${filters.name}%`));
    }
    if (filters.category) {
      whereOptions.push(ilike(courses.category, `%${filters.category}%`));
    }
    if (filters.price) {
      whereOptions.push(eq(courses.price, filters.price));
    }
    if (filters.duration) {
      whereOptions.push(eq(courses.duration, filters.duration));
    }

    const countResult = await db
      .select({ count: count() })
      .from(courses)
      .where(and(...whereOptions));

    const result = await db
      .select()
      .from(courses)
      .limit(pageQuery.limit)
      .offset(pageQuery.limit * (pageQuery.page - 1))
      .where(and(...whereOptions));

    return res.json({ total: countResult?.[0]?.count, courses: result })
  } catch (error) {
    return next(error);
  }
}
