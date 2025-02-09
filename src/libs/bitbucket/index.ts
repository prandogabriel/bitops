import { createSlug } from "@utils/slug";
import { bitbucket } from "./client";
import type {
	AddUserToProjectInput,
	AddUserToRepoInput,
	CreateProjectInput,
	CreateRepoInput,
	RemoveUserFromProjectInput,
	RemoveUserFromRepoInput,
} from "./types";

export async function createProject({
	description,
	is_private,
	name,
	workspace,
}: CreateProjectInput) {
	const response = await bitbucket.projects.createProject({
		workspace: workspace,
		_body: Object({
			name,
			is_private,
			key: name.substring(0, 3),
			description: description,
		}),
	});

	return response.data;
}

export async function createRepo({
	description,
	is_private,
	name,
	project,
	workspace,
}: CreateRepoInput) {
	return bitbucket.repositories.create({
		workspace: workspace,
		repo_slug: createSlug(name),
		_body: Object({
			name,
			project: {
				key: project,
			},
			is_private,
			description,
		}),
	});
}

export async function listWorkspaces() {
	return (await bitbucket.workspaces.getWorkspaces({})).data.values ?? [];
}

export async function addUserToRepo({
	repo_slug,
	workspace,
	username,
	permission,
	selected_user_id,
}: AddUserToRepoInput) {
	return bitbucket.repositories.updateUserPermission({
		workspace,
		repo_slug,
		selected_user_id,
		_body: Object({
			username,
			permission,
		}),
	});
}

export async function removeUserFromRepo({
	repo_slug,
	workspace,
	selected_user_id,
}: RemoveUserFromRepoInput) {
	return bitbucket.repositories.deleteUserPermission({
		workspace,
		repo_slug,
		selected_user_id,
	});
}

export async function addUserToProject({
	project,
	workspace,
	permission,
	selected_user_id,
}: AddUserToProjectInput) {
	return bitbucket.projects.updateUserPermission({
		workspace,
		project_key: project,
		selected_user_id,
		_body: Object({
			permission,
		}),
	});
}

export async function removeUserFromProject({
	project,
	workspace,
	selected_user_id,
}: RemoveUserFromProjectInput) {
	return bitbucket.projects.deleteUserPermission({
		workspace,
		project_key: project,
		selected_user_id,
	});
}

export async function getUser(selected_user_id: string) {
	const response = await bitbucket.users.get({ selected_user: selected_user_id });

	return response.data;
}
