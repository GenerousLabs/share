import { encryptedInit, getKeysFromDisk } from "git-encrypted";
import matter from "gray-matter";
import {
  gitApi,
  simplePushWithOptionalEncryption,
} from "isomorphic-git-remote-encrypted";
import { gitFsHttp, RepoType } from "../../shared.constants";
import { RepoInRedux, RepoOnDisk } from "../../shared.types";
import { doesDirectoryExist, join, mkdirp } from "../fs/fs.service";
import { gitInitNewRepo, gitSetRemote } from "../git/git.service";
import { createNewRemoteForRepo } from "../git/services/remote/remote.service";
import { getRepoPath } from "./repo.service";

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
}: RepoOnDisk) => {
  const { fs } = gitFsHttp;

  if (__DEV__)
    console.log("repo.servce / initRepo() invoked #eQ4V3I", {
      title,
      type,
      uuid,
      bodyMarkdown,
    });

  const path = getRepoPath({ uuid, type });

  const pathExists = await doesDirectoryExist({ path });
  if (pathExists) {
    throw new Error("Trying to create repo that already exists. #VMTD9k");
  }

  const gitdir = join(path, ".git");

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

  const meRepoRemote = await createNewRemoteForRepo({
    repo: { uuid, type },
  });

  // NOTE: The `encryptedRemoteUrl` does not have the `encrypted::` prefix,
  // because that's the remote URL as seen from the perspective of the "source"
  // repository.
  const encryptedRemoteUrl = meRepoRemote.url;
  const remoteUrl = `encrypted::${encryptedRemoteUrl}`;

  /**
   * TODO Fold these 2 functions into 1 and move to isomorphic-git-remote-encrypted
   */
  await encryptedInit({
    ...gitFsHttp,
    encryptedRemoteUrl,
    gitApi,
    gitdir,
  });

  await gitSetRemote({
    path,
    remoteUrl,
  });

  await simplePushWithOptionalEncryption({
    ...gitFsHttp,
    gitdir,
    ref: "refs/heads/master",
    remoteRef: "refs/heads/master",
    remote: "origin",
  });

  return {
    id,
    uuid,
    path,
    isReadOnly: false,
    remoteUrl,
  };
};
