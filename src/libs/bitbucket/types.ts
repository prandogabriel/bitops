export type CreateProjectInput = {
	name: string;
	description: string;
	is_private: boolean;
	workspace: string;
};

export type CreateRepoInput = {
	name: string;
	project: string;
	workspace: string;
	description: string;
	is_private: boolean;
};

export type AddUserToRepoInput = {
	repo_slug: string;
	workspace: string;
	selected_user_id: string;
	username: string;
	permission: string;
};

export type RemoveUserFromRepoInput = {
  repo_slug: string;
  workspace: string;
  selected_user_id: string;
};

export type AddUserToProjectInput = {
	project: string;
	workspace: string;
	permission: string;
	selected_user_id: string;
};

export type RemoveUserFromProjectInput = {
  project: string;
  workspace: string;
  selected_user_id: string;
};