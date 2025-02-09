import { logger } from "@libs/logger";
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
	choices: { name: string; value: string | boolean | number }[],
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

export const askId = async (action: string, ids: number[]) => {
	const { id } = await inquirer.prompt([
		{
			type: "list",
			name: "id",
			message: `Select the branch restriction to ${action}:`,
			choices: ids.map((id) => ({ name: `ID ${id}`, value: id })),
		},
	]);
	return id;
};

export const askBranchType = async (defaultValue: string) => {
	const { branchType } = await inquirer.prompt([
		{
			type: "list",
			name: "branchType",
			message: "Select the branch restriction type:",
			choices: [
				{ name: "Push Restriction", value: "push" },
				{ name: "Force Push Restriction", value: "force" },
				{ name: "Delete Restriction", value: "delete" },
				{ name: "Merge Check Restriction", value: "merge-check" },
			],
			default: defaultValue,
		},
	]);
	return branchType;
};

export const askPermission = async (defaultValue: string) => {
	const { permission } = await inquirer.prompt([
		{
			type: "list",
			name: "permission",
			message: "Select the new permission level:",
			choices: [
				{ name: "Read", value: "read" },
				{ name: "Write", value: "write" },
				{ name: "Admin", value: "admin" },
			],
			default: defaultValue,
		},
	]);
	return permission;
};

export const askBranchPattern = async (defaultValue: string) => {
	const { branchPattern } = await inquirer.prompt([
		{
			type: "input",
			name: "branchPattern",
			message: `Enter the branch pattern (enter to maintain ${defaultValue}):`,
			default: defaultValue,
		},
	]);
	return branchPattern;
};

export const askModifyExemptUsers = async (
	currentUsers: { uuid: string; displayName: string }[],
) => {
	const { willAddUsers } = await inquirer.prompt([
		{
			type: "confirm",
			name: "willAddUsers",
			message: "Do you want to add users to the exemption list?",
		},
	]);

	const addUsers = [];

	if (willAddUsers) {
		const { newUsers } = await inquirer.prompt([
			{
				type: "input",
				name: "newUsers",
				message:
					"Enter the usernames to ADD to exemption list (comma-separated):",
				filter: (input) =>
					input
						? input
								.split(",")
								.map((user: string) => user.trim())
								.filter(Boolean)
						: [],
			},
		]);
		addUsers.push(
			...newUsers.map((u: string) => ({ uuid: u, displayName: u })),
		);
	}

	if (currentUsers.length === 0) {
		logger.info("No users to remove from exemption list.");
		return { addUsers, removeUsers: [] };
	}

	const { removeUsers } = await inquirer.prompt([
		{
			type: "checkbox",
			name: "removeUsers",
			message:
				"Select users to REMOVE from exemption list (leave empty to skip):",
			choices: currentUsers.map((user) => ({
				name: user.displayName,
				value: user.uuid,
			})),
		},
	]);

	return { addUsers, removeUsers };
};
