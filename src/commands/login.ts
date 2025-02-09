import type { Command } from "commander";
import { runLogin } from "../modules/login/login";

export const registerLoginCommand = (parent: Command) => {
	const that = parent
		.command("login")
		.alias("l")
		.description("Login using Bitbucket")
		.action(async () => {
			await runLogin();
		});

	return that;
};
