import { all, takeEvery } from "redux-saga/effects";
import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { RepoType } from "../../shared.constants";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { loadOfferEffect } from "../library/library.saga";
import { loadOfferSagaAction } from "../library/library.state";
import { updateImportedOffersSagaAction } from "../library/sagas/updateImportedOffers.saga";
import { rootLogger } from "../log/log.service";
import { startupSagaAction } from "../startup/startup.state";
import { getRepoPath, updateSubscribedRepo } from "./repo.service";
import {
  loadRepoContentsSagaAction,
  selectAllSubscribedLibraries,
  selectRepoById,
  updateOneRepoAction,
} from "./repo.state";
import commitAllSaga from "./sagas/commitAll.saga";
import loadRepoFromFilesystemSaga, {
  loadRepoFromFilesystemSagaAction,
} from "./sagas/loadRepoFromFilesystem.saga";
import { saveNewRepoToReduxAndReposYamlSaga } from "./sagas/saveNewRepoToReduxAndReposYaml.saga";

const log = rootLogger.extend("repo.saga");

export function* loadRepoContentsEffect(
  action: ReturnType<typeof loadRepoContentsSagaAction>
) {
  const { repoId } = action.payload;

  const repo = yield* select(
    invariantSelector(selectRepoById, "Repo not found #6jBGXO"),
    repoId
  );

  // The commands and me repos should not be loaded from disk
  if (repo.type === RepoType.commands || repo.type === RepoType.me) {
    return;
  }

  const path = yield* call(getRepoPath, repo);

  const { directories } = yield* call(getDirectoryContents, {
    path,
  });

  for (const directory of directories) {
    yield* call(
      loadOfferEffect,
      loadOfferSagaAction({ repoId, directoryPath: directory.path })
    );
  }
}

export function* repoStartupEffect() {
  try {
    log.debug("repoStartupEffect() invoked #IeHAGy");
    // TODO Implement some kind of startup behaviour
    /**
     * In theory we could load the repos form disk. Do some kind of check up.
     * Unclear if it's worth it, we persist redux state. It would make sense to
     * be able to rebuild redux state from disk, coming later.
     */

    // Refetch to see if anything has changed in our subscribed repos
    const subscribedLibraries = yield* select(selectAllSubscribedLibraries);

    for (const library of subscribedLibraries) {
      const path = getRepoPath(library);
      const headCommit = yield* call(updateSubscribedRepo, { path });
      const headCommitObjectId = headCommit.oid;
      if (library.headCommitObjectId !== headCommitObjectId) {
        yield* put(
          updateOneRepoAction({
            id: library.id,
            changes: { headCommitObjectId },
          })
        );

        yield* putResolve(
          loadRepoFromFilesystemSagaAction({ repoYaml: library })
        );
      }
    }

    // After we refreshed all the repos, now run an update check on all of our
    // imported offers.
    yield* putResolve(updateImportedOffersSagaAction());
  } catch (error) {
    console.error("Error in startup saga #NKhh0X", error);
  }
}

export default function* repoSaga() {
  yield all([
    commitAllSaga(),
    loadRepoFromFilesystemSaga(),
    saveNewRepoToReduxAndReposYamlSaga(),
    takeEvery(loadRepoContentsSagaAction, loadRepoContentsEffect),
    takeEvery(startupSagaAction, repoStartupEffect),
  ]);
}
