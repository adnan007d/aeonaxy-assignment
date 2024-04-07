import { getUser } from "@/controllers/user";
import { getAllCourses } from "@/controllers/courses";
import { login, signup } from "@/controllers/user/auth";
import {
  insertCourseSchema,
  insertUserSchema,
  loginUserSchema,
} from "@/util/validations";
import { authenticate, checkAdmin } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { Router } from "express";
import { addCourse, deleteCourse, updateCourse } from "@/controllers/courses/admin";

const v1Router = Router();

// Auth Login/Register user
v1Router.post("/auth/login", validate(loginUserSchema), login);
v1Router.post("/auth/signup", validate(insertUserSchema), signup);

// User
v1Router.get("/user/me", authenticate, getUser);

// courses
v1Router.get("/courses", getAllCourses);

// for admin routes
v1Router.get("/admin/courses", authenticate, checkAdmin, getAllCourses);
v1Router.post(
  "/admin/courses",
  authenticate,
  checkAdmin,
  validate(insertCourseSchema),
  addCourse
);
v1Router.put(
  "/admin/courses/:id",
  authenticate,
  checkAdmin,
  validate(insertCourseSchema),
  updateCourse
);
// eslint-disable-next-line drizzle/enforce-delete-with-where
v1Router.delete("/admin/courses/:id", authenticate, checkAdmin, deleteCourse);

export default v1Router;
