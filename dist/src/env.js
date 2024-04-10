"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const password = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/, "Password must contain at least one uppercase, one lowercase, and one number");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.number().default(6969),
    NODE_ENV: zod_1.z.string().default("development"),
    DATABASE_URL: zod_1.z.string().url("Database url is required"),
    ACCESS_LOG_FILE: zod_1.z.string().default("access.log"),
    LOG_FILE: zod_1.z.string().default("pretty.log"),
    JWT_SECRET: zod_1.z.string().min(32),
    RESEND_API_KEY: zod_1.z.string().min(1),
    RESEND_FROM_EMAIL: zod_1.z.string().catch("Acme <onboarding@resend.dev>"),
    VERCEL: zod_1.z.coerce.boolean().default(false),
    PASSWORD_FOR_USER: password,
    PASSWORD_FOR_ADMIN: password,
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error(parsedEnv.error);
    process.exit(1);
}
exports.env = parsedEnv.data;
