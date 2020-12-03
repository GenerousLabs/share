/**
 * One day this might become extensible. For now, we assume a standard layout.
 */

import { RepoType } from "../../shared.constants";
import { RepoInRedux } from "../../shared.types";
import { getConfigFromFilesystem } from "../config/config.service";

/**
 * In theory, this function could call an API to request a new repo, be given a
 * new token to authenticate, and so on. For now, we use one token everywhere.
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

  return {
    url: `${protocol}://u:${token}@${host}/${username}/${repoName}.git`,
  };
};
