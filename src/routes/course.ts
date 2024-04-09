import { Router } from "express";
import {
  getAllCategories,
  getAllCourses,
  getCourseById,
} from "@/controllers/courses";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/categories", getAllCategories);
courseRouter.get("/:id", getCourseById);

export default courseRouter;
