import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

// TODO pass a object with {name, description, key} provide by options
export const createRepo = async (name: string, project: string) => {
  logger.info("📁 Creating repo: name...");

  const response = await bitbucket.createRepo(name, project);

  logger.info(`📁 repo created, you can access on: ${response.data.links?.html?.href}`);
}