import express from "express";
import { promises as fs } from "fs";
import path from "path";

// Note: importing raw .txt files as modules can confuse TypeScript unless
// you have a module declaration for '*.txt'. Instead of importing the file
// at build-time, resolve its path at runtime so Node can locate the file
// inside the monorepo package layout (hoisted node_modules or local package).

const app = express();

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});
app.get("/status", async (req, res) => {
	try {
		// Try to resolve the path via Node's module resolution. This works
		// if the package layout allows resolving internal files, or if
		// the package is installed/hoisted.
		let filePath: string;
		try {
			// This will throw if Node cannot resolve the module specifier.
			// TypeScript won't see this require at build-time as a type import
			// because we didn't use `import` for the .txt file.
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			filePath = require.resolve("@repo/assets/docs/test.txt");
		} catch (resolveErr) {
			// Fallback to the monorepo packages path. Adjust if your repo uses
			// a different layout.
			filePath = path.join(
				process.cwd(),
				"packages",
				"assets",
				"docs",
				"test.txt"
			);
		}

		const content = await fs.readFile(filePath, "utf-8");
		res.json({ status: "ok", content });
	} catch (error) {
		console.error("Failed to read asset file:", error);
		res.status(500).json({ status: "error", message: "Could not read file" });
	}
});

const PORT = 4000;
app.listen(PORT, () => {
	console.log(`Backend listening on port ${PORT}`);
});
