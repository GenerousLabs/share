import { all } from "redux-saga/effects";
import { call, put, select, takeEvery } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/invariantSelector.util";
import { getDirectoryContents } from "../fs/fs.service";
import { gitAddAndCommit } from "../git/git.service";
import { loadOffer } from "../library/library.actions";
import { commitAll, commitAllError, loadRepoContents } from "./repo.actions";
import { selectRepoById, updateOneRepo } from "./repo.state";

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
    yield put(commitAllError({ error, message: "Unknown error. #6qOvlk" }));
  }
}

export default function* repoSaga() {
  yield all([
    takeEvery(commitAll, commitAllEffect),
    takeEvery(loadRepoContents, loadRepoContentsEffect),
  ]);
}
