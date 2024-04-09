import { Router } from "express";
import {
  adminEnrollCourse,
  adminDeleteEnrollment,
  adminGetEnrollmentById,
  adminGetEnrollments,
  adminUpdateEnrollment,
} from "@/controllers/enrollments/admin";
import { insertEnrollmentSchema } from "@/util/validations";
import { validate } from "@/middleware/validate";

const adminEnrollmentsRouter = Router();

adminEnrollmentsRouter.get("/", adminGetEnrollments);
adminEnrollmentsRouter.post(
  "/",
  validate(insertEnrollmentSchema),
  adminEnrollCourse
);
adminEnrollmentsRouter.put(
  "/:id",
  validate(insertEnrollmentSchema),
  adminUpdateEnrollment
);
adminEnrollmentsRouter.get("/:id", adminGetEnrollmentById);
// eslint-disable-next-line drizzle/enforce-delete-with-where
adminEnrollmentsRouter.delete("/:id", adminDeleteEnrollment);

export default adminEnrollmentsRouter;
