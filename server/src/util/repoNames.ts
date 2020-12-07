export const splitRepo = (repoPath: string): { org: string; repo: string } => {
  const pieces = repoPath.split("/");

  if (pieces.length !== 2) {
    throw new Error("Invalid repo name. #62kzMn");
  }

  const [org, repo] = pieces;

  if (org.length === 0 || repo.length === 0) {
    throw new Error("Invalid repo name. #dJviuB");
  }

  return { org, repo };
};
