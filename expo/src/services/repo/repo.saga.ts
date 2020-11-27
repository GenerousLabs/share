import { all, takeEvery } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { gitAddAndCommit } from "../git/git.service";
import { loadOfferAction } from "../library/library.state";
import { startupAction } from "../startup/startup.state";
import { getRepoParamsFromFilesystem } from "./repo.service";
import {
  commitAllAction,
  commitAllErrorAction,
  loadRepoContentsAction,
  loadRepoFromFilesystemAction,
  loadRepoFromFilesystemErrorAction,
  selectRepoById,
  updateOneRepo,
  upsertOneRepo,
} from "./repo.state";

export function* loadRepoContentsEffect(
  action: ReturnType<typeof loadRepoContentsAction>
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
    yield* put(loadOfferAction({ repoId, directoryPath: directory.path }));
  }
}

export function* commitAllEffect(action: ReturnType<typeof commitAllAction>) {
  try {
    const { repoId, message } = action.payload;

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo not found #6jBGXO"),
      repoId
    );

    const repoPath = repo.path;

    const newCommitHash = yield* call(gitAddAndCommit, {
      message,
      dir: repoPath,
    });

    if (typeof newCommitHash === "string") {
      yield* put(
        updateOneRepo({
          id: repoId,
          changes: {
            headCommitObjectId: newCommitHash,
          },
        })
      );

      yield* put(loadRepoContentsAction({ repoId }));
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
  action: ReturnType<typeof loadRepoFromFilesystemAction>
) {
  try {
    const repo = yield* call(getRepoParamsFromFilesystem, {
      path: action.payload.path,
    });

    yield put(upsertOneRepo(repo));

    yield put(loadRepoContentsAction({ repoId: repo.id }));
  } catch (error) {
    console.error("loadRepoFromFilesystemEffect() error #BL7v49", error);
    yield put(
      loadRepoFromFilesystemErrorAction({
        message: "loadRepoFromFilesystem() error #HlT6yC",
        error,
      })
    );
  }
}

export function* startupSagaEffect() {
  try {
    yield put(loadRepoFromFilesystemAction({ path: "/re2/" }));
  } catch (error) {
    yield put(
      loadRepoFromFilesystemErrorAction({
        message: "repo.sagas startupSaga() error #roZbhL",
        error,
      })
    );
  }
}

export default function* repoSaga() {
  yield all([
    takeEvery(commitAllAction, commitAllEffect),
    takeEvery(loadRepoContentsAction, loadRepoContentsEffect),
    takeEvery(loadRepoFromFilesystemAction, loadRepoFromFilesystemEffect),
    takeEvery(startupAction, startupSagaEffect),
  ]);
}
