import { logger } from "@libs/logger";
import { listWorkspaces } from "@modules/workspaces/list";
import {
	askDescription,
	askName,
	askResourceType,
	askVisibility,
	askWorkspace,
} from "@utils/inquirer";
import { Command } from "commander";
import { describe, expect, it, vi } from "vitest";
import { registerNewCommand } from "./new";
import { actionCreateProject } from "./project/new";
import { actionCreateRepo } from "./repo/new";

vi.mock("./project/new");
vi.mock("./repo/new");
vi.mock("@utils/inquirer");
vi.mock("@modules/workspaces/list");
vi.mock("@libs/logger");

describe("registerNewCommand", () => {
	it("should call actionCreateRepo when the repo option is provided", async () => {
		const program = new Command();
		registerNewCommand(program);

		await program.parseAsync([
			"node",
			"index.js",
			"new",
			"--repo",
			"test-repo",
			"--project",
			"test-project",
		]);

		expect(actionCreateRepo).toHaveBeenCalledWith(
			expect.objectContaining({ repo: "test-repo" }),
		);
	});

	it("should call actionCreateProject when the project option is provided", async () => {
		const program = new Command();
		registerNewCommand(program);

		await program.parseAsync([
			"node",
			"index.js",
			"new",
			"--project",
			"test-project",
		]);

		expect(actionCreateProject).toHaveBeenCalledWith(
			expect.objectContaining({ project: "test-project" }),
		);
	});

	it("should prompt for details and create a project interactively", async () => {
		vi.mocked(askResourceType).mockResolvedValue("project");
		vi.mocked(listWorkspaces).mockResolvedValue([
			{ name: "workspace1", value: "workspace1" },
		]);
		vi.mocked(askName).mockResolvedValue("test-project");
		vi.mocked(askDescription).mockResolvedValue("test-description");
		vi.mocked(askVisibility).mockResolvedValue(true);
		vi.mocked(askWorkspace).mockResolvedValue("workspace1");

		const program = new Command();
		registerNewCommand(program);

		await program.parseAsync(["node", "index.js", "new"]);

		expect(actionCreateProject).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "test-project",
				description: "test-description",
				public: true,
				workspace: "workspace1",
			}),
		);
	});

	it("should prompt for details and create a repo interactively", async () => {
		vi.mocked(askResourceType).mockResolvedValue("repo");
		vi.mocked(listWorkspaces).mockResolvedValue([
			{ name: "workspace1", value: "workspace1" },
		]);
		vi.mocked(askName)
			.mockResolvedValueOnce("test-repo")
			.mockResolvedValueOnce("test-project");
		vi.mocked(askDescription).mockResolvedValue("test-description");
		vi.mocked(askVisibility).mockResolvedValue(true);
		vi.mocked(askWorkspace).mockResolvedValue("workspace1");

		const program = new Command();
		registerNewCommand(program);

		await program.parseAsync(["node", "index.js", "new"]);

		expect(actionCreateRepo).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "test-repo",
				description: "test-description",
				public: true,
				workspace: "workspace1",
				project: "test-project",
			}),
		);
	});

	it("should log operation cancelled when resource type is cancel", async () => {
		vi.mocked(askResourceType).mockResolvedValue("cancel");

		const program = new Command();
		registerNewCommand(program);

		await program.parseAsync(["node", "index.js", "new"]);

		expect(logger.info).toHaveBeenCalledWith("❌ Operation cancelled.");
	});
});
