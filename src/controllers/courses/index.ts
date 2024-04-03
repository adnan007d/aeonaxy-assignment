// Get all courses
import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { courseFilterSchema, paginateSchema } from "@/util/validations";
import { eq, ilike, count } from "drizzle-orm";

export async function getAllCourses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageQuery = paginateSchema.parse(req.query);
    const filters = courseFilterSchema.parse(req.query);

    const countQuery = db.select({ count: count() }).from(courses);

    const query = db
      .select()
      .from(courses)
      .limit(pageQuery.limit)
      .offset(pageQuery.limit * (pageQuery.page - 1));

    // Is there a better way to do this?
    if (filters.name) {
      const name = ilike(courses.name, `%${filters.name}%`);
      query.where(name);
      countQuery.where(name);
    }
    if (filters.category) {
      const category = ilike(courses.category, `%${filters.category}%`);
      query.where(category);
      countQuery.where(category);
    }
    if (filters.price) {
      const price = eq(courses.price, filters.price);
      query.where(price);
      countQuery.where(price);
    }
    if (filters.duration) {
      const duration = eq(courses.duration, filters.duration);
      query.where(duration);
      countQuery.where(duration);
    }

    const result = await query;
    const countResult = await countQuery;

    return res.json({ courses: result, total: countResult?.[0]?.count });
  } catch (error) {
    return next(error);
  }
}
