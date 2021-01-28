/**
 * One day this might become extensible. For now, we assume a standard layout.
 */

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
 * Return a SIMPLE url, not an `encrypted::` prefixed URL.
 */
export const createRemoteUrlForSharedRepo = async ({
  repo: { type, uuid },
  token,
}: {
  repo: Pick<RepoInRedux, "type" | "uuid">;
  token: string;
}) => {
  const {
    remote: { protocol, host, username },
  } = await getConfigFromFilesystem();
  const repoName = uuid;
  return createRemoteUrl({ protocol, token, host, username, repoName });
};

export const getPostofficeUrl = async () => {
  const config = await getConfigFromFilesystem();
  const url = `${config.remote.protocol}://${config.remote.host}/postoffice`;
  return url;
};
