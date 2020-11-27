import fs from "expo-fs";
import http from "isomorphic-git/http/web";

export const PATH_SEPARATOR = "/" as const;

export const gitFsHttp = { fs, http };

export const ENOENT = "ENOENT" as const;

export const GIT_AUTHOR_NAME = "Generous User" as const;

// This is an enum in TypeScript and then a plain object in JavaScript
export enum RepoType {
  me = "me",
  control = "control",
  library = "library",
  connectoin = "connection",
}
