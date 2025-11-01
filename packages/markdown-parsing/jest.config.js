import { config as baseConfig } from "@repo/jest-config/base";

module.exports = {
	...baseConfig,
	displayName: pkg.name,
	rootDir: "../../packages/markdown-parsing",
	testMatch: ["<rootDir>/src/**/*.(spec|test).{ts,tsx}"],
};
