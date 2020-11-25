import { all, takeEvery } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { gitAddAndCommit } from "../git/git.service";
import { loadOffer } from "../library/library.state";
import { initRepo } from "./repo.service";
import {
  commitAll,
  commitAllError,
  createRepo,
  createRepoError,
  loadRepoContents,
  selectRepoById,
  updateOneRepo,
  upsertOneRepo,
} from "./repo.state";

export function* loadRepoContentsEffect(
  action: ReturnType<typeof loadRepoContents>
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
    yield* put(loadOffer({ repoId, directoryPath: directory.path }));
  }
}

export function* commitAllEffect(action: ReturnType<typeof commitAll>) {
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

      yield* put(loadRepoContents({ repoId }));
    }
  } catch (error) {
    console.error("commitAllEffct() unknown error #UEQp4W", error);
    yield put(
      commitAllError({
        error,
        message: "commitAllEffect() unknown error. #6qOvlk",
      })
    );
  }
}

export function* createRepoEffect(action: ReturnType<typeof createRepo>) {
  try {
    yield* call(initRepo, action.payload);

    yield* put(upsertOneRepo(action.payload));

    yield* put(
      commitAll({
        repoId: action.payload.repoId,
        message: "createRepo() #N0d4Y1",
      })
    );

    // TODO Do we want to push this repo?
  } catch (error) {
    createRepoError({
      error,
      message: "createRepo() error #ceAsr8",
      meta: { payload: action.payload },
    });
  }
}

export default function* repoSaga() {
  yield all([
    takeEvery(commitAll, commitAllEffect),
    takeEvery(loadRepoContents, loadRepoContentsEffect),
    takeEvery(createRepo, createRepoEffect),
  ]);
}
