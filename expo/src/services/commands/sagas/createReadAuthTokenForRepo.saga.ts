import nolookalikes from "nanoid-dictionary/nolookalikes-safe";
import { customAlphabet } from "nanoid/non-secure";
import { call, select, put, putResolve } from "typed-redux-saga/macro";
import { RepoShareInRedux } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { addOneRepoShare } from "../../connection/connection.state";
import { selectCommandRepo, selectRepoById } from "../../repo/repo.state";
import { commitAllSagaAction } from "../../repo/sagas/commitAll.saga";
import { addReadAuthTokenForRepo } from "../commands.service";

export const _generateToken = customAlphabet(nolookalikes, 22);

const saga = createAsyncPromiseSaga<
  { repoId: string; connectionId: string },
  RepoShareInRedux
>({
  prefix: "SHARE/commands/createReadAuthTokenforRepo",
  *effect(action) {
    const { repoId, connectionId } = action.payload;

    const token = _generateToken();

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo not found. #QixudV"),
      repoId
    );

    const commandRepo = yield* select(
      invariantSelector(selectCommandRepo, "Failed to get command repo #YaLr7j")
    );

    yield* call(addReadAuthTokenForRepo, { repo, token });

    yield* putResolve(
      commitAllSagaAction({
        repoId: commandRepo.id,
        message: "Granted access to repo. #PNgr60",
      })
    );

    const id = yield* call(generateId);

    const repoShare: RepoShareInRedux = {
      id,
      repoId,
      connectionId,
      token,
    };

    yield* put(addOneRepoShare(repoShare));

    return repoShare;
  },
});

export const {
  request: createReadAuthTokenForRepoSagaAction,
  saga: createReadAuthTokenForRepoSaga,
  effect,
} = saga;
