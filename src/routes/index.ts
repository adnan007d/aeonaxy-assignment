import { getUser } from "@/controllers/user";
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

export default v1Router;
