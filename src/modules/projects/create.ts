import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

type Options = {
	name: string;
	public: boolean;
	description?: string;
	workspace: string;
};

export const createProject = async (options: Options) => {
	logger.info("📁 Creating project: name...");

	const response = await bitbucket.createProject({
		name: options.name,
		description: options.description ?? "",
		is_private: !options.public,
		workspace: options.workspace,
	});

	logger.info(
		`📁 Project created, you can access on: ${response.links?.html?.href}`,
	);
};
