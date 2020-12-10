import { call, put, select } from "typed-redux-saga/macro";
import { generateId } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { subscribeToLibraryEffect } from "../../library/library.saga";
import { subscribeToLibrarySagaAction } from "../../library/library.state";
import { ConnectionCodeType, parseSharingCode } from "../connection.service";
import {
  selectConnectionById,
  updateOneConnectionAction,
} from "../connection.state";

const saga = createAsyncPromiseSaga<
  {
    connectionId: string;
    confirmCode: string;
  },
  void
>({
  prefix: "SHARE/connection/acceptInvite",
  *effect(action) {
    const { connectionId, confirmCode } = action.payload;
    const { theirRemoteUrl, theirKeysBase64 } = parseSharingCode({
      code: confirmCode,
      type: ConnectionCodeType.CONFIRM,
    });
    const connection = yield* select(
      invariantSelector(
        selectConnectionById,
        "Failed to get connection #Ppjktq"
      ),
      connectionId
    );

    const theirRepoId = yield* call(generateId);

    const theirRepo = yield* call(
      subscribeToLibraryEffect,
      subscribeToLibrarySagaAction({
        name: connection.name,
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
