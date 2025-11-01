import { describe, expect, it } from "@jest/globals";
import { add } from "./add";

describe("parseMarkdown", () => {
	it("should return 12 when add(5, 7) is called", () => {
		expect(add(5, 7)).toBe(12);
	});
});
