import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { enrollments } from "@/db/schema";
import { enrollmentFilterSchema, paginateSchema } from "@/util/validations";
import { APIError } from "@/util/util";
import { and, eq } from "drizzle-orm";
import { NeonDbError } from "@neondatabase/serverless";

// GET /api/v1/admin/enrollments
export async function adminGetEnrollments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageQuery = paginateSchema.parse(req.query);
    const filters = enrollmentFilterSchema.parse(req.query);

    // NOTE: can populate and course and user here
    const results = await db
      .select()
      .from(enrollments)
      .limit(pageQuery.limit)
      .offset(pageQuery.limit * (pageQuery.page - 1))
      .where(
        and(
          filters.course_id
            ? eq(enrollments.course_id, filters.course_id)
            : undefined,
          filters.user_id ? eq(enrollments.user_id, filters.user_id) : undefined
        )
      );

    return res.json({ enrollments: results });
  } catch (error) {
    return next(error);
  }
}

// GET /api/v1/admin/enrollments/:id
export async function adminGetEnrollmentById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  if (!id && isNaN(id)) {
    return next(new APIError(400, "Enrollment ID is required"));
  }
  try {
    const result = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.enrollment_id, id));

    if (result.length === 0) {
      return next(new APIError(404, "Enrollment not found"));
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/v1/admin/enrollments/:id
export async function adminDeleteEnrollment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  if (!id && isNaN(id)) {
    return next(new APIError(400, "Enrollment ID is required"));
  }
  try {
    const result = await db
      .delete(enrollments)
      .where(eq(enrollments.enrollment_id, id));

    if (result.rowCount === 0) {
      return next(new APIError(404, "Enrollment not found"));
    }

    return res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    return next(error);
  }
}

// PUT /api/v1/admin/enrollments/:id
export async function adminUpdateEnrollment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  if (!id && isNaN(id)) {
    return next(new APIError(400, "Enrollment ID is required"));
  }

  req.body.updated_at = new Date();

  try {
    const result = await db
      .update(enrollments)
      .set(req.body)
      .where(eq(enrollments.enrollment_id, id))
      .returning();

    if (result.length === 0) {
      return next(new APIError(404, "Enrollment not found"));
    }

    return res.json({
      message: "Enrollment updated successfully",
      enrollment: result[0],
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/v1/admin/enrollments
export async function adminEnrollCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await db.insert(enrollments).values(req.body).returning();

    if (result.length === 0) {
      return next(new APIError(500, "Failed to create enrollment"));
    }

    return res.status(201).json({ enrollment: result[0] });
  } catch (error) {
    if (error instanceof NeonDbError) {
      if (error.code === "23503") {
        return next(new APIError(404, "Course not found"));
      } else if (error.code === "23505") {
        return next(new APIError(400, "User already enrolled in course"));
      } else {
        return next(error);
      }
    }
    return next(error);
  }
}
