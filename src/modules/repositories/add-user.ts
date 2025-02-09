import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

type Options = {
	repo: string;
	workspace: string;
	permission: string;
	userId: string;
};

export const addUserToRepo = async (options: Options) => {
	logger.info("📁 adding user to repo: ", options.repo);

	const response = await bitbucket.addUserToRepo({
		workspace: options.workspace,
		repo_slug: options.repo,
		permission: options.permission ?? "write",
		selected_user_id: options.userId,
	});

	logger.info(`📁 User ${response.data.user?.display_name} added to repo ${response.data.repository?.name} `);
};
