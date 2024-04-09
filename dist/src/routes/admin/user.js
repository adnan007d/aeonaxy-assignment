"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../../controllers/user/admin");
const validate_1 = require("../../middleware/validate");
const validations_1 = require("../../util/validations");
const adminUserRouter = (0, express_1.Router)();
adminUserRouter.get("/", admin_1.getAllUsers);
adminUserRouter.get("/:id", admin_1.getUserById);
adminUserRouter.put("/:id", (0, validate_1.validate)(validations_1.insertUserAdminSchema), admin_1.updateUser);
adminUserRouter.post("/", (0, validate_1.validate)(validations_1.insertUserAdminSchema), admin_1.addUser);
// eslint-disable-next-line drizzle/enforce-delete-with-where
adminUserRouter.delete("/:id", admin_1.deleteUser);
exports.default = adminUserRouter;
