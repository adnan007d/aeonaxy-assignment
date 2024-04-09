"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
userRouter.use(auth_1.authenticate);
userRouter.get("/me", user_1.getUser);
exports.default = userRouter;
