import { join } from "./services/fs/fs.service";

export const REPOS_PATH = "/repos/";
export const ME_REPO_PATH = join(REPOS_PATH, "me");
export const ME_REPO_GITDIR = join(ME_REPO_PATH, ".git");
export const CONTROL_REPO_PATH = join(REPOS_PATH, "control");
export const CONTROL_REPO_GITDIR = join(CONTROL_REPO_PATH, ".git");
