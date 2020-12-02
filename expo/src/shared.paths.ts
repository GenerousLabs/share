import { join } from "./services/fs/fs.service";

export const REPOS_PATH = "/repos/";
export const ME_REPO_PATH = join(REPOS_PATH, "me");
export const ME_REPO_GITDIR = join(ME_REPO_PATH, ".git");
export const COMMANDS_REPO_PATH = join(REPOS_PATH, "commands");
export const COMMANDS_REPO_GITDIR = join(COMMANDS_REPO_PATH, ".git");
