import { createAction } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const commitAll = createAction<{ repoId: string; message: string }>(
  "SHARE/repo/commitAll"
);

export const commitAllError = makeErrorActionCreator("SHARE/repo/commitAll");

export const loadRepoContents = createAction<{ repoId: string }>(
  "SHARE/repo/loadRepoContents"
);

export const loadRepoContentsError = createAction<{
  repoId: string;
  message: string;
}>("SHARE/repo/loadRepoContents/ERROR");
