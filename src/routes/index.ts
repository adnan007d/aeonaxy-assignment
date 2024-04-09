import { Router } from "express";
import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";
import adminRouter from "@/routes/admin";
import courseRouter from "@/routes/course";
import enrollmentRouter from "@/routes/enrollment";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/courses", courseRouter); 
v1Router.use("/enrollments", enrollmentRouter)

export default v1Router;
