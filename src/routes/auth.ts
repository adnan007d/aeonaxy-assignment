import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from "@/controllers/user/auth";

import {
  forgotPasswordSchema,
  insertUserSchema,
  loginUserSchema,
  resetPasswordSchema,
} from "@/util/validations";
import { validate } from "@/middleware/validate";

const authRouter = Router();

// Auth Login/Register user
authRouter.post("/login", validate(loginUserSchema), login);
authRouter.post("/signup", validate(insertUserSchema), signup);
authRouter.post(
  "/password/forgot",
  validate(forgotPasswordSchema),
  forgotPassword
);
authRouter.post(
  "/password/reset/:token",
  validate(resetPasswordSchema),
  resetPassword
);

export default authRouter;
