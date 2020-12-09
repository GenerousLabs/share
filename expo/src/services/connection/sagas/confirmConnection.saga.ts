import { KeysBase64 } from "git-encrypted";
import { call, put } from "typed-redux-saga/macro";
import { generateId } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { subscribeToLibraryEffect } from "../../library/library.saga";
import { subscribeToLibrarySagaAction } from "../../library/library.state";
import { updateOneConnectionAction } from "../connection.state";

const saga = createAsyncPromiseSaga<
  {
    connectionId: string;
    theirRemoteUrl: string;
    theirKeysBase64: KeysBase64;
  },
  void
>({
  prefix: "SHARE/connection/acceptInvite",
  *effect(action) {
    const { connectionId, theirRemoteUrl, theirKeysBase64 } = action.payload;

    const theirRepoId = yield* call(generateId);

    const theirRepo = yield* call(
      subscribeToLibraryEffect,
      subscribeToLibrarySagaAction({
        name,
        remoteUrl: theirRemoteUrl,
        keysBase64: theirKeysBase64,
      })
    );

    yield* put(
      updateOneConnectionAction({
        id: connectionId,
        changes: {
          theirRepoId,
        },
      })
    );
  },
});

export const { request, success, failure } = saga;
const confirmConnectionSaga = saga.saga;
export default confirmConnectionSaga;
