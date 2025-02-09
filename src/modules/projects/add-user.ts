import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

type Options = {
	project: string;
	workspace: string;
	permission: string;
	userAccountId: string;
};

export const addUserToProject = async (options: Options) => {
	console.log(options);

	logger.info("📁 adding user to project project: ", options.project);

	const user = await bitbucket.getUser(options.userAccountId);
	console.log(user);

	const response = await bitbucket.addUserToProject({
		workspace: options.workspace,
		project: options.project,
		permission: options.permission ?? "read",
		selected_user_id: options.userAccountId,
	});

	logger.info(`📁 User added: ${response.data}`);
};
