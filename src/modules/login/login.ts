import { logger } from "@libs/logger";
import { startServer } from "@server/server";

const CLIENT_ID = process.env.BITBUCKET_CLIENT_ID ?? "NbD66ZE6TQ3YLL6953";

export const runLogin = async () => {
	const loginUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`;

	startServer();

	logger.info(`To complete login, open ${loginUrl}`);
};
