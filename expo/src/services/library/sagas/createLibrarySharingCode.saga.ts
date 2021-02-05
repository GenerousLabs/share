import { putResolve } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { RepoShareInRedux } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/sagas/createReadAuthTokenForRepo.saga";
import { addOneRepoShare } from "../../connection/connection.state";

const saga = createAsyncPromiseSaga<
  { repoId: string; connectionId: string },
  { repoShare: RepoShareInRedux }
>({
  prefix: "SHARE/library/createLibrarySharingCode",
  *effect(action) {
    const { repoId, connectionId } = action.payload;

    // TODO SagaTypes fix the type here once putResolve is typed
    // const { token }: { token: string } = yield* putResolve(
    //   createReadAuthTokenForRepoSagaAction({ repoId: repo.id })
    // ) as any;
    // NOTE: `putResolve()` from `typed-redux-saga` DOES NOT return the value
    // here, it results in `tokenResult` being undefined.
    const tokenResult = yield putResolve(
      createReadAuthTokenForRepoSagaAction({
        repoId,
        connectionId,
      })
    );
    const { token }: { token: string } = tokenResult as any;

    const id = yield* call(generateId);

    const repoShare: RepoShareInRedux = {
      id,
      repoId,
      connectionId,
      token,
    };

    yield* put(addOneRepoShare(repoShare));

    // TODO1 Construct a sharing URL here like `enrypted::passp::url`

    // - Add it to the connection
    return { repoShare };
  },
});

export const { request, success, failure, effect } = saga;
const createLibrarySharingCodeSaga = saga.saga;

export default createLibrarySharingCodeSaga;
