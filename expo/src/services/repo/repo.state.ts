import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const REDUCER_KEY = "repo" as const;

type Repo = {
  repoId: string;
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
