"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env_1 = require("./src/env");
exports.default = {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: env_1.env.DATABASE_URL,
    },
};
