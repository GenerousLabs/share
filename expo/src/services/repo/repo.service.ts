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
  bodyMarkdown,
}: {
  path: string;
  repoId: string;
  uuid: string;
  title: string;
  bodyMarkdown: string;
}) => {
  const { fs } = gitFsHttp;

  if (__DEV__)
    console.log("repo.servce / initRepo() invoked #eQ4V3I", { path });

  await mkdirp({ path });
  await initNewRepo({ path });

  const indexPath = join(path, "index.md");

  const markdownWithFrontmatter = matter.stringify(bodyMarkdown, {
    title,
    uuid,
  });

  await fs.promises.writeFile(indexPath, markdownWithFrontmatter, {
    encoding: "utf8",
  });
};

export const getRepoParamsFromFilesystem = async ({
  path,
}: {
  path: string;
}) => {
  const { fs } = gitFsHttp;

  const indexPath = join(path, "index.md");

  const markdownWithFrontmatter = (await fs.promises.readFile(indexPath, {
    encoding: "utf8",
  })) as string;

  const matterOutput = matter(markdownWithFrontmatter);
  const data = matterOutput.data as Partial<
    Omit<Repo, "repoId" | "path" | "bodyMarkdown">
  >;

  // TODO Properly validate data here
  const validatedData = data as Omit<Repo, "repoId" | "path" | "bodyMarkdown">;

  return {
    repoId: path,
    path,
    bodyMarkdown: matterOutput.content,
    ...data,
  } as Repo;
};
