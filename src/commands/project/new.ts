import { logger } from "@libs/logger";
import { createProject } from "@modules/projects/create";
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
		.description("Create a new project (project)")
		.option("-p, --name <name>", "Create a new project")
		.option("-d, --description <description>", "Description of the resource")
		.option("-w, --workspace <workspace>", "Workspace to create the resource")
		.option("-P, --public", "Make the resource public")
		.action(async (options) => actionCreateProject(options));

	return that;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function actionCreateProject(options: any) {
	if (options.name) {
		await createProject(options);
		return;
	}

	// Interactive prompt if no options are provided
	const [name, availableWorkspaces] = await Promise.all([
		askName("project"),
		listWorkspaces(),
	]);

	const description = await askDescription("project");
	const visibility = await askVisibility("project");
	const workspace = await askWorkspace(availableWorkspaces);

	await createProject({
		name,
		public: visibility,
		description,
		workspace,
	});
}
