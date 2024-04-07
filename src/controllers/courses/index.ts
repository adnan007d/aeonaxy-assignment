// Get all courses
import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { courseFilterSchema, paginateSchema } from "@/util/validations";
import { eq, ilike, count, and, getTableColumns } from "drizzle-orm";
import { APIError } from "@/util/util";

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

// GET /api/v1/courses/:id
export async function getCourseById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (!id && isNaN(id)) {
      return next(new APIError(400, "Course ID is required"));
    }

    const { published: _, ...columnsWithoutPublish } = getTableColumns(courses);

    console.log(columnsWithoutPublish);

    const course = await db
      .select(columnsWithoutPublish)
      .from(courses)
      .where(
        and(
          // Only show published courses to non-admin users
          req.user?.role !== "ADMIN" ? eq(courses.published, true) : undefined,
          eq(courses.id, id)
        )
      );

    if (course.length === 0) {
      return next(new APIError(404, "Course not found"));
    }

    return res.json({ course: course[0] });
  } catch (error) {
    return next(error);
  }
}

// Get all categories
// GET /api/v1/courses/categories
// GET /api/v1/admin/courses/categories
export async function getAllCategories(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    // Get all distinct categories
    // and return only the category field
    const categories = (
      await db.selectDistinct({ category: courses.category }).from(courses)
    ).map((category) => category.category);

    return res.json({ categories });
  } catch (error) {
    return next(error);
  }
}
