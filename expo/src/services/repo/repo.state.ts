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

const CREATE_REPO = "SHARE/repo/createRepo" as const;
export const createRepo = createAction<{
  path: string;
  repoId: string;
  uuid: string;
  title: string;
  bodyMarkdown: string;
}>(CREATE_REPO);
export const createRepoError = makeErrorActionCreator(CREATE_REPO);

const LOAD_FROM_FS = "SHARE/repo/loadRepoFromFilesystem" as const;
export const loadRepoFromFilesystem = createAction<{ path: string }>(
  LOAD_FROM_FS
);
export const loadRepoFromFilesystemError = makeErrorActionCreator(LOAD_FROM_FS);
