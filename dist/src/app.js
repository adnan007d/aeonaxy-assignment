"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./util/logger");
const routes_1 = __importDefault(require("./routes"));
const util_1 = require("./util/util");
const app = (0, express_1.default)();
app.use(logger_1.requestLogger);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.send("Hello World");
});
app.use("/api/v1", routes_1.default);
app.get("/api", (_req, res) => {
    res.send("API v1 at /api/v1");
});
// Should be last to catch all errors
app.use(util_1.errorHandler);
exports.default = app;
