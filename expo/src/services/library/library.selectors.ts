import { createSelector } from "@reduxjs/toolkit";
import { RepoType } from "../../shared.constants";
import { selectAllRepos } from "../repo/repo.state";

export const selectMyLibraries = createSelector(selectAllRepos, (repos) =>
  repos.filter((repo) => repo.type === RepoType.library && !repo.isReadOnly)
);
