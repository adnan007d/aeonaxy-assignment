import { Router } from "express";
import { getUser } from "@/controllers/user";
import { authenticate } from "@/middleware/auth";

const userRouter = Router();
userRouter.use(authenticate);

userRouter.get("/me", getUser);

export default userRouter;
