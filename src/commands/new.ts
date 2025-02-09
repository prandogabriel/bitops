import { logger } from "@libs/logger";
import { createProject } from "@modules/projects/create";
import type { Command } from "commander";
import inquirer from "inquirer";

export const registerNewCommand = (parent: Command) => {
	const that = parent
		.command("new")
		.alias("n")
		.description("Create a new resource (project or repository)")
		.option("-p, --project <name>", "Create a new project")
		.option("-r, --repo <name>", "Create a new repository")
		.action(async (options) => {
			if (options.repo && options.project) {
				logger.info(`📦 Creating repository: ${options.repo}...`);
				// await createRepo(options.repo);
				return;
			}

			if (options.project) {
				await createProject(options.project);
				return;
			}


			// Interactive prompt if no options are provided
			const { resourceType } = await inquirer.prompt([
				{
					type: "list",
					name: "resourceType",
					message: "What do you want to create?",
					choices: [
						{ name: "Project", value: "project" },
						{ name: "Repository", value: "repo" },
						{ name: "Cancel", value: "cancel" },
					],
				},
			]);

			if (resourceType === "cancel") {
				logger.info("❌ Operation cancelled.");
				return;
			}

			if (resourceType === "project") {
				const { projectName } = await inquirer.prompt([
					{
						type: "input",
						name: "projectName",
						message: "Enter the project name:",
						validate: (input: string) =>
							input ? true : "Project name cannot be empty.",
					},
				]);
				logger.info(`📁 Creating project: ${projectName}...`);
				await createProject(projectName);
			}

			if (resourceType === "repo") {
				const { repoName } = await inquirer.prompt([
					{
						type: "input",
						name: "repoName",
						message: "Enter the repository name:",
						validate: (input: string) =>
							input ? true : "Repository name cannot be empty.",
					},
				]);
				logger.info(`📦 Creating repository: ${repoName}...`);
				// await createRepo(repoName);
			}
		});

	return that;
};
