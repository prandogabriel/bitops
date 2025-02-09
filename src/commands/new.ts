import type { Command } from "commander";
import { createProject } from "../libs/bitbucket";

const runCreateProject = async () => {
	console.log("Creating project...");

	await createProject();
};

export const registerNewCommand = (parent: Command) => {
	const that = parent
		.command("new")
		.alias("n")
		.description("Create a new resource")
		.action((options) => {
			console.log("Creating a new resource...");
		});

	return that;
};
