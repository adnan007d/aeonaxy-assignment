"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const migrator_1 = require("drizzle-orm/neon-http/migrator");
const dotenv_1 = require("dotenv");
const env_1 = require("../env");
(0, dotenv_1.config)();
const sql = (0, serverless_1.neon)(env_1.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql);
const main = async () => {
    try {
        await (0, migrator_1.migrate)(db, { migrationsFolder: "drizzle" });
        console.log("Migration completed");
    }
    catch (error) {
        console.error("Error during migration:", error);
        process.exit(1);
    }
};
main();
