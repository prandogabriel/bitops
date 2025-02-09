import { createSlug } from "@utils/slug";
import { bitbucket } from "./client";
const WORKSPACE = process.env.WORKSPACE ?? "prandogabriel";

export const createProject = async (name: string) => {
	const response = await bitbucket.projects.createProject({
		workspace: WORKSPACE,
		_body: Object({
			name,
			key: name.substring(0, 3),
			description: "description",
		}),
	});

	return response.data;
};


export function createRepo(name: string, project: string) {
	return bitbucket.repositories.create({
		workspace: WORKSPACE,
		repo_slug: createSlug(name),
		_body: Object({
			name,
			project: {
				key: project,
			},
			is_private: true,
		}),
	});
}

