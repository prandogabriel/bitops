import { Bitbucket } from "bitbucket";
import { getToken } from "../utils/token";

const WORKSPACE = process.env.WORKSPACE ?? "prandogabriel";

const token = getToken();
if (!token) {
	console.error("❌ Error reading token, please run login command.");
	process.exit(1);
}

const clientOptions = {
	baseUrl: "https://api.bitbucket.org/2.0",
	request: {
		// timeout: 30,
	},
	auth: {
		token: token,
	},
};

const bitbucket = new Bitbucket(clientOptions);

export const createProject = async () => {
	const response = await bitbucket.projects.createProject({
		workspace: WORKSPACE,
		_body: {
			description: "description",
			type: "type",
		},
	});
};
