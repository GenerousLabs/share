import { dispatch } from "redux-saga-promise-actions";
import { call, putResolve } from "typed-redux-saga/macro";
import { POSTOFFICE_MESSAGE_SEPARATOR } from "../../../shared.constants";
import { ConnectionInRedux } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { confirmConnectionSagaAction } from "../../connection/sagas/confirmConnection.saga";
import {
  ConnectionCodeType,
  parseSharingCode,
} from "../../connection/connection.service";
import { setPostofficeCode } from "../../connection/connection.state";
import { subscribeToLibrarySagaAction } from "../../library/sagas/subscribeToLibrary.saga";
import { rootLogger } from "../../log/log.service";
import { getMessageFromPostoffice } from "../postoffice.service";

const log = rootLogger.extend("postoffice.fetchReplies");

const saga = createAsyncPromiseSaga<{ connection: ConnectionInRedux }, void>({
  prefix: "SHARE/postoffice/fetchReplies",
  *effect(action) {
    const { connection } = action.payload;

    // If the connection is not awaiting a reply, something went awry
    if (
      typeof connection.postofficeCode !== "string" ||
      connection.postofficeCode.length === 0
    ) {
      throw new Error("Tried to get reply for invalid connection #IvAb1i");
    }

    const message = yield* call(getMessageFromPostoffice, {
      postofficeCode: connection.postofficeCode,
      getReply: true,
    });

    const [confirmCode, sharingCode] = message.split(
      POSTOFFICE_MESSAGE_SEPARATOR
    );

    // Remove the postofficeCode so we don't try to load this again.
    yield dispatch(setPostofficeCode({ id: connection.id, code: undefined }));

    yield dispatch(
      confirmConnectionSagaAction({ connectionId: connection.id, confirmCode })
    );

    const params = yield* call(parseSharingCode, {
      code: sharingCode,
      type: ConnectionCodeType.SHARING,
    });

    yield dispatch(
      subscribeToLibrarySagaAction({
        name: connection.name,
        connectionId: connection.id,
        remoteUrl: params.theirRemoteUrl,
      })
    );
  },
});

export const {
  request: fetchRepliesSagaAction,
  success: fetchRepliesSuccess,
  failure: fetchRepliesError,
  effect,
} = saga;
const fetchRepliesSaga = saga.saga;
export default fetchRepliesSaga;
