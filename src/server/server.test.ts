import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import { logger } from "@libs/logger";
import { saveToken } from "@utils/token";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCallbackHtml } from "./callback-html";
import { closeServer, startServer } from "./server";

vi.mock("node:fs");
vi.mock("node:https");
vi.mock("@libs/logger");
vi.mock("@utils/token");
vi.mock("./callback-html");

describe("Server", () => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let mockServer: any;

	beforeEach(() => {
		mockServer = {
			listen: vi.fn(),
			close: vi.fn((callback: () => void) => callback()),
		};

		vi.mocked(createServer).mockImplementation((options, handler) => {
			if (typeof options === "function") {
				const newHandler = options;
				mockServer.handler = newHandler;
			}
			mockServer.handler = handler;
			return mockServer;
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		closeServer();
	});

	it("should start the server", () => {
		startServer();
		expect(createServer).toHaveBeenCalled();
		expect(mockServer.listen).toHaveBeenCalledWith(3000);
		expect(logger.info).not.toHaveBeenCalledWith(
			"🚀 Server is already running.",
		);
	});

	it("should not start the server if already running", () => {
		startServer();
		startServer();
		expect(logger.info).toHaveBeenCalledWith("🚀 Server is already running.");
		expect(createServer).toHaveBeenCalledTimes(1);
	});

	it("should close the server", () => {
		startServer();
		closeServer();
		expect(mockServer.close).toHaveBeenCalled();
		expect(logger.info).not.toHaveBeenCalledWith("⚠️ No server is running.");
	});

	it("should log if no server is running when trying to close", () => {
		closeServer();
		expect(logger.info).toHaveBeenCalledWith("⚠️ No server is running.");
	});

	it("should handle /callback route", async () => {
		const req = { url: "/callback", headers: { host: "localhost" } };
		const res = { writeHead: vi.fn(), end: vi.fn() };

		startServer();
		mockServer.handler(req, res);

		expect(res.writeHead).toHaveBeenCalledWith(200, {
			"Content-Type": "text/html",
		});
		expect(res.end).toHaveBeenCalledWith(getCallbackHtml());
	});

	it("should handle /save-token route with POST method", async () => {
		const req = {
			url: "/save-token",
			method: "POST",
			headers: { host: "localhost" },
			on: vi.fn((event, callback) => {
				if (event === "data")
					callback(JSON.stringify({ accessToken: "test-token" }));
				if (event === "end") callback();
			}),
		};
		const res = { writeHead: vi.fn(), end: vi.fn() };

		startServer();
		mockServer.handler(req, res);

		expect(saveToken).toHaveBeenCalledWith("test-token");
		expect(res.writeHead).toHaveBeenCalledWith(200, {
			"Content-Type": "application/json",
		});
		expect(res.end).toHaveBeenCalledWith(
			JSON.stringify({ message: "Token saved successfully!" }),
		);
	});

	it("should handle error in /save-token route", async () => {
		const req = {
			url: "/save-token",
			method: "POST",
			headers: { host: "localhost" },
			on: vi.fn((event, callback) => {
				if (event === "data") callback("invalid json");
				if (event === "end") callback();
			}),
		};
		const res = { writeHead: vi.fn(), end: vi.fn() };

		startServer();
		mockServer.handler(req, res);

		expect(logger.error).toHaveBeenCalledWith("❌ Error processing token");
		expect(res.writeHead).toHaveBeenCalledWith(500, {
			"Content-Type": "application/json",
		});
		expect(res.end).toHaveBeenCalledWith(
			JSON.stringify({ error: "Failed to process token" }),
		);
	});

	it("should handle unknown routes", async () => {
		const req = { url: "/unknown", headers: { host: "localhost" } };
		const res = { writeHead: vi.fn(), end: vi.fn() };

		startServer();
		mockServer.handler(req, res);

		expect(res.writeHead).toHaveBeenCalledWith(404, {
			"Content-Type": "text/plain",
		});
		expect(res.end).toHaveBeenCalledWith("Route not found.");
	});
});
