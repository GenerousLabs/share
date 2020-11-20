import { createAction } from "@reduxjs/toolkit";

export const commitAll = createAction<{ repoId: string; message: string }>(
  "SHARE/repo/commitAll"
);

export const commitAllError = createAction<{ repoId: string; message: string }>(
  "SHARE/repo/commitAll/ERROR"
);
