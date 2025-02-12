import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";
import { createSlug } from "@utils/slug";

type Options = {
	name: string;
	public: boolean;
	description?: string;
	workspace: string;
};

export const createProject = async (options: Options) => {
	logger.info("📁 Creating project...");

	try {
		const response = await bitbucket.createProject({
			name: createSlug(options.name),
			description: options.description ?? "",
			is_private: !options.public,
			workspace: options.workspace,
		});
		logger.info(
			`📁 Project created, you can access on: ${response.links?.html?.href}`,
		);
	} catch (error) {
		let errorMessages = "";
		if (error instanceof Error) {
			error.stack = undefined;
			errorMessages = JSON.stringify(error);
		}
		logger.error(`📁 Error creating project ${errorMessages}`);
	}
};
