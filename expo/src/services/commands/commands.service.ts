import * as zod from "zod";
import {
  MINIMUM_TOKEN_LENGTH,
  READ_TOKENS_FILE_NAME,
  RepoType,
} from "../../shared.constants";
import { RepoInRedux } from "../../shared.types";
import { appendLineTofile, join } from "../fs/fs.service";
import { getRepoBasename, getRepoPath } from "../repo/repo.service";

export const _getReadAuthFilePath = (repo: RepoInRedux) => {
  const basename = getRepoBasename(repo);

  const commandsRepoPath = getRepoPath({ type: RepoType.commands });

  return join(commandsRepoPath, basename, READ_TOKENS_FILE_NAME);
};

export const _tokenSchema = zod
  .string()
  .nonempty()
  .min(MINIMUM_TOKEN_LENGTH, { message: "Token is too short #r6wall" });

export const addReadAuthTokenForRepo = async ({
  repo,
  token,
}: {
  repo: RepoInRedux;
  token: string;
}) => {
  _tokenSchema.parse(token);

  const tokenFilePath = _getReadAuthFilePath(repo);

  await appendLineTofile({
    filepath: tokenFilePath,
    line: token,
  });
};
