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

import jwt from "jsonwebtoken";
import { env } from "@/env";
import bcrypt from "bcrypt";
import { rateLimit } from "express-rate-limit";

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

export const PASSWORD_RESET_EXPIRY_IN_MINS = 5;

export async function waitFor1_2Seconds() {
  const seconds = Math.floor(Math.random() * 2) + 1 * 1000;

  return new Promise((resolve) => setTimeout(resolve, seconds));
}

type RateLimitOptions = {
  windowInMinutes: number;
  maxRequests: number;
};

export function RateLimit({ windowInMinutes, maxRequests }: RateLimitOptions) {
  return rateLimit({
    windowMs: windowInMinutes * 60 * 1000,
    limit: maxRequests,
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (_req, res, _next, options) => {
      res.status(429).json({
        message: options.message,
      });
    },
  });
}
