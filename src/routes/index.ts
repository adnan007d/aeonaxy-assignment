import { getUser } from "@/controllers/user";
import { getAllCourses } from "@/controllers/courses";
import { login, signup } from "@/controllers/user/auth";
import { insertUserSchema, loginUserSchema } from "@/util/validations";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { Router } from "express";

const v1Router = Router();

// Auth Login/Register user
v1Router.post("/auth/login", validate(loginUserSchema), login);
v1Router.post("/auth/signup", validate(insertUserSchema), signup);

// User
v1Router.get("/user/me", authenticate, getUser);

// courses
v1Router.get("/courses", getAllCourses);

export default v1Router;
