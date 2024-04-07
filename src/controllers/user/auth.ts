// Sign up
// Login

import { users } from "@/db/schema";
import type { IUser } from "@/util/validations";
import db from "@/db/drizzle";
import type { NextFunction, Request, Response } from "express";
import { comparePassword, generateToken, hashPassword } from "@/util/util";
import { eq } from "drizzle-orm";
import { APIError } from "@/util/util";


// POST /api/v1/auth/signup
export async function signup(req: Request, res: Response, next: NextFunction) {
  const body: IUser = req.body;

  try {
    body.password = await hashPassword(body.password);

    const result = await db
      .insert(users)
      .values(body)
      .returning({ id: users.id });

    return res.status(201).json({ id: result[0]?.id });
  } catch (error) {
    return next(error);
  }
}

// POST /api/v1/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  const body: Pick<IUser, "email" | "password"> = req.body;

  try {
    // Check if user exists
    const result = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, body.email));

    // Check if password matches
    const user = result[0];

    if (result.length === 0 || !user) {
      return next(new APIError(401, "Invalid email or password"));
    }

    const isMatch = await comparePassword(body.password, user.password);

    if (!isMatch) {
      return next(new APIError(401, "Invalid email or password"));
    }

    // Return JWT token
    const token = generateToken({ id: user.id });

    return res.json({ token });
  } catch (error) {
    return next(error);
  }
}
