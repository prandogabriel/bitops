import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { logger } from "@libs/logger";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBasicAuth, getToken, saveToken } from "./token";

const CONFIG_DIR = "./test-config";

vi.mock("node:fs", async () => {
	const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
	return {
		...actual,
		existsSync: vi.fn(),
		mkdirSync: vi.fn(),
		readFileSync: vi.fn(),
		writeFileSync: vi.fn(),
	};
});

vi.mock("@libs/logger");

describe("token utils", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.CONFIG_DIR = CONFIG_DIR;
	});

	describe("getBasicAuth", () => {
		it("should exit process if config file does not exist", () => {
			vi.mocked(existsSync).mockReturnValue(false);
			const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
				throw new Error("Process exited");
			});

			expect(() => getBasicAuth()).toThrow("Process exited");

			expect(logger.error).toHaveBeenCalledWith("❌ Error reading config file");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it("should exit process if config file is missing username or appPass", () => {
			vi.mocked(existsSync).mockReturnValue(true);
			vi.mocked(readFileSync).mockReturnValue(JSON.stringify({}));

			const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
				throw new Error("Process exited");
			});

			expect(() => getBasicAuth()).toThrow("Process exited");

			expect(logger.error).toHaveBeenCalledWith(
				"❌ Error reading config file, please create a config file with username and appPass.",
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it("should return config if config file is valid", () => {
			vi.mocked(existsSync).mockReturnValue(true);
			vi.mocked(readFileSync).mockReturnValue(
				JSON.stringify({ username: "user", appPass: "pass" }),
			);

			const config = getBasicAuth();

			expect(config).toEqual({ username: "user", appPass: "pass" });
		});

		it("should exit process if there is an error reading the config file", () => {
			vi.mocked(existsSync).mockReturnValue(true);
			vi.mocked(readFileSync).mockImplementation(() => {
				throw new Error("read error");
			});

			const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
				throw new Error("Process exited");
			});

			expect(() => getBasicAuth()).toThrow("Process exited");

			expect(logger.error).toHaveBeenCalledWith("❌ Error reading config file");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});
});
