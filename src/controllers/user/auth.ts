// Sign up
// Login

import { passwordRecovery, users } from "@/db/schema";
import type { IUser } from "@/util/validations";
import db from "@/db/drizzle";
import type { NextFunction, Request, Response } from "express";
import {
  PASSWORD_RESET_EXPIRY_IN_MINS,
  comparePassword,
  generateToken,
  hashPassword,
  waitFor1_2Seconds,
} from "@/util/util";
import { and, eq, gt } from "drizzle-orm";
import { APIError } from "@/util/util";
import { NeonDbError } from "@neondatabase/serverless";
import { sendMail } from "@/util/resend";
import { randomUUID } from "crypto";

// POST /api/v1/auth/signup
export async function signup(req: Request, res: Response, next: NextFunction) {
  const body: IUser = req.body;

  try {
    body.password = await hashPassword(body.password);

    const result = await db
      .insert(users)
      .values(body)
      .returning({ id: users.id });

    await sendMail({
      to: body.email,
      subject: "Welcome to E-Learning",
      // Can write more complex HTML here
      html: "<h1>Your account has been created</h1>",
    });

    return res.status(201).json({ id: result[0]?.id });
  } catch (error) {
    if (error instanceof NeonDbError && error.code === "23505") {
      return next(new APIError(400, "User already exists"));
    }
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

// POST /api/v1/auth/password/forgot
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email = req.body.email;

  try {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (!result[0]) {
      // Note: To prevent timing attack
      // To prevent user enumeration
      await waitFor1_2Seconds();
      return res.json({
        message: "If user exists you will recieve a reset email",
      });
    }

    const token = randomUUID();
    const recoveryResult = await db.insert(passwordRecovery).values({
      user_id: result[0].id,
      token,
    });

    if (recoveryResult.rowCount === 0) {
      return next(
        new APIError(500, "Cannot reset password now, please try again later")
      );
    }

    await sendMail({
      to: email,
      subject: "Password Reset",
      html: `<strong>/api/v1/password/reset/${token}</strong> For Password Reset<br /> <small valid for ${PASSWORD_RESET_EXPIRY_IN_MINS} mins`,
    });

    return res.json({
      message: "If user exists you will recieve a reset email",
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/v1/auth/password/reset/:token
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.params.token;

  if (!token || typeof token !== "string") {
    return next(new APIError(400, "Invalid token"));
  }

  const body = req.body;
  try {
    const validTill = new Date(
      Date.now() - PASSWORD_RESET_EXPIRY_IN_MINS * 60 * 1000
    );

    const result = await db
      .select({ user_id: passwordRecovery.user_id })
      .from(passwordRecovery)
      .where(
        and(
          eq(passwordRecovery.token, token),
          gt(passwordRecovery.created_at, validTill)
        )
      );

    if (!result[0]) {
      return next(new APIError(400, "Invalid token"));
    }
    const hashedPassword = await hashPassword(body.password);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, result[0].user_id));
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
}
