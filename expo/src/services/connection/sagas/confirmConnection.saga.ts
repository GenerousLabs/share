import { call, put, select } from "typed-redux-saga/macro";
import { putResolve } from "redux-saga/effects";
import { generateId } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { subscribeToLibrarySagaAction } from "../../library/sagas/subscribeToLibrary.saga";
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
  prefix: "SHARE/connection/confirmConnection",
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

    yield putResolve(
      subscribeToLibrarySagaAction({
        name: connection.name,
        connectionId,
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
