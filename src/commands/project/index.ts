import type { Command } from "commander";
import { registerAddUserCommand } from "./add-user";
import { registerNewCommand } from "./new";

export const registerProjectCommand = (parent: Command) => {
	const that = parent
		.command("project")
		.alias("p")
		.description("Project related commands");

	registerAddUserCommand(that);
	registerNewCommand(that);

	return that;
};
