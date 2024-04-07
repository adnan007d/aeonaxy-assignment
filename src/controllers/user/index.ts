// Get User

import type { Request, Response } from "express";

// GET /api/v1/user/me
export function getUser(req: Request, res: Response) {
  return res.json(req.user);
}
