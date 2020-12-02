import fs from "expo-fs";
import http from "isomorphic-git/http/web";
import { FS } from "./shared.types";

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
  subscription = "subscription",
}
