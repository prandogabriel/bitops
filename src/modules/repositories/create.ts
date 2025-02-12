import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";
import { createSlug } from "@utils/slug";

type Options = {
	name: string;
	project: string;
	description?: string;
	workspace: string;
	public: boolean;
};

export const createRepo = async (opts: Options) => {
	logger.info("📁 Creating repo: name...");

	const response = await bitbucket.createRepo({
		workspace: opts.workspace,
		project: opts.project,
		name: createSlug(opts.name),
		description: opts.description ?? "",
		is_private: !opts.public,
	});

	logger.info(
		`📁 repo created, you can access on: ${response.data.links?.html?.href}`,
	);
};
