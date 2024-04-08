import type { Request, Response, NextFunction } from "express";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { paginateSchema, userFilterSchema } from "@/util/validations";
import { count, and, eq, ilike } from "drizzle-orm";
import { APIError } from "@/util/util";
import { NeonDbError } from "@neondatabase/serverless";

// GET /admin/users
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pageQuery = paginateSchema.parse(req.query);
    const filters = userFilterSchema.parse(req.query);

    const whereOptions = and(
      filters.email ? ilike(users.email, `%${filters.email}%`) : undefined,
      filters.name ? ilike(users.name, `%${filters.name}%`) : undefined,
      filters.role ? eq(users.role, filters.role) : undefined
    );

    const result = await db
      .select()
      .from(users)
      .limit(pageQuery.limit)
      .offset(pageQuery.limit * (pageQuery.page - 1))
      .where(whereOptions);

    const countResult = await db
      .select({ count: count() })
      .from(users)
      .where(whereOptions);

    return res.json({ users: result, count: countResult[0]?.count });
  } catch (error) {
    return next(error);
  }
}

// GET /admin/users/:id
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return next(new APIError(400, "Invalid user id"));
    }

    const result = await db.select().from(users).where(eq(users.id, id));

    if (result.length === 0) {
      return next(new APIError(404, "User not found"));
    }

    return res.json({ user: result[0] });
  } catch (error) {
    return next(error);
  }
}

// POST /admin/users
export async function addUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await db.insert(users).values(req.body).returning();
    return res.json({ user: result[0] });
  } catch (error) {
    if (error instanceof NeonDbError && error.code === "23505") {
      return next(new APIError(400, "User already exists"));
    }

    return next(error);
  }
}

// PUT /admin/users/:id
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return next(new APIError(400, "Invalid user id"));
    }

    const result = await db
      .update(users)
      .set(req.body)
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) {
      return next(new APIError(404, "User not found"));
    }

    return res.json({ user: result[0] });
  } catch (error) {
    if (error instanceof NeonDbError && error.code === "23505") {
      return next(new APIError(400, "User already exists"));
    }

    return next(error);
  }
}

// DELETE /admin/users/:id
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return next(new APIError(400, "Invalid user id"));
    }
    const result = await db.delete(users).where(eq(users.id, id))

    if (result.rowCount === 0) {
      return next(new APIError(404, "User not found"));
    }
    return res.json({ message: "User deleted" })
  } catch (error) {
    return next(error);
  }
}
