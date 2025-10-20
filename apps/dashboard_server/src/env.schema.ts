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
	HOST_NAME: z.string().default("localhost"),

	DB_PG_HOST: z.string().default("localhost"),
	DB_PG_DATABASE: z.string().default("db20250627"),
	DB_PG_USER: z.string().default("super"),
	DB_PG_PASSWORD: z.string().default(""),
	DB_PG_PORT: z.coerce.number().default(5432),
});

export const env = envSchema.parse(process.env);

export const PORT = env.PORT;
export const HOST_NAME = env.HOST_NAME;

export const DB_PG_HOST = env.DB_PG_HOST;
export const DB_PG_PORT = env.DB_PG_PORT;
export const DB_PG_DATABASE = env.DB_PG_DATABASE;
export const DB_PG_USER = env.DB_PG_USER;
export const DB_PG_PASSWORD = env.DB_PG_PASSWORD;
