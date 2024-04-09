"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_1 = require("@neondatabase/serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
const env_1 = require("../env");
const sql = (0, serverless_1.neon)(env_1.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql, { logger: env_1.env.NODE_ENV === "development" });
exports.default = db;
