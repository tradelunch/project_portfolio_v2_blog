import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config: any, options: any) => {
		console.log(">> next.config.ts::webpack config called");

		// PDF loader
		config.module.rules.push({
			test: /\.(pdf)$/,
			type: "asset/resource",
		});

		// SVG loader
		// config.module.rules.push({
		// 	test: /\.svg$/,
		// 	use: [
		// 		{
		// 			loader: "@svgr/webpack",
		// 			options: {
		// 				svgoConfig: {
		// 					plugins: [
		// 						{
		// 							name: "preset-default",
		// 							params: {
		// 								overrides: {
		// 									removeViewBox: false,
		// 								},
		// 							},
		// 						},
		// 					],
		// 				},
		// 			},
		// 		},
		// 	],
		// });

		// alias for path
		config.resolve.alias = {
			...config.resolve.alias,
		};

		return config;
	},
};

export default nextConfig;
