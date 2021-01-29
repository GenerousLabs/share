import fs from "expo-fs";
import http from "isomorphic-git/http/web";
import { FS } from "./shared.types";

export const REPOS_PATH = "/repos/" as const;
export const LOGS_PATH = "/logs/" as const;
export const ALL_PATHS = [REPOS_PATH, LOGS_PATH] as const;

export const PATH_SEPARATOR = "/" as const;

export const gitFsHttp = { fs: (fs as unknown) as FS, http };

export const ENOENT = "ENOENT" as const;

export const GIT_AUTHOR_NAME = "Generous User" as const;

// This is an enum in TypeScript and then a plain object in JavaScript
export enum RepoType {
  me = "me",
  commands = "commands",
  library = "library",
  connection = "connection",
}

// NOTE: These 3 are copied to `server/src/constants.ts` file and must be
// manually kept in sync in both.
export const READ_TOKENS_FILE_NAME = "read_tokens.txt" as const;
export const MINIMUM_USERNAME_LENGTH = 3 as const;
export const MINIMUM_TOKEN_LENGTH = 20 as const;

export const INVITE_PREFIX = "INVITE_" as const;

export const POSTOFFICE_MESSAGE_SEPARATOR = ":" as const;
