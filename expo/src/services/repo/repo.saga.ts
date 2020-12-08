import { all, takeEvery } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { RepoType } from "../../shared.constants";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { loadOfferEffect } from "../library/library.saga";
import { loadOfferSagaAction } from "../library/library.state";
import { rootLogger } from "../log/log.service";
import { startupSagaAction } from "../startup/startup.state";
import { getRepoParamsFromFilesystem, getRepoPath } from "./repo.service";
import {
  addOneRepoAction,
  loadRepoContentsSagaAction,
  loadRepoFromFilesystemErrorAction,
  loadRepoFromFilesystemSagaAction,
  selectRepoById,
} from "./repo.state";
import commitAllSaga from "./sagas/commitAll.saga";
import saveNewRepoToReduxSaga from "./sagas/saveNewRepoToRedux.saga";

export {
  sagaAction as commitAllSagaAction,
  sagaEffect as commitAllEffect,
} from "./sagas/commitAll.saga";
export {
  sagaAction as saveNewRepoToReduxSagaAction,
  sagaEffect as saveNewRepoToReduxEffect,
} from "./sagas/saveNewRepoToRedux.saga";

export const log = rootLogger.extend("repo.saga");

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

export function* loadRepoFromFilesystemEffect(
  action: ReturnType<typeof loadRepoFromFilesystemSagaAction>
) {
  try {
    // TODO Fix this
    log.error("loadRepoFromFilesystemEffect() needs implementation. #2ybMIL");
    return;
    const repo = yield* call(getRepoParamsFromFilesystem, {
      path: action.payload.path,
    });

    yield* put(addOneRepoAction(repo as any));

    // We `yield* call()` here so that this generator only completes AFTER the
    // nested call to `loadRepoContents` has itself completed.
    yield* call(
      loadRepoContentsEffect,
      loadRepoContentsSagaAction({ repoId: repo.id })
    );
  } catch (error) {
    log.error("loadRepoFromFilesystemEffect() error #BL7v49", error);
    yield* put(
      loadRepoFromFilesystemErrorAction({
        message: "loadRepoFromFilesystem() error #HlT6yC",
        error,
      })
    );
  }
}

export function* repoStartupEffect() {
  try {
    const mePath = getRepoPath({ id: "", type: RepoType.me });
    yield* call(
      loadRepoFromFilesystemEffect,
      loadRepoFromFilesystemSagaAction({ path: mePath })
    );
    const commandsPath = getRepoPath({ id: "", type: RepoType.commands });
    yield* call(
      loadRepoFromFilesystemEffect,
      loadRepoFromFilesystemSagaAction({ path: commandsPath })
    );
  } catch (error) {
    yield* put(
      loadRepoFromFilesystemErrorAction({
        message: "repo.sagas startupSaga() error #roZbhL",
        error,
      })
    );
  }
}

export default function* repoSaga() {
  yield all([
    saveNewRepoToReduxSaga(),
    commitAllSaga(),
    takeEvery(loadRepoContentsSagaAction, loadRepoContentsEffect),
    takeEvery(loadRepoFromFilesystemSagaAction, loadRepoFromFilesystemEffect),
    takeEvery(startupSagaAction, repoStartupEffect),
  ]);
}
