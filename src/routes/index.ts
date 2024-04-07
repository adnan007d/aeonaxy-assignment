import { getUser } from "@/controllers/user";
import { getAllCategories, getAllCourses, getCourseById } from "@/controllers/courses";
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
v1Router.get("/courses/categories", getAllCategories);
v1Router.get("/courses/:id", getCourseById);

// for admin routes
// Same as user one but with also return if course is published or not
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
// Same as user added for consistency
v1Router.get("/admin/courses/categories", authenticate, checkAdmin, getAllCategories);
// eslint-disable-next-line drizzle/enforce-delete-with-where
v1Router.delete("/admin/courses/:id", authenticate, checkAdmin, deleteCourse);
// Same as user one but with also return if course is published or not
v1Router.get("/admin/courses/:id", authenticate, checkAdmin, getCourseById);

export default v1Router;
