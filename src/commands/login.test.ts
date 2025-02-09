import { Command } from "commander";
import { describe, expect, it, vi } from "vitest";
import { runLogin } from "../modules/login/login";
import { registerLoginCommand } from "./login";

vi.mock("../modules/login/login");

describe("registerLoginCommand", () => {
	it("should call runLogin when the login command is executed", async () => {
		const program = new Command();
		registerLoginCommand(program);

		await program.parseAsync(["node", "index.js", "login"]);

		expect(runLogin).toHaveBeenCalled();
	});
});
