import fs from "expo-fs";
import http from "isomorphic-git/http/web";
import { FS } from "./shared.types";
import Constants from "expo-constants";

const extra = Constants.manifest.extra || {};

const prodHost: string = extra.hostname;

const DEV_SERVER_PORT = "8000";

const [devHostWithoutPort] =
  typeof Constants.manifest.debuggerHost === "string"
    ? Constants.manifest.debuggerHost.split(":")
    : ":";
const devHost = `${devHostWithoutPort}:${DEV_SERVER_PORT}`;

const host = __DEV__ ? devHost : prodHost;

const logSagas = extra.logSagas || false;

export const CONFIG = {
  websiteUrl: `https://${host}`,
  postofficeUrl: `https://${host}/postoffice`,
  defaultRemote: {
    protocol: __DEV__ ? "http" : "https",
    host,
  },
  logSagas,
} as const;

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

export const SCROLLVIEW_INNER_BOTTOM_PADDING = 400;
