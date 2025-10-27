import { extractMarkdownFile } from "@/lib/extract.file.lib";
import { PostFileNode } from "@/lib/FileSystem.model";
import { it } from "node:test";

it("should extract metadata from markdown files", () => {
	var file: PostFileNode = extractMarkdownFile(
		"data",
		"java/spring/jdbc",
		"java-spring-jdbc"
	);

	file.print();
});
