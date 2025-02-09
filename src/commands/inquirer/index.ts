import inquirer from "inquirer";

const askInput = async (message: string): Promise<string> => {
	const response = await inquirer.prompt({
		type: "input",
		name: "value",
		message,
	});

	return response.value;
};

const chooseInput = async (
	message: string,
	choices: { name: string; value: string }[],
): Promise<string> => {
	const response = await inquirer.prompt({
		type: "list",
		name: "value",
		message,
		choices,
	});

	return response.value;
};

export const askProjectName = async () => {
	return askInput("What is the project name?");
};

export const askRepoName = async () => {
	return askInput("What is the repository name?");
};

export const askProjectKey = async () => {
	return askInput("What is the project key?");
};

export const askRepoKey = async () => {
	return askInput("What is the repository key?");
};

export const askDescription = async () => {
	return askInput("What is the description?");
};

export const askWorkspace = async () => {
	return askInput("What is the workspace?");
};

export const askResourceType = async () => {
	return chooseInput("What do you want to create?", [
		{ name: "Project", value: "project" },
		{ name: "Repository", value: "repo" },
		{ name: "Cancel", value: "cancel" },
	]);
};
