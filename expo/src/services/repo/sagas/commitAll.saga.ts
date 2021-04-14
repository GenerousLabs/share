import { call, put, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { gitAddAndCommit, gitPush } from "../../git/git.service";
import { getRepoPath } from "../repo.service";
import {
  loadRepoContentsSagaAction,
  selectRepoById,
  setNewCommitHashAction,
  updateOneRepoAction,
} from "../repo.state";

const saga = createAsyncPromiseSaga<
  {
    repoId: string;
    message: string;
  },
  void
>({
  prefix: "SHARE/repo/commitAll",
  *effect(action) {
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
  },
});

export const { request: commitAllSagaAction } = saga;

const commitAllSaga = saga.saga;
export default commitAllSaga;
