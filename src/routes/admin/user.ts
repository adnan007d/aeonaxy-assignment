import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "@/controllers/user/admin";
import { validate } from "@/middleware/validate";
import { insertUserAdminSchema } from "@/util/validations";

const adminUserRouter = Router();

adminUserRouter.get("/", getAllUsers);
adminUserRouter.get("/:id", getUserById);
adminUserRouter.put("/:id", validate(insertUserAdminSchema), updateUser);
adminUserRouter.post("/", validate(insertUserAdminSchema), addUser);
// eslint-disable-next-line drizzle/enforce-delete-with-where
adminUserRouter.delete("/:id", deleteUser);

export default adminUserRouter;
