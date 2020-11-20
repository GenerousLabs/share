import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const REDUCER_KEY = "repo" as const;

export type Repo = {
  repoId: string;
  uuid: string;
  title: string;
  descriptionMarkdown: string;
  path: string;
  commitsAheadOfOrigin?: number;
  commitsBehindOrigin?: number;
  headCommitObjectId: string;
  lastFetchTimestamp: number;
};

const repoAdapter = createEntityAdapter<Repo>();
const repoSelectors = repoAdapter.getSelectors();

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

export const selectRepoById = (state: RootState, _id: string) =>
  repoSelectors.selectById(state[REDUCER_KEY], _id);

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
  descriptionMarkdown: string;
}>(CREATE_REPO);
export const createRepoError = makeErrorActionCreator(CREATE_REPO);
