// packages/eslint-config/base.js

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import * as importPlugin from "eslint-plugin-import"; // 💡 추가 필요
// import tseslint from "typescript-eslint"; // 이미 있음
// import * as jestPlugin from "eslint-plugin-jest"; // 💡 추가 필요
// import * as simpleImportSortPlugin from "eslint-plugin-simple-import-sort"; // 💡 추가 필요
// import * as eslintCommentsPlugin from "eslint-plugin-eslint-comments"; // 💡 추가 필요
// (eslint-plugin, 즉 eslint-plugin-eslint-plugin은 일반적으로 제거해도 무방합니다.)

import { config as baseConfig } from "./base.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
// 	baseDirectory: __dirname,
// });

const eslintConfig = [
	...baseConfig,
	// 4. 모노레포 공통 TypeScript 오버라이드 및 설정

	{
		// 모든 TS/TSX 파일에 적용
		files: ["**/*/*.ts", "**/*.tsx"],
		// files: ["**/*/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

		plugins: {
			// [네임스페이스]: 가져온 플러그인 객체
			// "@typescript-eslint": tseslint.plugin,
			import: importPlugin,
			// jest: jestPlugin,
			// "simple-import-sort": simpleImportSortPlugin,
			// "eslint-comments": eslintCommentsPlugin,
		},
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",

				// 모노레포에서 TS 타입 기반 규칙을 활성화하기 위해 유지합니다.
				project: ["./tsconfig.json"],
				tsconfigRootDir: process.cwd(),
			},
		},
		rules: {
			// base 규칙 OFF / TS 규칙 ON 패턴 유지
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					vars: "all",
					args: "all",
					argsIgnorePattern: "^_+$",
				},
			],
			"no-empty-function": "off",
			"@typescript-eslint/no-empty-function": "warn",

			// 모듈 및 스타일 규칙
			"import/extensions": [
				"warn",
				{ js: "never", jsx: "never", ts: "never", tsx: "never" },
			],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-param-reassign": "error",
			eqeqeq: "error",
			"max-len": ["warn", { code: 200 }],

			// TypeScript 안전 규칙 (Base에서 일반적으로 필요한 것만 남김)
			"@typescript-eslint/restrict-plus-operands": "warn",
			"@typescript-eslint/restrict-template-expressions": "warn",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-use-before-define": [
				"error",
				{
					functions: false,
					classes: true,
					variables: true,
					typedefs: true,
				},
			],
			// 안전 규칙을 off로 설정한 부분은 필요에 따라 유지하거나,
			// 더 엄격한 설정을 위해 제거할 수 있습니다.
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{ checksVoidReturn: false },
			],
			"@typescript-eslint/allowImportingTsExtensions": "off",
			"@typescript-eslint/no-empty-object-type": [
				"warn",
				{ allowObjectTypes: "always" },
			],
			"@typescript-eslint/no-misused-promises": [
				"error",
				{ checksVoidReturn: false },
			],
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/await-thenable": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/member-ordering": "off",
		},
	},
];

export default eslintConfig;
