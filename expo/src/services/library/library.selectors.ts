import { createSelector } from "@reduxjs/toolkit";
import { RepoType } from "../../shared.constants";
import { selectAllRepos } from "../repo/repo.state";

/**
 * TODO Decide how to structure selectors
 *
 * These are library selectors, but they apply to repo state, unclear where
 * they belong. They're here for now.
 */
