import { Bitbucket } from "bitbucket";
import { getToken } from "../../utils/token";
import { logger } from "../logger";

const token = getToken();
if (!token) {
  logger.error("❌ Error reading token, please run login command.");
  process.exit(1);
}

const clientOptions = {
  baseUrl: "https://api.bitbucket.org/2.0",
  auth: {
    token: token,
  },
};

export const bitbucket = new Bitbucket(clientOptions);