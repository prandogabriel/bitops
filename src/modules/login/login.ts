import { startServer } from "@server/server";

const CLIENT_ID = process.env.BITBUCKET_CLIENT_ID;

export const runLogin = async () => {
	const loginUrl =
		`https://bitbucket.org/site/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}`;

	startServer();

	console.log("To complete login, open $loginUrl");
};
