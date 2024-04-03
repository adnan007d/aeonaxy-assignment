import type { NextFunction, Request, Response } from "express";
import db from "@/db/drizzle";
import { APIError } from "@/util/util";
import { verifyToken } from "@/util/util";
import { users } from "@/db/schema";
import type { IUser } from "@/util/validations";
import { eq } from "drizzle-orm";
import logger from "@/util/logger";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // Check for token in headers
  const token = req.headers.authorization?.split(" ")?.[1];

  if (!token) {
    logger.error(token, "No token Provided");
    return next(new APIError(401, "Unauthorized"));
  }

  try {
    // verify token
    const payload = verifyToken(token);

    if (typeof payload === "string" || !payload.id) {
      logger.error(payload, "Payload is not correct");
      return next(new APIError(401, "Unauthorized"));
    }

    // check for user
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id));

    if (!result?.[0]) {
      logger.error(result[0], "User not found");
      return next(new APIError(401, "Unauthorized"));
    }

    // set user
    req.user = result[0];

    return next();
  } catch (error) {
    return next(new APIError(401, "Unauthorized"));
  }
}
