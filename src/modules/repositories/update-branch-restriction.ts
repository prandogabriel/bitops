import {
	listBranchRestrictions,
	updateRepoBranchRestriction,
} from "@libs/bitbucket";
import { logger } from "@libs/logger";
import { askBranchPattern, askId, askModifyExemptUsers } from "@utils/inquirer";

type Options = {
	repo: string;
	workspace: string;
};

export const updateBranchRestriction = async (options: Options) => {
	const { repo, workspace } = options;
	const branchRestrictions = await listBranchRestrictions({
		repo_slug: repo,
		workspace,
	});

	if (
		!branchRestrictions.data.values ||
		branchRestrictions.data.values.length === 0
	) {
		logger.info(
			"No branch restrictions found for this repository, please create one first.",
		);
		return;
	}

	logger.info("📜 Available branch restrictions: ");
	for (const branch of branchRestrictions.data.values) {
		logger.info(
			`🔹 ID: ${branch.id} | Type: ${branch.kind} | Branch: ${branch.pattern} | Exempt Users: ${
				branch.users?.map((u) => u.display_name).join(", ") || "None"
			}`,
		);
	}

	const ids = branchRestrictions.data.values.map(
		(branch) => branch.id,
	) as number[];

	const id = await askId("update", ids);

	if (!id) {
		logger.error("⚠️ No valid ID selected, exiting...");
		return;
	}

	const actualValue = branchRestrictions.data.values.find(
		(branch) => branch.id === id,
	);

	const branchPattern = await askBranchPattern(
		(actualValue?.pattern as string) ?? "",
	);

	const { addUsers, removeUsers } = await askModifyExemptUsers(
		(actualValue?.users?.map((u) => ({
			uuid: u.uuid,
			displayName: u.display_name,
		})) ?? []) as { uuid: string; displayName: string }[],
	);

	logger.info("🔄 Processing user modifications...");

	const currentUsers =
		actualValue?.users?.map((u) => ({
			uuid: u.uuid,
			displayName: u.display_name,
		})) ?? [];

	const updatedUsers = [
		...new Set(
			[...currentUsers, ...addUsers].filter(
				(user) => !removeUsers.includes(user.uuid),
			),
		),
	];

	logger.info(
		`Updating branch restriction ${id} with pattern "${branchPattern}" and exempt users: ${
			updatedUsers.map((u) => u.displayName).join(", ") || "None"
		}...`,
	);

	try {
		await updateRepoBranchRestriction({
			id,
			pattern: branchPattern,
			users: updatedUsers,
			repo_slug: repo,
			workspace,
		});
		logger.info("✅ Branch restriction updated successfully!");
	} catch (error) {
		let errorMessages = "";
		if (error instanceof Error) {
			error.stack = undefined;
			errorMessages = JSON.stringify(error);
		}
		logger.error(`❌ Failed to update branch restriction: ${errorMessages}`);
	}
};
