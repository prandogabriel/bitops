import { createSlug } from "@utils/slug";
import { bitbucket } from "./client";
import type { CreateProjectInput, CreateRepoInput } from "./types";

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
