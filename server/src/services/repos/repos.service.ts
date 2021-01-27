import fs from "fs";
import yaml from "js-yaml";
import { join } from "path";
import {
  COMMANDS_REPO_NAME,
  ENOENT,
  MINIMUM_TOKEN_LENGTH,
  MINIMUM_USERNAME_LENGTH,
  READ_TOKENS_FILE_NAME,
  REPOS_ROOT,
  USER_TOKEN_PATH,
} from "../../constants";
import logger from "../../util/logger";
import { splitRepo } from "../../util/repoNames";

export const _getReadTokensPath = ({
  org,
  repo,
}: {
  org: string;
  repo: string;
}): string => {
  return join(REPOS_ROOT, org, COMMANDS_REPO_NAME, repo, READ_TOKENS_FILE_NAME);
};

export const _parseTokensYaml = ({
  input,
}: {
  input: string;
}): { [username: string]: string } => {
  const userTokenMap = yaml.safeLoad(input) as {
    [userId: string]: string;
  };

  const filteredEntries = Object.entries(userTokenMap).filter(
    ([username, token]) => {
      if (
        typeof username !== "string" ||
        username.length < MINIMUM_USERNAME_LENGTH ||
        typeof token !== "string" ||
        token.length < MINIMUM_TOKEN_LENGTH
      ) {
        logger.warn("Excluding invalid token #y7kmqs", { username, token });
        return false;
      }
      return true;
    }
  );

  const output = Object.fromEntries(filteredEntries);

  return output;
};

export const _getUserToken = async ({
  user,
}: {
  user: string;
}): Promise<string | undefined> => {
  const userTokensString = await fs.promises.readFile(USER_TOKEN_PATH, {
    encoding: "utf8",
  });

  const tokenMap = _parseTokensYaml({ input: userTokensString });

  if (user in tokenMap) {
    return tokenMap[user];
  }
};

export const _getReadTokensForRepo = async ({
  org,
  repo,
}: {
  org: string;
  repo: string;
}): Promise<string[]> => {
  const readTokensPath = _getReadTokensPath({ org, repo });
  try {
    const tokensString = await fs.promises.readFile(readTokensPath, {
      encoding: "utf8",
    });
    const tokens = tokensString.split("\n");
    return tokens;
  } catch (error) {
    if (error.code === ENOENT) {
      return [];
    }
    throw error;
  }
};

/**
 * Check if a user can read this repository.
 *
 * Look up the commands repo for this user, get the tokens file for this repo
 * (if it exists), and check if the supplied token is valid.
 */
export const getIsValidReadToken = async ({
  repoPath,
  token,
}: {
  repoPath: string;
  token: string;
}): Promise<boolean> => {
  const { org, repo } = splitRepo(repoPath);

  const tokens = await _getReadTokensForRepo({ org, repo });

  if (tokens.includes(token)) {
    return true;
  }

  return false;
};

/**
 * Check if a user can write to this repo.
 *
 * Look up the server's commands repo, get the tokens yaml dict, check if this
 * token is valid for this user.
 */
export const getIsValidWriteToken = async ({
  repoPath,
  token,
}: {
  repoPath: string;
  token: string;
}): Promise<boolean> => {
  const { org } = splitRepo(repoPath);
  const userToken = await _getUserToken({ user: org });

  if (userToken === token) {
    return true;
  }

  return false;
};
