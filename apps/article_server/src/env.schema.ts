// apps/article_server/src/env.schema.ts
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(4000),
	DB_URL: z.string(),
	HOST_NAME: z.string().default("localhost"),
});

export const env = envSchema.parse(process.env);

export const PORT = env.PORT;
export const DATABASE_URL = env.DB_URL;
export const HOST_NAME = env.HOST_NAME;
