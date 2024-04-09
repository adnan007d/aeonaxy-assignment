import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  updateCourse,
} from "@/controllers/courses/admin";
import {
  getAllCategories,
  getAllCourses,
  getCourseById,
} from "@/controllers/courses";
import { validate } from "@/middleware/validate";
import { insertCourseSchema } from "@/util/validations";

const adminCoursesRouter = Router();

// Same as user one but with also return if course is published or not
adminCoursesRouter.get("/", getAllCourses);
adminCoursesRouter.post("/", validate(insertCourseSchema), addCourse);
adminCoursesRouter.put("/:id", validate(insertCourseSchema), updateCourse);
// Same as user added for consistency
adminCoursesRouter.get("/categories", getAllCategories);
// eslint-disable-next-line drizzle/enforce-delete-with-where
adminCoursesRouter.delete("/:id", deleteCourse);
// Same as user one but with also return if course is published or not
adminCoursesRouter.get("/:id", getCourseById);

export default adminCoursesRouter;
