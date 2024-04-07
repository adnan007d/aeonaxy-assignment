// User Enrollments
import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { enrollments } from "@/db/schema";
import { and, count, eq } from "drizzle-orm";
import { paginateSchema } from "@/util/validations";
import { APIError } from "@/util/util";
import { NeonDbError } from "@neondatabase/serverless";

// GET /api/v1/enrollments
// TODO: Handle what happen if the course is deleted or unpublished
export async function getUserEnrollments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageQuery = paginateSchema.parse(req.query);

    const whereOptions = eq(enrollments.user_id, req.user.id!);

    const results = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.user_id, req.user.id!))
      .limit(pageQuery.limit)
      .offset(pageQuery.limit * (pageQuery.page - 1));

    const countResult = await db
      .select({ count: count() })
      .from(enrollments)
      .where(whereOptions);

    return res.json({ total: countResult[0]?.count, enrollments: results });
  } catch (error) {
    return next(error);
  }
}

// GET /api/v1/enrollments/:id
// TODO: Handle what happen if the course is deleted or unpublished
export async function getUserEnrollmentById(
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
      .where(
        and(
          eq(enrollments.user_id, req.user.id!),
          eq(enrollments.enrollment_id, id)
        )
      );

    if (result.length === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    return res.json({ result: result[0] });
  } catch (error) {
    return next(error);
  }
}

// POST /api/v1/enrollments
// TODO: Handle what happen if the course is deleted or unpublished
export async function enrollCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Body will only contain course_id: Reason validate middleware
  const body = req.body;

  body.user_id = req.user.id;

  try {
    const result = await db.insert(enrollments).values(body).returning();
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

// DELETE /api/v1/enrollments/:id
export async function unenrollCourse(
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
      .where(
        and(
          eq(enrollments.user_id, req.user.id!),
          eq(enrollments.enrollment_id, id)
        )
      );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    return res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    return next(error);
  }
}
