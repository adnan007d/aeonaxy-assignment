import { authenticate, checkAdmin } from "@/middleware/auth";
import { Router } from "express";
import adminUserRouter from "@/routes/admin/user";
import adminCoursesRouter from "@/routes/admin/course";
import adminEnrollmentsRouter from "@/routes/admin/enrollment";

const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(checkAdmin);

adminRouter.use("/users", adminUserRouter);
adminRouter.use("/courses", adminCoursesRouter);
adminRouter.use("/enrollments", adminEnrollmentsRouter);

export default adminRouter;
