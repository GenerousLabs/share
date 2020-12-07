import { encryptedInit } from "git-encrypted";
import matter from "gray-matter";
import { gitApi } from "isomorphic-git-remote-encrypted";
import { gitFsHttp } from "../../shared.constants";
import { RepoInRedux, RepoOnDisk } from "../../shared.types";
import { getTimestampSeconds } from "../../utils/time.utils";
import { doesDirectoryExist, join } from "../fs/fs.service";
import {
  gitAddAndCommit,
  gitInitNewRepo,
  gitPush,
  gitSetRemote,
} from "../git/git.service";
import { rootLogger } from "../log/log.service";
import { createNewRemoteForRepo } from "../remote/remote.service";
import { getRepoPath } from "./repo.service";

const log = rootLogger.extend("_createNewRepo");

/**
 * Create the new directory, call git init, and then save the repo details into
 * the `/index.md` file. If `keys` are not supplied, they will be created.
 * NOTE: This function creates the file, but does not commit anything into the
 * new repo. The commit action should be dispatched immediately after this.
 */

export const _createNewRepo = async ({
  uuid,
  title,
  type,
  bodyMarkdown,
  encryptThisRepo = true,
}: RepoOnDisk & { encryptThisRepo?: boolean }): Promise<RepoInRedux> => {
  const { fs } = gitFsHttp;
  const now = getTimestampSeconds();

  log.debug("repo.servce / initRepo() invoked #eQ4V3I", {
    title,
    type,
    uuid,
    bodyMarkdown,
  });

  const path = getRepoPath({ id: uuid, type });

  const pathExists = await doesDirectoryExist({ path });
  if (pathExists) {
    throw new Error("Trying to create repo that already exists. #VMTD9k");
  }

  const gitdir = join(path, ".git");

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

  const meRepoRemote = await createNewRemoteForRepo({
    repo: { uuid, type },
  });

  // NOTE: The `encryptedRemoteUrl` does not have the `encrypted::` prefix,
  // because that's the remote URL as seen from the perspective of the "source"
  // repository.
  const encryptedRemoteUrl = encryptThisRepo ? meRepoRemote.url : undefined;
  const remoteUrl = encryptThisRepo
    ? `encrypted::${encryptedRemoteUrl}`
    : meRepoRemote.url;

  // NOTE: This style of if syntax is required for TypeScript to accept that
  // inside this block `encryptedRemoteUrl` is a string.
  if (typeof encryptedRemoteUrl === "string") {
    await encryptedInit({
      ...gitFsHttp,
      encryptedRemoteUrl,
      gitApi,
      gitdir,
    });
  }

  await gitSetRemote({
    path,
    remoteUrl,
  });

  const newCommitHash = await gitAddAndCommit({
    message: "Initial me commit. #bISz6d",
    dir: path,
  });

  if (typeof newCommitHash !== "string") {
    log.error("Failed to commit while creating repo #FFplUv", {
      uuid,
      title,
      type,
      bodyMarkdown,
      path,
    });
    throw new Error("Failed to commit while creating repo #f2zvVQ");
  }

  await gitPush({ path: path });

  return {
    id,
    uuid,
    isReadOnly: false,
    remoteUrl,
    bodyMarkdown,
    name: title,
    title,
    type,
    headCommitObjectId: newCommitHash,
    commitsAheadOfOrigin: 0,
    lastFetchTimestamp: now,
  };
};
