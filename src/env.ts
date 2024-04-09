import { z } from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  PORT: z.number().default(6969),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().url("Database url is required"),
  ACCESS_LOG_FILE: z.string().default("access.log"),
  LOG_FILE: z.string().default("pretty.log"),
  JWT_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().catch("Acme <onboarding@resend.dev>")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error);
  process.exit(1);
}

export const env = parsedEnv.data;
