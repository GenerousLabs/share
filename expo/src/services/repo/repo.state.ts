import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RepoInRedux } from "../../shared.types";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const REDUCER_KEY = "repo" as const;

const repoAdapter = createEntityAdapter<RepoInRedux>();
const repoSelectors = repoAdapter.getSelectors(
  (state: RootState) => state.repo
);

const repoSlice = createSlice({
  name: "SHARE/repo",
  initialState: repoAdapter.getInitialState(),
  reducers: {
    upsertOneRepo: repoAdapter.upsertOne,
    updateOneRepo: repoAdapter.updateOne,
    setNewCommitHash: (
      state,
      action: PayloadAction<{ id: string; headCommitObjectId: string }>
    ) => {
      const { id, headCommitObjectId } = action.payload;
      state.entities[id]?.commitsAheadOfOrigin;
    },
  },
});

export const { upsertOneRepo, updateOneRepo } = repoSlice.actions;

export default repoSlice.reducer;

export const selectRepoById = repoSelectors.selectById;
export const selectAllRepos = repoSelectors.selectAll;

export const commitAllSagaAction = createAction<{
  repoId: string;
  message: string;
}>("SHARE/repo/commitAll");

export const commitAllErrorAction = makeErrorActionCreator(
  "SHARE/repo/commitAll"
);

export const loadRepoContentsSagaAction = createAction<{ repoId: string }>(
  "SHARE/repo/loadRepoContents"
);

export const loadRepoContentsErrorAction = createAction<{
  repoId: string;
  message: string;
}>("SHARE/repo/loadRepoContents/ERROR");

const LOAD_FROM_FS = "SHARE/repo/loadRepoFromFilesystem" as const;
export const loadRepoFromFilesystemSagaAction = createAction<{ path: string }>(
  LOAD_FROM_FS
);
export const loadRepoFromFilesystemErrorAction = makeErrorActionCreator(
  LOAD_FROM_FS
);
