import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CONFIG_DIR = process.env.CONFIG_DIR ?? `${process.env.HOME}/.bitops`;
const CONFIG_FILE = `${CONFIG_DIR}/config.json`;

export function saveToken(accessToken: string) {
	if (!existsSync(CONFIG_DIR)) {
		mkdirSync(CONFIG_DIR, { recursive: true });
	}

	const configData = { accessToken };

	writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2), {
		encoding: "utf-8",
	});
}

export function getToken(): string | null {
	if (!existsSync(CONFIG_FILE)) {
		console.warn("⚠️ Please running login command.");
		return null;
	}

	try {
		const data = readFileSync(CONFIG_FILE, "utf-8");
		const json = JSON.parse(data);
		return json.accessToken || null;
	} catch (error) {
		console.error("❌ Error reading token:", error);
		return null;
	}
}
