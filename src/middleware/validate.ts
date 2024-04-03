import { APIError } from "@/util/util";
import type { Request, Response, NextFunction } from "express";
import { type AnyZodObject } from "zod";

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
    } else {
      return next(new APIError(400, "Validation error", result.error.errors));
    }
    return next();
  };
}
