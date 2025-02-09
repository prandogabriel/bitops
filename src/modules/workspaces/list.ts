import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

type ListWorkspacesOutput = {
	name: string;
	value: string;
}[];

export const listWorkspaces = async (): Promise<ListWorkspacesOutput> => {
  logger.info("📁 Getting workspaces...");
	const workspaces = await bitbucket.listWorkspaces();

	return workspaces.map((workspace) => ({
		name: workspace.name ?? "",
		value: workspace.slug ?? "",
	}));
};
