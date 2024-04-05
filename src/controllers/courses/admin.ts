import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const course = await db.insert(courses).values(req.body).returning();
    return res.json({ course });
  } catch (error) {
    return next(error);
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  if (!id && !isNaN(id)) {
    return next(new Error("Course ID is required"));
  }

  const body = req.body;

  body.updated_at = new Date();

  try {
    const course = await db
      .update(courses)
      .set(body)
      .where(eq(courses.id, id))
      .returning();
    return res.json({ course });
  } catch (error) {
    return next(error);
  }
}
