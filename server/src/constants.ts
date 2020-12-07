import { join } from "path";

// NOTE: We need a `../` here because this gets run in the `dist/` folder
export const REPOS_ROOT = join(__dirname, "../data/repos");
export const ME_REPO_NAME = "me.git" as const;
