import { customAlphabet } from "nanoid";
import nolookalikes from "nanoid-dictionary/nolookalikes-safe";
import { call, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { commitAllEffect, commitAllSagaAction } from "../../repo/repo.saga";
import { selectCommandRepo, selectRepoById } from "../../repo/repo.state";
import { addReadAuthTokenForRepo } from "../commands.service";

export const _generateToken = customAlphabet(nolookalikes, 22);

const saga = createAsyncPromiseSaga<{ repoId: string }, { token: string }>({
  prefix: "SHARE/commands/createReadAuthTokenforRepo",
  *effect(action) {
    const { repoId } = action.payload;

    const token = _generateToken();

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo not found. #QixudV"),
      repoId
    );

    const commandRepo = yield* select(
      invariantSelector(selectCommandRepo, "Failed to get command repo #YaLr7j")
    );

    yield* call(addReadAuthTokenForRepo, { repo, token });

    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: commandRepo.id,
        message: "Granted access to repo. #PNgr60",
      })
    );

    return { token };
  },
});

export const { request, success, failure, effect } = saga;
const createReadAuthTokenforRepoSaga = saga.saga;
export default createReadAuthTokenforRepoSaga;
