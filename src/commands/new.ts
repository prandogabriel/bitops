import { logger } from "@libs/logger";
import { createProject } from "@modules/projects/create";
import { createRepo } from "@modules/repositories/create";
import type { Command } from "commander";
import { askProjectName, askRepoName, askResourceType } from "./inquirer";

export const registerNewCommand = (parent: Command) => {
	const that = parent
		.command("new")
		.alias("n")
		.description("Create a new resource (project or repository)")
		.option("-p, --project <name>", "Create a new project")
		.option("-r, --repo <name>", "Create a new repository")
		.action(async (options) => {
			if (options.repo && options.project) {
				await createRepo(options.repo, options.project);
				return;
			}

			if (options.project) {
				await createProject(options.project);
				return;
			}

			// Interactive prompt if no options are provided
			const resourceType = await askResourceType();

			if (resourceType === "cancel") {
				logger.info("❌ Operation cancelled.");
				return;
			}

			if (resourceType === "project") {
				const projectName  = await askProjectName();
				await createProject(projectName);
			}

			if (resourceType === "repo") {
				const repoName  = await askRepoName();
				const projectName  = await askProjectName();

				await createRepo(repoName, projectName);
			}
		});

	return that;
};
