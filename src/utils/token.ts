import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { logger } from "@libs/logger";

const CONFIG_DIR = process.env.CONFIG_DIR ?? `${process.env.HOME}/.bitops`;
const CREDENTIALS_FILE = `${CONFIG_DIR}/credentials.json`;
const CONFIG_FILE = `${CONFIG_DIR}/config.json`;

export function saveToken(accessToken: string) {
	if (!existsSync(CONFIG_DIR)) {
		mkdirSync(CONFIG_DIR, { recursive: true });
	}

	const configData = { accessToken };

	writeFileSync(CREDENTIALS_FILE, JSON.stringify(configData, null, 2), {
		encoding: "utf-8",
	});
}

export function getToken(): string | null {
	if (!existsSync(CREDENTIALS_FILE)) {
		logger.info("⚠️ Please running login command.");
		return null;
	}

	try {
		const data = readFileSync(CREDENTIALS_FILE, "utf-8");
		const json = JSON.parse(data);
		return json.accessToken || null;
	} catch (error) {
		logger.error("❌ Error reading token");
		return null;
	}
}

export const getBasicAuth = () => {
	if (!existsSync(CONFIG_FILE)) {
		logger.error("❌ Error reading config file");
		process.exit(1);
	}

	try {
		const data = readFileSync(CONFIG_FILE, "utf-8");
		const json = JSON.parse(data);
		if (!json.username || !json.appPass) {
			logger.error(
				"❌ Error reading config file, please create a config file with username and appPass.",
			);
			process.exit(1);
		}
		return json;
	} catch (error) {
		logger.error("❌ Error reading config file");
		process.exit(1);
	}
};
