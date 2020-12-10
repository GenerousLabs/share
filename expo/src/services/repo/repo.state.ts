import {
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RepoType } from "../../shared.constants";
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
    addOneRepoAction: repoAdapter.addOne,
    updateOneRepoAction: repoAdapter.updateOne,
    setNewCommitHashAction: (
      state,
      action: PayloadAction<{ id: string; headCommitObjectId: string }>
    ) => {
      const { id, headCommitObjectId } = action.payload;
      const repo = state.entities[id];
      if (typeof repo === "undefined") {
        throw new Error("Invalid repo ID #Dy21TB");
      }
      repo.commitsAheadOfOrigin = (repo.commitsAheadOfOrigin || 0) + 1;
      repo.headCommitObjectId = headCommitObjectId;
    },
  },
});

export const {
  addOneRepoAction,
  updateOneRepoAction,
  setNewCommitHashAction,
} = repoSlice.actions;

export default repoSlice.reducer;

export const selectRepoById = repoSelectors.selectById;
export const makeSelectByRepoId = (id: string) => (state: RootState) =>
  selectRepoById(state, id);
export const selectAllRepos = repoSelectors.selectAll;
export const selectMeRepo = createSelector(selectAllRepos, (repos) => {
  return repos.find((repo) => repo.type === RepoType.me);
});
export const selectCommandRepo = createSelector(selectAllRepos, (repos) => {
  return repos.find((repo) => repo.type === RepoType.commands);
});
export const selectLibraryRepo = createSelector(selectAllRepos, (repos) => {
  const libraries = repos.filter((repo) => repo.type === RepoType.library);
  if (libraries.length !== 1) {
    throw new Error("Failed to get precisely 1 library repo. #U6f5ES");
  }
  return libraries[0];
});

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
