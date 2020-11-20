import matter from "gray-matter";
import invariant from "tiny-invariant";
import { gitFsHttp } from "../../shared.constants";
import { join, mkdirp } from "../fs/fs.service";
import { gitAddAndCommit, initNewRepo } from "../git/git.service";
import { Repo } from "./repo.state";

export default {};

export const initRepo = async ({
  path,
  repoId,
  uuid,
  title,
  descriptionMarkdown,
}: {
  path: string;
  repoId: string;
  uuid: string;
  title: string;
  descriptionMarkdown: string;
}): Promise<Repo> => {
  const { fs } = gitFsHttp;

  await mkdirp({ path });
  await initNewRepo({ path });

  const indexPath = join(path, "index.md");

  const markdownWithFrontmatter = matter.stringify(descriptionMarkdown, {
    title,
    uuid,
  });

  await fs.promises.writeFile(indexPath, markdownWithFrontmatter, {
    encoding: "utf8",
  });

  const newCommitHash = await gitAddAndCommit({
    message: "Creating new repo",
    dir: path,
  });
  invariant(newCommitHash, "Failed to save first commit to new repo #lnEwNk");

  // TODO Do we want to push this repo?

  return {
    headCommitObjectId: newCommitHash,
    lastFetchTimestamp: 0,
    path,
    title,
    descriptionMarkdown,
    uuid,
    repoId,
    commitsAheadOfOrigin: 0,
    commitsBehindOrigin: 0,
  };
};
