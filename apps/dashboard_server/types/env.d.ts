// apps/article_server/src/types/env.d.ts
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
			PORT?: string;
			DATABASE_URL?: string;
			// add other keys you expect
		}
	}
}
export {};
