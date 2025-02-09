import { registerProjectCommand } from "@commands/project";
import { registerRepoCommand } from "@commands/repo";
import { logger } from "@libs/logger";
import { Command } from "commander";
import { describe, expect, it, vi } from "vitest";
import { registerLoginCommand } from "./commands/login";
import { registerNewCommand } from "./commands/new";

vi.mock("@commands/project");
vi.mock("@commands/repo");
vi.mock("./commands/login");
vi.mock("./commands/new");
vi.mock("@libs/logger");

describe("CLI tool", () => {
  it("should register all commands and parse arguments", async () => {
    const program = new Command();
    const parseAsyncSpy = vi.spyOn(program, "parseAsync");

    registerNewCommand(program);
    registerLoginCommand(program);
    registerProjectCommand(program);
    registerRepoCommand(program);

    await program.parseAsync(["node", "index.js"]);

    expect(registerNewCommand).toHaveBeenCalledWith(program);
    expect(registerLoginCommand).toHaveBeenCalledWith(program);
    expect(registerProjectCommand).toHaveBeenCalledWith(program);
    expect(registerRepoCommand).toHaveBeenCalledWith(program);
    expect(parseAsyncSpy).toHaveBeenCalledWith(["node", "index.js"]);
  });
});
