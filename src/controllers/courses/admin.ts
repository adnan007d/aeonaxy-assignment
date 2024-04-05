import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";

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
