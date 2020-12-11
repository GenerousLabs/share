import { all, takeEvery } from "redux-saga/effects";
import { call, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { loadOfferEffect } from "../library/library.saga";
import { loadOfferSagaAction } from "../library/library.state";
import { startupSagaAction } from "../startup/startup.state";
import { getRepoPath } from "./repo.service";
import { loadRepoContentsSagaAction, selectRepoById } from "./repo.state";
import commitAllSaga from "./sagas/commitAll.saga";
import loadRepoFromFilesystemSaga from "./sagas/loadRepoFromFilesystem.saga";
import saveNewRepoToReduxSaga from "./sagas/saveNewRepoToRedux.saga";

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
  // TODO Implement some kind of startup behaviour
  /**
   * In theory we could load the repos form disk. Do some kind of check up.
   * Unclear if it's worth it, we persist redux state. It would make sense to
   * be able to rebuild redux state from disk, coming later.
   */
  return;
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
