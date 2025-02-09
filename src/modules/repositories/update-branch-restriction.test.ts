import {
	listBranchRestrictions,
	updateRepoBranchRestriction,
} from "@libs/bitbucket";
import { logger } from "@libs/logger";
import { askBranchPattern, askId, askModifyExemptUsers } from "@utils/inquirer";
import { describe, expect, it, vi } from "vitest";
import { updateBranchRestriction } from "./update-branch-restriction";

vi.mock("@libs/bitbucket");
vi.mock("@libs/logger");
vi.mock("@utils/inquirer");

describe("updateBranchRestriction", () => {
	const options = { repo: "test-repo", workspace: "test-workspace" };

	it("should log a message if no branch restrictions are found", async () => {
		vi.mocked(listBranchRestrictions).mockResolvedValue({
			data: { values: [] },
		} as any);

		await updateBranchRestriction(options);

		expect(logger.info).toHaveBeenCalledWith(
			"No branch restrictions found for this repository, please create one first.",
		);
	});

	it("should log available branch restrictions", async () => {
		vi.mocked(listBranchRestrictions).mockResolvedValue({
			data: {
				values: [
					{
						id: 1,
						kind: "push",
						pattern: "main",
						users: [{ uuid: "uuid1", display_name: "User 1" }],
					},
				],
			},
		} as any);

		vi.mocked(askId).mockResolvedValue(1);
		vi.mocked(askBranchPattern).mockResolvedValue("main");
		vi.mocked(askModifyExemptUsers).mockResolvedValue({
			addUsers: [],
			removeUsers: [],
		});
		vi.mocked(updateRepoBranchRestriction).mockResolvedValue({} as any);

		await updateBranchRestriction(options);

		expect(logger.info).toHaveBeenCalledWith(
			"📜 Available branch restrictions: ",
		);
		expect(logger.info).toHaveBeenCalledWith(
			"🔹 ID: 1 | Type: push | Branch: main | Exempt Users: User 1",
		);
	});

	it("should log an error if no valid ID is selected", async () => {
		vi.mocked(listBranchRestrictions).mockResolvedValue({
			data: {
				values: [
					{
						id: 1,
						kind: "push",
						pattern: "main",
						users: [{ uuid: "uuid1", display_name: "User 1" }],
					},
				],
			},
		} as any);

		vi.mocked(askId).mockResolvedValue(null);

		await updateBranchRestriction(options);

		expect(logger.error).toHaveBeenCalledWith(
			"⚠️ No valid ID selected, exiting...",
		);
	});

	it("should update branch restriction successfully", async () => {
		vi.mocked(listBranchRestrictions).mockResolvedValue({
			data: {
				values: [
					{
						id: 1,
						kind: "push",
						pattern: "main",
						users: [{ uuid: "uuid1", display_name: "User 1" }],
					},
				],
			},
		} as any);

		vi.mocked(askId).mockResolvedValue(1);
		vi.mocked(askBranchPattern).mockResolvedValue("main");
		vi.mocked(askModifyExemptUsers).mockResolvedValue({
			addUsers: [{ uuid: "uuid2", displayName: "User 2" }],
			removeUsers: ["uuid1"],
		});
		vi.mocked(updateRepoBranchRestriction).mockResolvedValue({} as any);

		await updateBranchRestriction(options);

		expect(logger.info).toHaveBeenCalledWith(
			"🔄 Processing user modifications...",
		);
		expect(logger.info).toHaveBeenCalledWith(
			`Updating branch restriction 1 with pattern "main" and exempt users: User 2...`,
		);
		expect(logger.info).toHaveBeenCalledWith(
			"✅ Branch restriction updated successfully!",
		);
	});

	it("should log an error if updating branch restriction fails", async () => {
		vi.mocked(listBranchRestrictions).mockResolvedValue({
			data: {
				values: [
					{
						id: 1,
						kind: "push",
						pattern: "main",
						users: [{ uuid: "uuid1", display_name: "User 1" }],
					},
				],
			},
		} as any);

		vi.mocked(askId).mockResolvedValue(1);
		vi.mocked(askBranchPattern).mockResolvedValue("main");
		vi.mocked(askModifyExemptUsers).mockResolvedValue({
			addUsers: [],
			removeUsers: [],
		});
		vi.mocked(updateRepoBranchRestriction).mockRejectedValue(
			new Error("Update failed"),
		);

		await updateBranchRestriction(options);

		expect(logger.error).toHaveBeenCalledWith(
			"❌ Failed to update branch restriction: Error: Update failed",
		);
	});
});
