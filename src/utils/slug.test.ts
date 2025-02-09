import { describe, expect, it } from "vitest";
import { createSlug } from "./slug";

describe("createSlug", () => {
	it("should convert text to a slug", () => {
		const text = "Hello World!";
		const slug = createSlug(text);
		expect(slug).toBe("hello-world");
	});

	it("should convert text to lowercase", () => {
		const text = "Hello World!";
		const slug = createSlug(text);
		expect(slug).toBe("hello-world");
	});

	it("should remove special characters", () => {
		const text = "Hello @ World!";
		const slug = createSlug(text);
		expect(slug).toBe("hello-world");
	});

	it("should trim whitespace", () => {
		const text = "  Hello World!  ";
		const slug = createSlug(text);
		expect(slug).toBe("hello-world");
	});

	it("should handle empty strings", () => {
		const text = "";
		const slug = createSlug(text);
		expect(slug).toBe("");
	});
});
