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
import { RateLimit } from "@/util/util";

const authRouter = Router();

const reqPerMin3 = RateLimit({
  windowInMinutes: 1,
  maxRequests: 3,
});

authRouter.use(reqPerMin3);

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
