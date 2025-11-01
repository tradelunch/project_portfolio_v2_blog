export const config = {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	collectCoverageFrom: [
		"<rootDir>/packages/**/*.{ts,tsx}",
		"!**/node_modules/**",
		"!**/dist/**",
	],
	coverageDirectory: "<rootDir>/coverage",
};
