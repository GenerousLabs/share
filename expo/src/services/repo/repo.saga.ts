import { call, put, select, takeEvery } from "typed-redux-saga/macro";
import { invariantSelector } from "../../utils/getOrThrow.util";
import { gitAddAndCommit } from "../git/git.service";
import { commitAll, commitAllError } from "./repo.actions";
import { selectRepoById, updateOneRepo } from "./repo.state";

export function* commitAllEffect(action: ReturnType<typeof commitAll>) {
  const { repoId, message } = action.payload;

  const repo = yield* select(
    invariantSelector(selectRepoById, "Repo not found #6jBGXO"),
    repoId
  );

  if (typeof repo === "undefined") {
    yield put(commitAllError({ repoId, message: "Repo not found. #6KfG2D" }));
    return;
  }

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
  }
}

export default function* repoSaga() {
  yield takeEvery(commitAll, commitAllEffect);
}
