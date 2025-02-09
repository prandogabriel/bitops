import type { Command } from "commander";
import { registerAddUserCommand } from "./add-user";
import { registerNewCommand } from "./new";
import { registerUpdateBranchRestrictionCommand } from "./update-branch-restrictions";

export const registerRepoCommand = (parent: Command) => {
	const that = parent
		.command("repo")
		.alias("r")
		.description("Repository related commands");

	registerAddUserCommand(that);
	registerNewCommand(that);
	registerUpdateBranchRestrictionCommand(that);

	return that;
};
