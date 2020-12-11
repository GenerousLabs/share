import { all, putResolve, takeEvery } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { gitPull } from "../git/git.service";
import { loadOfferEffect } from "../library/library.saga";
import { selectAllSubscribedLibraries } from "../library/library.selectors";
import { loadOfferSagaAction } from "../library/library.state";
import { rootLogger } from "../log/log.service";
import { startupSagaAction } from "../startup/startup.state";
import { getRepoPath, updateSubscribedRepo } from "./repo.service";
import {
  loadRepoContentsSagaAction,
  selectRepoById,
  updateOneRepoAction,
} from "./repo.state";
import commitAllSaga from "./sagas/commitAll.saga";
import loadRepoFromFilesystemSaga, {
  loadRepoFromFilesystemSagaAction,
} from "./sagas/loadRepoFromFilesystem.saga";
import saveNewRepoToReduxSaga from "./sagas/saveNewRepoToRedux.saga";

const log = rootLogger.extend("repo.saga");

export {
  sagaAction as commitAllSagaAction,
  sagaEffect as commitAllEffect,
} from "./sagas/commitAll.saga";
export {
  sagaAction as saveNewRepoToReduxSagaAction,
  sagaEffect as saveNewRepoToReduxEffect,
} from "./sagas/saveNewRepoToRedux.saga";

export function* loadRepoContentsEffect(
  action: ReturnType<typeof loadRepoContentsSagaAction>
) {
  const { repoId } = action.payload;

  const repo = yield* select(
    invariantSelector(selectRepoById, "Repo not found #6jBGXO"),
    repoId
  );
  const path = getRepoPath(repo);

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

        // TODO Change this after fixing the putResolve type issue
        yield putResolve(
          loadRepoFromFilesystemSagaAction({ repoYaml: library })
        );
      }
    }

    return;
  } catch (error) {
    console.error("Error in startup saga #NKhh0X", error);
  }
}

export default function* repoSaga() {
  yield all([
    saveNewRepoToReduxSaga(),
    loadRepoFromFilesystemSaga(),
    commitAllSaga(),
    takeEvery(loadRepoContentsSagaAction, loadRepoContentsEffect),
    takeEvery(startupSagaAction, repoStartupEffect),
  ]);
}
