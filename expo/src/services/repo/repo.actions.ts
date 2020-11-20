import { createAction } from "@reduxjs/toolkit";

export const commitAll = createAction<{ repoId: string; message: string }>(
  "SHARE/repo/commitAll"
);
