// APIError class
// errorHanlder
// ---- Auth ----
// generateToken
// verifyToken
// hashPassword
// comparePassword

import type { Request, Response, NextFunction } from "express";
import type { ZodIssue } from "zod";
import logger from "@/util/logger";
import { NeonDbError } from "@neondatabase/serverless";

import jwt from "jsonwebtoken";
import { env } from "@/env";
import bcrypt from "bcrypt";

export class APIError extends Error {
  public zodError?: ZodIssue[];
  constructor(
    public status: number,
    message?: string,
    zodError?: ZodIssue[]
  ) {
    super(message ?? "An error occurred");
    this.zodError = zodError;
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err);

  if (err instanceof APIError) {
    return (
      res
        .status(err.status)
        // if zodError doesn't exist it will result in undefined and not get passed to the client
        .json({ message: err.message, zodError: err.zodError ?? undefined })
    );
  }

  return res.status(500).send("Internal Server Error");
}

const SALT_ROUNDS = 10;

export function generateToken(
  payload: string | object | Buffer,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
