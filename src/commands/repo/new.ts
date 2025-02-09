import { logger } from "@libs/logger";
import { createRepo } from "@modules/repositories/create";
import { listWorkspaces } from "@modules/workspaces/list";
import {
	askDescription,
	askName,
	askResourceType,
	askVisibility,
	askWorkspace,
} from "@utils/inquirer";
import type { Command } from "commander";

export const registerNewCommand = (parent: Command) => {
	const that = parent
		.command("new")
		.alias("n")
		.description("Create a new resource repository")
		.option("-p, --project <name>", "Create a new project")
		.option("-r, --name <name>", "Create a new repository")
		.option("-d, --description <description>", "Description of the resource")
		.option("-w, --workspace <workspace>", "Workspace to create the resource")
		.option("-P, --public", "Make the resource public")
		.action(async (options) => actionCreateRepo(options));

	return that;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function actionCreateRepo(options: any) {
	if (options.name && options.project) {
		await createRepo(options);
		return;
	}

	// Interactive prompt if no options are provided
	const [name, availableWorkspaces] = await Promise.all([
		askName("repo"),
		listWorkspaces(),
	]);

	const description = await askDescription("repo");
	const visibility = await askVisibility("repo");
	const workspace = await askWorkspace(availableWorkspaces);

	const projectName = await askName("project");

	await createRepo({
		name,
		project: projectName,
		workspace,
		description,
		public: visibility,
	});
}
