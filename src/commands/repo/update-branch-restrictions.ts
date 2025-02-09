import { updateBranchRestriction } from "@modules/repositories/update-branch-restriction";
import { type Command, Option } from "commander";

export const registerUpdateBranchRestrictionCommand = (parent: Command) => {
	const that = parent
		.command("update-branch-restriction")
		.alias("ubr")
		.addOption(
			new Option("-p, --repo <repo>", "Repo slug").makeOptionMandatory(),
		)
		.addOption(
			new Option(
				"-w, --workspace <workspace>",
				"Workspace to add the user to",
			).makeOptionMandatory(),
		)
		.description("Add a user to a repository")
		.action(async (options) => {
			await updateBranchRestriction(options);
		});

	return that;
};
