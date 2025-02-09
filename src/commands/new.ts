import { logger } from "@libs/logger";
import { createProject } from "@modules/projects/create";
import { createRepo } from "@modules/repositories/create";
import { listWorkspaces } from "@modules/workspaces/list";
import type { Command } from "commander";
import {
	askDescription,
	askName,
	askResourceType,
	askVisibility,
	askWorkspace,
} from "./inquirer";

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
				await createRepo(options);
				return;
			}

			if (options.project) {
				await createProject(options);
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

			const name = await askName(resourceType);
			const description = await askDescription(resourceType);
			const visibility = await askVisibility(resourceType);
			const workspace = await askWorkspace(availableWorkspaces);

			if (resourceType === "project") {
				await createProject({
					name,
					public: visibility,
					description,
					workspace,
				});
			}

			if (resourceType === "repo") {
				const projectName = await askName("project");

				await createRepo({
					name,
					project: projectName,
					workspace,
					description,
					public: visibility,
				});
			}
		});

	return that;
};
