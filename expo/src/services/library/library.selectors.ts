import { createSelector } from "@reduxjs/toolkit";
import { RepoType } from "../../shared.constants";
import { selectAllRepos } from "../repo/repo.state";

/**
 * TODO Decide how to structure selectors
 *
 * These are library selectors, but they apply to repo state, unclear where
 * they belong. They're here for now.
 */

export const selectMyLibraryRepo = createSelector(selectAllRepos, (repos) => {
  const libraries = repos.filter(
    (repo) =>
      repo.type === RepoType.library && typeof repo.connectionId === "undefined"
  );
  if (libraries.length !== 1) {
    throw new Error("Failed to get precisely 1 library repo. #U6f5ES");
  }
  return libraries[0];
});

export const selectAllMyLibraryRepos = createSelector(selectAllRepos, (repos) =>
  repos.filter((repo) => repo.type === RepoType.library && !repo.isReadOnly)
);

export const selectAllSubscribedLibraries = createSelector(
  selectAllRepos,
  (repos) =>
    repos.filter(
      (repo) =>
        repo.type === RepoType.library &&
        typeof repo.connectionId !== "undefined"
    )
);
