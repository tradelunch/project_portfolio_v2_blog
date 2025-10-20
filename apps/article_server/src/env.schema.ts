// apps/article_server/src/env.schema.ts
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z
		.string()
		.transform((s) => Number(s))
		.default(4000),
	DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);

export const PORT = env.PORT;
export const DATABASE_URL = env.DATABASE_URL;
