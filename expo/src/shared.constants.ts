import fs from "expo-fs";
import http from "isomorphic-git/http/web";

export const PATH_SEPARATOR = "/" as const;

export const gitFsHttp = { fs, http };