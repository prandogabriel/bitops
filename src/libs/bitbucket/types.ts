export type CreateProjectInput = {
  name: string;
  description: string;
  is_private: boolean;
  workspace: string;
}

export type CreateRepoInput = {
  name: string;
  project: string;
  workspace: string;
  description: string;
  is_private: boolean;
}