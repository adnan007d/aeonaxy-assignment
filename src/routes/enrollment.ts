import { Router } from "express";
import { enrollSchema } from "@/util/validations";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import {
  enrollCourse,
  getUserEnrollmentById,
  getUserEnrollments,
  unenrollCourse,
} from "@/controllers/enrollments";

const enrollmentRouter = Router();

enrollmentRouter.use(authenticate);

enrollmentRouter.get("/", getUserEnrollments);
enrollmentRouter.post("/", validate(enrollSchema), enrollCourse);
enrollmentRouter.get("/:id", getUserEnrollmentById);
// eslint-disable-next-line drizzle/enforce-delete-with-where
enrollmentRouter.delete("/:id", unenrollCourse);

export default enrollmentRouter;
