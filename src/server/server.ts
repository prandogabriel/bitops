import { createServer, type Server } from "node:https";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { URL } from "node:url";
import { getCallbackHtml } from "./callback-html";
import { saveToken } from "@utils/token";

const PORT = 3000;
let server: Server | null = null;

const BASE_PATH = __dirname;

const options = {
	key: readFileSync(join(BASE_PATH, "server.key")),
	cert: readFileSync(join(BASE_PATH, "server.cert")),
};

export function startServer() {
	if (server) {
		console.log("🚀 Server is already running.");
		return;
	}

	server = createServer(options, (req, res) => {
		const url = new URL(req.url || "", `https://${req.headers.host}`);

		if (url.pathname === "/callback") {
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(getCallbackHtml());
			return;
		}

		if (url.pathname === "/save-token" && req.method === "POST") {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});

			req.on("end", () => {
				try {
					const { accessToken } = JSON.parse(body);
					console.log("✅ login success:");
					saveToken(accessToken);

					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "Token saved successfully!" }));

					setTimeout(closeServer, 1000);
				} catch (error) {
					console.error("❌ Error processing token:", error);
					res.writeHead(500, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "Failed to process token" }));
				}
			});
			return;
		}

		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Route not found.");
	});

	server.listen(PORT, () => {
		console.log(`🚀 HTTPS server running at https://localhost:${PORT}`);
	});
}

export function closeServer() {
	if (server) {
		server.close(() => {
			console.log("🛑 Server closed.");
			server = null;
		});
	} else {
		console.log("⚠️ No server is running.");
	}
}
