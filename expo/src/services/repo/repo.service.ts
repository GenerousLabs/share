import { KeysBase64 } from "git-encrypted";
import matter from "gray-matter";
import { simpleEncryptedClone } from "isomorphic-git-remote-encrypted";
import { gitFsHttp, REPOS_PATH, RepoType } from "../../shared.constants";
import {
  RepoInRedux,
  RepoOnDisk,
  RepoOnDiskFrontMatter,
} from "../../shared.types";
import { generateUuid } from "../../utils/id.utils";
import { assertNever } from "../../utils/never.utils";
import { join } from "../fs/fs.service";
import { gitGetCurrentCommit, gitPull } from "../git/git.service";
import { _createNewRepo } from "./_createNewRepo";

export const getRepoBasename = ({ id }: Pick<RepoInRedux, "id">) => {
  return id;
};

export const getRepoPath = (
  params:
    | { type: RepoType.me | RepoType.commands }
    | Pick<RepoInRedux, "id" | "type">
) => {
  switch (params.type) {
    case RepoType.me: {
      return join(REPOS_PATH, "me");
    }
    case RepoType.commands: {
      return join(REPOS_PATH, "commands");
    }
    case RepoType.library:
    case RepoType.connection: {
      return join(REPOS_PATH, getRepoBasename({ id: params.id }));
    }
  }
  assertNever(params);
};

// NOTE: This is weird, we should probably invoke a saga which in turn calls
// this function. Calling a function and then invoking a saga with its return
// value is weird.
// TODO Refactor this into a saga
export const createMeRepo = async () => {
  const uuid = generateUuid();
  const title = "Me";
  const bodyMarkdown = "This repo contains my configuration and settings.";
  const type = RepoType.me;
  const message = "Initial me commit. #bISz6d";

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
    message,
  });
};

export const createCommandsRepo = async () => {
  const uuid = generateUuid();
  const title = "Commands";
  const bodyMarkdown = "This repo contains commands I send to the server.";
  const type = RepoType.commands;
  const message = "Initial commands commit. #Eys6ql";

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
    encryptThisRepo: false,
    message,
  });
};

export const createLibraryRepo = async ({
  bodyMarkdown,
  title,
  uuid,
}: Omit<RepoOnDisk, "type"> & { basename: string }) => {
  const type = RepoType.library;
  const message = "Initial library commit. #cGqwkl";

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
    message,
  });
};

// TODO Figure out how this should work, this is really a stub
export const createConnectionRepo = async ({
  uuid,
  title,
  bodyMarkdown,
}: Omit<RepoOnDisk, "type"> & {
  mine: boolean;
}) => {
  const type = RepoType.connection;
  const message = "Initial connection commit. #PLezPT";

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
    message,
  });
};

// TODO Figure out how to get the data which is only in repos.yaml here
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
    bodyMarkdown: matterOutput.content,
    ...validatedData,
  } as RepoOnDisk;
};

export const cloneNewLibraryRepo = async ({
  path,
  remoteUrl,
}: {
  path: string;
  remoteUrl: string;
}) => {
  await simpleEncryptedClone({
    ...gitFsHttp,
    dir: path,
    url: remoteUrl,
  });
};

export const updateSubscribedRepo = async ({ path }: { path: string }) => {
  await gitPull({ path });
  const headCommit = await gitGetCurrentCommit({ path });
  return headCommit;
};
