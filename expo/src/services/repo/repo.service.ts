import matter from "gray-matter";
import { v4 as generateUuid } from "uuid";
import { gitFsHttp, RepoType } from "../../shared.constants";
import {
  RepoInRedux,
  RepoOnDisk,
  RepoOnDiskFrontMatter,
} from "../../shared.types";
import { doesDirectoryExist, join, mkdirp } from "../fs/fs.service";
import { gitInitNewRepo } from "../git/git.service";

/**
 * Create the new directory, call git init, and then save the repo details into
 * the `/index.md` file.
 */
export const _createRepo = async ({
  path,
  uuid,
  title,
  type,
  bodyMarkdown,
}: RepoOnDisk & { path: string }) => {
  const { fs } = gitFsHttp;

  if (__DEV__)
    console.log("repo.servce / initRepo() invoked #eQ4V3I", {
      path,
      title,
      type,
      uuid,
      bodyMarkdown,
    });

  const pathExists = await doesDirectoryExist({ path });
  if (pathExists) {
    throw new Error("Trying to create repo that already exists. #VMTD9k");
  }

  await mkdirp({ path });
  await gitInitNewRepo({ path });

  const indexPath = join(path, "index.md");

  const markdownWithFrontmatter = matter.stringify(bodyMarkdown, {
    title,
    type,
    uuid,
  });

  await fs.promises.writeFile(indexPath, markdownWithFrontmatter, {
    encoding: "utf8",
  });

  // NOTE: We might choose some local id generation in the future. These IDs are
  // not supposed to be persistent, but only unique within our redux
  // collections.
  const id = uuid;

  return {
    id,
    uuid,
    path,
  };
};

export const createMeRepo = async (): Promise<RepoInRedux> => {
  const uuid = generateUuid();
  const title = "me";
  const path = "/repos/me/";
  const bodyMarkdown = "This repo contains my configuration and settings.";
  const type = RepoType.me;

  const repo = await _createRepo({
    path,
    title,
    uuid,
    type,
    bodyMarkdown,
  });

  return {
    basename: "me",
    title,
    bodyMarkdown,
    type,
    ...repo,
  };
};

export const createControlRepo = async (): Promise<RepoInRedux> => {
  const uuid = generateUuid();
  const path = "/repos/control/";
  const title = "control";
  const type = RepoType.control;
  const bodyMarkdown = "This repo contains commands I send to the server.";

  const repo = await _createRepo({
    path,
    title,
    uuid,
    type,
    bodyMarkdown,
  });

  return {
    basename: "me",
    title,
    bodyMarkdown,
    type,
    ...repo,
  };
};

export const createLibraryRepo = async ({
  bodyMarkdown,
  title,
  uuid,
  basename,
}: Omit<RepoOnDisk, "type"> & { basename: string }): Promise<RepoInRedux> => {
  const path = join("/repos/mine/", basename);
  const type = RepoType.library;

  const repo = await _createRepo({
    path,
    title,
    uuid,
    type,
    bodyMarkdown,
  });

  return {
    basename,
    title,
    bodyMarkdown,
    type,
    ...repo,
  };
};

export const createConnectionRepo = async ({
  bodyMarkdown,
  title,
  uuid,
  connectionBasename,
  mine,
}: Omit<RepoOnDisk, "type"> & {
  connectionBasename: string;
  mine: boolean;
}) => {
  const path = join(
    "/repos/connections/",
    connectionBasename,
    mine ? "mine" : "theirs"
  );

  const commitHash = await _createRepo({
    path,
    title,
    uuid,
    type: RepoType.connectoin,
    bodyMarkdown,
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
  const data = matterOutput.data as Partial<RepoOnDiskFrontMatter>;

  // TODO Properly validate data here
  const validatedData = data as RepoOnDiskFrontMatter;

  return {
    id: validatedData.uuid,
    path,
    bodyMarkdown: matterOutput.content,
    ...validatedData,
  } as RepoInRedux;
};
