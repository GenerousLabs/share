/**
 * One day this might become extensible. For now, we assume a standard layout.
 */

import { RepoType } from "../../../../shared.constants";
import { Headers } from "../../../../shared.types";
import { getConfigFromFilesystem } from "../../../config/config.service";

export const getRemoteParamsForRepo = async ({
  repoUuid,
}: {
  repoUuid: string;
  repoType: RepoType;
  repoBasename: string;
}): Promise<{
  url: string;
  headers: Headers;
}> => {
  const { remote } = await getConfigFromFilesystem();

  // TODO What about library repos? Do we need to get their tokens...
  // - Maybe not, maybe this is only for our "own" repos?

  // const protocol = remote.hostname.startsWith("localhost:") ? "http" : "https";
  // DEV - Hardcode this for now
  const protocol = "http";

  // return `https://u:${remote.token}@${remote.hostname}/${remote.username}/${repoUuid}`;
  return {
    url: `${protocol}://${remote.hostname}/${remote.username}/${repoUuid}.git`,
    headers: {
      Authorization: `Bearer ${remote.token}`,
    },
  };
};
