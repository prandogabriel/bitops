import { logger } from "@libs/logger";
import { createProject } from "@modules/projects/create";
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
import { actionCreateProject } from "./project/new";
import { actionCreateRepo } from "./repo/new";

export const registerNewCommand = (parent: Command) => {
	const that = parent
		.command("new")
		.alias("n")
		.description("Create a new resource (project or repository)")
		.option("-p, --project <name>", "Create a new project")
		.option("-r, --repo <name>", "Create a new repository")
		.option("-d, --description <description>", "Description of the resource")
		.option("-w, --workspace <workspace>", "Workspace to create the resource")
		.option("-P, --public", "Make the resource public")
		.action(async (options) => {
			if (options.repo && options.project) {
				await actionCreateRepo(options);
				return;
			}

			if (options.project) {
				await actionCreateProject(options);
				return;
			}

			// Interactive prompt if no options are provided
			const [resourceType, availableWorkspaces] = await Promise.all([
				askResourceType(),
				listWorkspaces(),
			]);

			if (resourceType === "cancel") {
				logger.info("❌ Operation cancelled.");
				return;
			}

			options.name = await askName(resourceType);
			options.description = await askDescription(resourceType);
			options.public = await askVisibility(resourceType);
			options.workspace = await askWorkspace(availableWorkspaces);

			if (resourceType === "project") {
				await actionCreateProject(options);
			}

			if (resourceType === "repo") {
				options.project = await askName("project");
				await actionCreateRepo(options);
			}
		});

	return that;
};
