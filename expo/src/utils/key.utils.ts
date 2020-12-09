import { getKeysFromDisk, keysToBase64 } from "git-encrypted";
import { getIsEncryptedRemoteUrl } from "isomorphic-git-remote-encrypted";
import { join } from "../services/fs/fs.service";
import { getRepoPath } from "../services/repo/repo.service";
import { gitFsHttp } from "../shared.constants";
import { RepoInRedux } from "../shared.types";

const { fs } = gitFsHttp;

export const getKeysIfEncryptedRepo = async ({
  repo,
}: {
  repo: RepoInRedux;
}) => {
  const { isEncryptedRemote } = getIsEncryptedRemoteUrl(repo.remoteUrl);

  if (!isEncryptedRemote) {
    return;
  }
  const repoPath = getRepoPath({ id: repo.id, type: repo.type });
  const gitdir = join(repoPath, ".git");
  // NOTE: Not all repos are encrypted, almost all, but not quite all
  const keys = await getKeysFromDisk({ fs, gitdir });
  const keysBase64 = keysToBase64({ keys });
  return keysBase64;
};
