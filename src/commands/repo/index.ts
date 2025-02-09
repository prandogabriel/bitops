import type { Command } from "commander";
import { registerAddUserCommand } from "./add-user";

export const registerProjectCommand = (parent: Command) => {
	const that = parent
		.command("repo")
		.alias("r")
		.description("Repository related commands");

	registerAddUserCommand(that);

	return that;
};
