import inquirer from "inquirer";

const askInput = async (message: string): Promise<string> => {
	const response = await inquirer.prompt({
		type: "input",
		name: "value",
		message,
	});

	return response.value;
};

async function chooseInput<T = string>(
	message: string,
	choices: { name: string; value: string | boolean }[],
): Promise<T> {
	const response = await inquirer.prompt({
		type: "list",
		name: "value",
		message,
		choices,
	});

	return response.value;
}

export const askName = async (resourceType: string) => {
	return askInput(`What is the ${resourceType} name?`);
};

export const askDescription = async (resourceType: string) => {
	return askInput(`What is the ${resourceType} description?`);
};

export const askResourceType = async () => {
	return chooseInput("What do you want to create?", [
		{ name: "Project", value: "project" },
		{ name: "Repository", value: "repo" },
		{ name: "Cancel", value: "cancel" },
	]);
};

export const askVisibility = async (resourceType: string) => {
	return chooseInput<boolean>(`Is the ${resourceType} public?`, [
		{ name: "Yes", value: true },
		{ name: "No", value: false },
	]);
};

export const askWorkspace = async (
	workspaces?: {
		name: string;
		value: string;
	}[],
) => {
	if (!workspaces) {
		return askInput("What is the workspace?");
	}

	return chooseInput("What is the workspace?", workspaces);
};
