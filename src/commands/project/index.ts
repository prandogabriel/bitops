import type { Command } from "commander";
import { registerAddUserCommand } from "./add-user";

export const registerProjectCommand = (parent: Command) => {
	const that = parent
		.command("project")
		.alias("p")
		.description("Project related commands");

	registerAddUserCommand(that);

	return that;
};
