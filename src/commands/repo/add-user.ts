import { addUserToRepo } from "@modules/repositories/add-user";
import { type Command, Option } from "commander";

export const registerAddUserCommand = (parent: Command) => {
	const that = parent
		.command("add-user")
		.alias("au")
		.addOption(
			new Option("-p, --repo <repo>", "Repo slug").makeOptionMandatory(),
		)
		.addOption(
			new Option(
				"-u, --user-account-id <user_account_id>",
				"User account id to add",
			).makeOptionMandatory(),
		)
		.addOption(
			new Option(
				"-w, --workspace <workspace>",
				"Workspace to add the user to",
			).makeOptionMandatory(),
		)
		.addOption(
			new Option(
				"-P, --permission <permission>",
				"Permission level for the user",
			),
		)

		.description("Add a user to a repository")
		.action(async (options) => {
			await addUserToRepo(options);
		});

	return that;
};
