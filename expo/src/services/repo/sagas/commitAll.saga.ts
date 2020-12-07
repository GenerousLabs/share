import { call, put, select, takeEvery } from "typed-redux-saga/macro";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { gitAddAndCommit, gitPush } from "../../git/git.service";
import { getRepoPath } from "../repo.service";
import {
  loadRepoContentsSagaAction,
  selectRepoById,
  setNewCommitHashAction,
  updateOneRepoAction,
} from "../repo.state";
import { log } from "../repo.saga";
import { createAction } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../../utils/errors.utils";

export const sagaAction = createAction<{
  repoId: string;
  message: string;
}>("SHARE/repo/commitAll");
export const commitAllErrorAction = makeErrorActionCreator(sagaAction);

export function* sagaEffect(action: ReturnType<typeof sagaAction>) {
  try {
    const { repoId, message } = action.payload;

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo not found #p9DvsA"),
      repoId
    );

    const repoPath = getRepoPath({ id: repo.uuid, type: repo.type });

    const newCommitHash = yield* call(gitAddAndCommit, {
      message,
      dir: repoPath,
    });

    if (typeof newCommitHash === "string") {
      yield* put(
        setNewCommitHashAction({
          id: repoId,
          headCommitObjectId: newCommitHash,
        })
      );

      // TODO Move these 2 into an effect so we can update the state afterwards
      // TODO Make pushing conditional after a commit
      yield* call(gitPush, { path: repoPath });
      yield* put(
        updateOneRepoAction({
          id: repoId,
          changes: {
            commitsAheadOfOrigin: 0,
          },
        })
      );

      yield* put(loadRepoContentsSagaAction({ repoId }));
    }
  } catch (error) {
    log.error("commitAllEffct() unknown error #UEQp4W", error);
    yield put(
      commitAllErrorAction({
        error,
        message: "commitAllEffect() unknown error. #6qOvlk",
      })
    );
  }
}

export default function* commitAllSaga() {
  yield takeEvery(sagaAction, sagaEffect);
}
