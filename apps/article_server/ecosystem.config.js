module.exports = {
	apps: [
		{
			name: "server",
			script: "dist/index.js", // 빌드 결과물 실행
			cwd: "./apps/article_server",
			exec_mode: "cluster",
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: "500M",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
