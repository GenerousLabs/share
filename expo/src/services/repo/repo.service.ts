import { KeysBase64 } from "git-encrypted";
import matter from "gray-matter";
import { simpleEncryptedClone } from "isomorphic-git-remote-encrypted";
import { v4 as generateUuid } from "uuid";
import { gitFsHttp, REPOS_PATH, RepoType } from "../../shared.constants";
import {
  RepoInRedux,
  RepoOnDisk,
  RepoOnDiskFrontMatter,
} from "../../shared.types";
import { assertNever } from "../../utils/never.utils";
import { join } from "../fs/fs.service";
import { _createNewRepo } from "./_createNewRepo";

export const getRepoPath = ({ id, type }: { id: string; type: RepoType }) => {
  switch (type) {
    case RepoType.me: {
      return join(REPOS_PATH, "me");
    }
    case RepoType.commands: {
      return join(REPOS_PATH, "commands");
    }
    case RepoType.library:
    case RepoType.connection: {
      return join(REPOS_PATH, id);
    }
  }
  assertNever(type);
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

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
  });
};

export const createCommandsRepo = async () => {
  const uuid = generateUuid();
  const title = "Commands";
  const type = RepoType.commands;
  const bodyMarkdown = "This repo contains commands I send to the server.";

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
    encryptThisRepo: false,
  });
};

export const createLibraryRepo = async ({
  bodyMarkdown,
  title,
  uuid,
}: Omit<RepoOnDisk, "type"> & { basename: string }) => {
  const type = RepoType.library;

  return _createNewRepo({
    title,
    uuid,
    type,
    bodyMarkdown,
  });
};

// TODO Figure out how this should work, this is really a stub
export const createConnectionRepo = async ({
  bodyMarkdown,
  title,
  uuid,
}: Omit<RepoOnDisk, "type"> & {
  connectionBasename: string;
  mine: boolean;
}) => {
  throw new Error("Not yet properly implemented #UoD9Qz");
  const type = RepoType.connection;

  const commitHash = await _createNewRepo({
    title,
    uuid,
    type: RepoType.connection,
    bodyMarkdown,
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
    id: validatedData.uuid,
    bodyMarkdown: matterOutput.content,
    ...validatedData,
  } as RepoOnDisk & Pick<RepoInRedux, "id">;
};

export const cloneNewLibraryRepo = async ({
  path,
  remoteUrl,
  keysBase64,
}: {
  path: string;
  remoteUrl: string;
  keysBase64: KeysBase64;
}) => {
  await simpleEncryptedClone({
    ...gitFsHttp,
    dir: path,
    url: remoteUrl,
    keysBase64,
  });
};
