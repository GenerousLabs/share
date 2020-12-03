import Bluebird from "bluebird";
import git from "isomorphic-git";
import { simplePushWithOptionalEncryption } from "isomorphic-git-remote-encrypted";
import { gitFsHttp, GIT_AUTHOR_NAME } from "../../shared.constants";
import { GitParams } from "../../shared.types";
import { join } from "../fs/fs.service";

export type StatusMatrixLine = [string, 0 | 1, 0 | 1 | 2, 0 | 1 | 2 | 3];
export type StatusMatrix = StatusMatrixLine[];

export const gitAddAllFromStatusMatrix = async (
  params: {
    statusMatrix: StatusMatrix;
  } & GitParams
) => {
  const { statusMatrix, ...gitBaseParams } = params;

  const linesWithChanges = await Bluebird.filter(statusMatrix, async (row) => {
    const [filepath, headStatus, workdirStatus, stageStatus] = row;

    // If all status rows are 1, nothing to do, this file is up to date
    if (headStatus === 1 && workdirStatus === 1 && stageStatus === 1) {
      return false;
    }

    // If this file is not up to date in the index, add it to the index now
    if (stageStatus !== 2) {
      await git.add({ ...gitFsHttp, ...gitBaseParams, filepath });
    }

    return true;
  });

  if (linesWithChanges.length > 0) {
    return true;
  }
  return false;
};

/**
 * `git add . && git commit message`
 *
 * @returns Boolean True if a new commit was made, false if not
 */
export const gitAddAndCommit = async (
  params: { message: string } & GitParams
) => {
  const { message, ...gitBaseParams } = params;

  const statusMatrix = await git.statusMatrix({
    ...gitFsHttp,
    ...gitBaseParams,
  });

  const filesToCommit = await gitAddAllFromStatusMatrix({
    ...gitBaseParams,
    statusMatrix,
  });

  if (filesToCommit) {
    const newCommitHash = await git.commit({
      ...gitFsHttp,
      ...params,
      author: {
        name: GIT_AUTHOR_NAME,
      },
    });
    return newCommitHash;
  }
  return;
};

export const gitInitNewRepo = async ({ path }: { path: string }) => {
  const { fs } = gitFsHttp;
  await git.init({ fs, dir: path });
};

/**
 * Given a source repo git directory, set the remote URL (prefixed with
 * `encrypted::`).
 */
export const gitSetRemote = async ({
  path,
  remoteUrl,
}: {
  path: string;
  remoteUrl: string;
}) => {
  const { fs } = gitFsHttp;
  const gitdir = join(path, ".git");

  await git.addRemote({
    fs,
    gitdir,
    remote: "origin",
    url: remoteUrl,
    force: true,
  });
};

/**
 * A simple equivalent to `git push` which always uses the `master` branch and
 * the `origin` remote.
 */
export const gitPush = async ({ path }: { path: string }) => {
  const gitdir = join(path, ".git");
  return simplePushWithOptionalEncryption({
    ...gitFsHttp,
    gitdir,
    ref: "refs/heads/master",
    remoteRef: "refs/heads/master",
    remote: "origin",
  });
};

/**
 * A simple equivalent to `git pull` which always uses the `master` branch and
 * the `origin` remote.
 */
export const gitPull = async ({ path }: { path: string }) => {
  const gitdir = join(path, ".git");
  throw new Error("Not yet properly implemented. #G70M4T");
};
