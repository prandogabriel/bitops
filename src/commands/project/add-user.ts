import { addUserToProject } from "@modules/projects/add-user";
import { type Command, Option } from "commander";

export const registerAddUserCommand = (parent: Command) => {
	const that = parent
		.command("add-user")
		.alias("au")
		.addOption(
			new Option(
				"-p, --project <project>",
				"Project key",
			).makeOptionMandatory(),
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
		.description("Add a user to a project")
		.action(async (options) => {
			await addUserToProject(options);
		});

	return that;
};
