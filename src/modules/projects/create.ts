import * as bitbucket from "@libs/bitbucket";
import { logger } from "@libs/logger";

export const createProject = async (name: string) => {
  logger.info("📁 Creating project: name...");

  const response = await bitbucket.createProject(name);

  logger.info(`📁 Project created, you can access on: ${response.links?.html?.href}`);
}