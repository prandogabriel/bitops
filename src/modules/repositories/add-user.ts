import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

type Options = {
  repo: string;
  workspace: string;
  permission: string;
  userAccountId: string;
};

export const addUserToRepo = async (options: Options) => {
  console.log(options);
  
  logger.info("📁 adding user to repo: ", options.repo);

  const user = await bitbucket.getUser(options.userAccountId);
  console.log(user);
  
  const response = await bitbucket.addUserToRepo({
    workspace: options.workspace,
    repo_slug: options.repo,
    permission: options.permission ?? "read",
    selected_user_id: options.userAccountId,
  });

  logger.info(
    `📁 User added: ${response.data}`,
  );
};
