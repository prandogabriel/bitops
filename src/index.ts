#!/usr/bin/env node
import { registerProjectCommand } from "@commands/project";
import { logger } from "@libs/logger";
import { Command } from "commander";
import { registerLoginCommand } from "./commands/login";
import { registerNewCommand } from "./commands/new";

const program = new Command();

program
	.version("0.1.0")
	.description("BitOps a CLI tool for interacting with Bitbucket");

registerNewCommand(program);
registerLoginCommand(program);
registerProjectCommand(program);

program.parseAsync(process.argv).catch((error) => {
	logger.error(error);
});
