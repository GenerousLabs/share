import { all, takeEvery } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { gitAddAndCommit, gitPush } from "../git/git.service";
import { loadOfferEffect } from "../library/library.saga";
import { loadOfferSagaAction } from "../library/library.state";
import { startupSagaAction } from "../startup/startup.state";
import { getRepoParamsFromFilesystem, getRepoPath } from "./repo.service";
import {
  commitAllErrorAction,
  commitAllSagaAction,
  loadRepoContentsSagaAction,
  loadRepoFromFilesystemErrorAction,
  loadRepoFromFilesystemSagaAction,
  selectRepoById,
  setNewCommitHash,
  updateOneRepo,
  upsertOneRepo,
} from "./repo.state";

export function* loadRepoContentsEffect(
  action: ReturnType<typeof loadRepoContentsSagaAction>
) {
  const { repoId } = action.payload;

  const repo = yield* select(
    invariantSelector(selectRepoById, "Repo not found #6jBGXO"),
    repoId
  );

  const { directories } = yield* call(getDirectoryContents, {
    path: repo.path,
  });

  for (const directory of directories) {
    yield* call(
      loadOfferEffect,
      loadOfferSagaAction({ repoId, directoryPath: directory.path })
    );
  }
}

export function* commitAllEffect(
  action: ReturnType<typeof commitAllSagaAction>
) {
  try {
    const { repoId, message } = action.payload;

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo not found #6jBGXO"),
      repoId
    );

    const repoPath = getRepoPath({ uuid: repo.uuid, type: repo.type });

    const newCommitHash = yield* call(gitAddAndCommit, {
      message,
      dir: repoPath,
    });

    if (typeof newCommitHash === "string") {
      yield* put(
        setNewCommitHash({
          id: repoId,
          headCommitObjectId: newCommitHash,
        })
      );

      // TODO Move these 2 into an effect so we can update the state afterwards
      // TODO Make pushing conditional after a commit
      yield* call(gitPush, { path: repoPath });
      yield* put(
        updateOneRepo({
          id: repoId,
          changes: {
            commitsAheadOfOrigin: 0,
          },
        })
      );

      yield* put(loadRepoContentsSagaAction({ repoId }));
    }
  } catch (error) {
    console.error("commitAllEffct() unknown error #UEQp4W", error);
    yield put(
      commitAllErrorAction({
        error,
        message: "commitAllEffect() unknown error. #6qOvlk",
      })
    );
  }
}

export function* loadRepoFromFilesystemEffect(
  action: ReturnType<typeof loadRepoFromFilesystemSagaAction>
) {
  try {
    const repo = yield* call(getRepoParamsFromFilesystem, {
      path: action.payload.path,
    });

    yield* put(upsertOneRepo(repo));

    // We `yield* call()` here so that this generator only completes AFTER the
    // nested call to `loadRepoContents` has itself completed.
    yield* call(
      loadRepoContentsEffect,
      loadRepoContentsSagaAction({ repoId: repo.id })
    );
  } catch (error) {
    console.error("loadRepoFromFilesystemEffect() error #BL7v49", error);
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
    yield* call(
      loadRepoFromFilesystemEffect,
      loadRepoFromFilesystemSagaAction({ path: ME_REPO_PATH })
    );
    yield* call(
      loadRepoFromFilesystemEffect,
      loadRepoFromFilesystemSagaAction({ path: COMMANDS_REPO_PATH })
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
    takeEvery(commitAllSagaAction, commitAllEffect),
    takeEvery(loadRepoContentsSagaAction, loadRepoContentsEffect),
    takeEvery(loadRepoFromFilesystemSagaAction, loadRepoFromFilesystemEffect),
    takeEvery(startupSagaAction, repoStartupEffect),
  ]);
}
