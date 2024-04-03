// Get User

import type { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
  return res.json(req.user);
}
