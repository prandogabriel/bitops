import inquirer from "inquirer";
import { describe, expect, it, vi } from "vitest";
import {
	askBranchPattern,
	askDescription,
	askId,
	askModifyExemptUsers,
	askName,
	askResourceType,
	askVisibility,
	askWorkspace,
} from "./index";

vi.mock("@commands/project");
vi.mock("@commands/repo");
vi.mock("./commands/login");
vi.mock("./commands/new");
vi.mock("@libs/logger");

vi.mock("inquirer");

describe("Inquirer utils", () => {
	it("should ask for a resource name", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ value: "test-name" });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askName("project");
		expect(result).toBe("test-name");
		expect(mockPrompt).toHaveBeenCalledWith({
			type: "input",
			name: "value",
			message: "What is the project name?",
		});
	});

	it("should ask for a resource description", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ value: "test-description" });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askDescription("project");
		expect(result).toBe("test-description");
		expect(mockPrompt).toHaveBeenCalledWith({
			type: "input",
			name: "value",
			message: "What is the project description?",
		});
	});

	it("should ask for a resource type", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ value: "project" });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askResourceType();
		expect(result).toBe("project");
		expect(mockPrompt).toHaveBeenCalledWith({
			type: "list",
			name: "value",
			message: "What do you want to create?",
			choices: [
				{ name: "Project", value: "project" },
				{ name: "Repository", value: "repo" },
				{ name: "Cancel", value: "cancel" },
			],
		});
	});

	it("should ask for visibility", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ value: true });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askVisibility("project");
		expect(result).toBe(true);
		expect(mockPrompt).toHaveBeenCalledWith({
			type: "list",
			name: "value",
			message: "Is the project public?",
			choices: [
				{ name: "Yes", value: true },
				{ name: "No", value: false },
			],
		});
	});

	it("should ask for a workspace", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ value: "test-workspace" });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askWorkspace();
		expect(result).toBe("test-workspace");
		expect(mockPrompt).toHaveBeenCalledWith({
			type: "input",
			name: "value",
			message: "What is the workspace?",
		});
	});

	it("should ask for an ID", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ id: 1 });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askId("delete", [1, 2, 3]);
		expect(result).toBe(1);
		expect(mockPrompt).toHaveBeenCalledWith([
			{
				type: "list",
				name: "id",
				message: "Select the branch restriction to delete:",
				choices: [
					{ name: "ID 1", value: 1 },
					{ name: "ID 2", value: 2 },
					{ name: "ID 3", value: 3 },
				],
			},
		]);
	});

	it("should ask for a branch pattern", async () => {
		const mockPrompt = vi.fn().mockResolvedValue({ branchPattern: "main" });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askBranchPattern("main");
		expect(result).toBe("main");
		expect(mockPrompt).toHaveBeenCalledWith([
			{
				type: "input",
				name: "branchPattern",
				message: "Enter the branch pattern (enter to maintain main):",
				default: "main",
			},
		]);
	});

	it("should ask to modify exempt users", async () => {
		const mockPrompt = vi
			.fn()
			.mockResolvedValueOnce({ willAddUsers: true })
			.mockResolvedValueOnce({ newUsers: ["user1", "user2"] })
			.mockResolvedValueOnce({ removeUsers: ["uuid1"] });
		vi.mocked(inquirer.prompt).mockImplementation(mockPrompt);

		const result = await askModifyExemptUsers([
			{ uuid: "uuid1", displayName: "User 1" },
			{ uuid: "uuid2", displayName: "User 2" },
		]);
		expect(result).toEqual({
			addUsers: [
				{ uuid: "user1", displayName: "user1" },
				{ uuid: "user2", displayName: "user2" },
			],
			removeUsers: ["uuid1"],
		});
		expect(mockPrompt).toHaveBeenCalledTimes(3);
	});
});
