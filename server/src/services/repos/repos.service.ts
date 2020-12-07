/* eslint-disable @typescript-eslint/camelcase */
import fs from "fs";
import { join } from "path";
import { constants, readConfigFromFile } from "plans";
import { ME_REPO_NAME, REPOS_ROOT } from "../../constants";
import logger from "../../util/logger";
import { splitRepo } from "../../util/repoNames";

export const getRepoPath = ({ org, repo }: { org: string; repo: string }) => {
  return join(REPOS_ROOT, org, repo);
};

export const addConfigFileToRepoPath = (repoPath: string) =>
  join(repoPath, constants.CONFIG_FILENAME);

export const getConfigForRepoPath = async (repoPath: string) => {
  try {
    const { org } = splitRepo(repoPath);

    const diskPath = getRepoPath({ org, repo: ME_REPO_NAME });
    const configFilePath = addConfigFileToRepoPath(diskPath);

    // NOTE: We `return await` here to ensure that the catch block in this try /
    // catch is triggered if this throws.
    return await readConfigFromFile({ fs, configFilePath });
  } catch (error) {
    logger.error("Error loading config #OM0gH6", error);
    throw new Error("Auth fail. #kdmkwX");
  }
};

export const checkReadPermissions = async ({
  repoPath,
  token,
}: {
  repoPath: string;
  token: string;
}) => {
  const { private_token, sharing_token } = await getConfigForRepoPath(repoPath);

  if (token === private_token || token === sharing_token) {
    return true;
  }
  throw new Error("Auth failure. #qcSHbN");
};

export const checkWritePermissions = async ({
  repoPath,
  token,
}: {
  repoPath: string;
  token: string;
}) => {
  const { private_token } = await getConfigForRepoPath(repoPath);

  if (token === private_token) {
    return true;
  }
  throw new Error("Auth failure. #XEWrYH");
};
