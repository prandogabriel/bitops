import { Bitbucket } from "bitbucket";
import { getBasicAuth } from "../../utils/token";

const basicAuth = getBasicAuth();

export const bitbucket = new Bitbucket({
	baseUrl: "https://api.bitbucket.org/2.0",
	auth: {
		username: basicAuth.username,
		password: basicAuth.appPass,
	},
});
