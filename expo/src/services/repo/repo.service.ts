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
}) => {
  const { fs } = gitFsHttp;

  if (__DEV__)
    console.log("repo.servce / initRepo() invoked #eQ4V3I", { path });

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
};
