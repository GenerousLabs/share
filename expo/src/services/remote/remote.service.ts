/**
 * One day this might become extensible. For now, we assume a standard layout.
 */

import { getIsEncryptedRemoteUrl } from "isomorphic-git-remote-encrypted";
import { RepoType } from "../../shared.constants";
import { RepoInRedux } from "../../shared.types";
import { getConfigFromFilesystem } from "../config/config.service";

export const createRemoteUrl = ({
  protocol,
  token,
  host,
  username,
  repoName,
}: {
  protocol: string;
  token: string;
  host: string;
  username: string;
  repoName: string;
}) => {
  return {
    url: `${protocol}://u:${token}@${host}/${username}/${repoName}.git`,
  };
};

/**
 * In theory, this function could call an API to request a new repo, be given a
 * new token to authenticate, and so on. For now, we use one token everywhere.
 *
 * Return a SIMPLE url, not an `encrypted::` prefixed URL.
 */
export const createNewRemoteForRepo = async ({
  repo: { type, uuid },
}: {
  repo: Pick<RepoInRedux, "type" | "uuid">;
}): Promise<{
  url: string;
}> => {
  const {
    remote: { protocol, host, token, username },
  } = await getConfigFromFilesystem();

  const repoName =
    type === RepoType.me
      ? "me"
      : type === RepoType.commands
      ? "commands"
      : uuid;

  return createRemoteUrl({ protocol, token, host, username, repoName });
};

/**
 * Return a remote url like `encrypted::pass::url`
 */
export const createRemoteUrlForSharedRepo = async ({
  repo: { type, uuid, remoteUrl },
  token,
}: {
  repo: Pick<RepoInRedux, "type" | "uuid" | "remoteUrl">;
  token: string;
}) => {
  const {
    remote: { protocol, host, username },
  } = await getConfigFromFilesystem();

  if (type === RepoType.commands || type === RepoType.me) {
    throw new Error("Cannot share me or commands repos #V87yna");
  }

  const { isEncryptedRemote, keyDerivationPassword } = getIsEncryptedRemoteUrl(
    remoteUrl
  );

  if (!isEncryptedRemote) {
    throw new Error("Cannot share unencrypted repo #qgLK0q");
  }
  if (typeof keyDerivationPassword === "undefined") {
    throw new Error(
      "Cannot share repo without key derivation password #ApcrZY"
    );
  }

  const repoName = uuid;
  const { url: sharedRemoteUrl } = createRemoteUrl({
    protocol,
    token,
    host,
    username,
    repoName,
  });

  const output = `encrypted::${keyDerivationPassword}::${sharedRemoteUrl}`;

  return output;
};
