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
import { RateLimit } from "@/util/util";

const enrollmentRouter = Router();

enrollmentRouter.use(authenticate);

const reqPerMin3 = RateLimit({
  windowInMinutes: 1,
  maxRequests: 3,
});

enrollmentRouter.get("/", getUserEnrollments);
enrollmentRouter.post("/", reqPerMin3, validate(enrollSchema), enrollCourse);
enrollmentRouter.get("/:id", getUserEnrollmentById);
// eslint-disable-next-line drizzle/enforce-delete-with-where
enrollmentRouter.delete("/:id", unenrollCourse);

export default enrollmentRouter;
