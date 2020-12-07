import { createAction } from "@reduxjs/toolkit";
import { all } from "bluebird";
import { call, put, select, takeEvery } from "typed-redux-saga/macro";
import { makeErrorActionCreator } from "../../../utils/errors.utils";
import { selectCommandRepo, selectRepoById } from "../../repo/repo.state";
import { addReadAuthTokenForRepo } from "../commands.service";
import { customAlphabet } from "nanoid";
import nolookalikes from "nanoid-dictionary/nolookalikes-safe";
import { commitAllEffect, commitAllSagaAction } from "../../repo/repo.saga";

export const _generateToken = customAlphabet(nolookalikes, 22);

export const sagaAction = createAction(
  "SHARE/commands/createReadAuthTokenforRepo",
  ({ repoId }: { repoId: string }) => {
    const token = _generateToken();
    return {
      payload: {
        repoId,
        token,
      },
    };
  }
);
export const errorAction = makeErrorActionCreator(sagaAction);

export function* effectSaga(action: ReturnType<typeof sagaAction>) {
  try {
    const { repoId, token } = action.payload;

    const repo = yield* select(selectRepoById, repoId);
    if (typeof repo === "undefined") {
      throw new Error("Invalid repoId #Q8HMso");
    }

    const commandRepo = yield* select(selectCommandRepo);
    if (typeof commandRepo === "undefined") {
      throw new Error("Failed to get command repo #YaLr7j");
    }

    yield* call(addReadAuthTokenForRepo, { repo, token });

    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: commandRepo.id,
        message: "Granted access to repo. #PNgr60",
      })
    );

    return token;
  } catch (error) {
    yield* put(
      errorAction({
        message: "createReadAuthTokenforRepoEffect() error #YUwv59",
        error,
        isFatal: true,
      })
    );
  }
}

export default function* createReadAuthTokenforRepoSaga() {
  yield takeEvery(sagaAction, effectSaga);
}
