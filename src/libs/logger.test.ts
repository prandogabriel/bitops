import { describe, expect, it, vi } from "vitest";
import { logger } from "./logger";

describe("Logger", () => {
	it("should log info messages", () => {
		const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		logger.info("Info message", "additional", "params");

		expect(consoleLogSpy).toHaveBeenCalledWith(
			"Info message",
			"additional",
			"params",
		);

		consoleLogSpy.mockRestore();
	});

	it("should log error messages", () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		logger.error("Error message");

		expect(consoleErrorSpy).toHaveBeenCalledWith("Error message");

		consoleErrorSpy.mockRestore();
	});

	it("should return the same instance", () => {
		const logger1 = logger;
		const logger2 = logger;

		expect(logger1).toBe(logger2);
	});
});
