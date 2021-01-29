import { dispatch } from "redux-saga-promise-actions";
import { all, takeEvery } from "redux-saga/effects";
import { call, select } from "typed-redux-saga/macro";
import { ConnectionInRedux } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { confirmConnectionSagaAction } from "../../connection/connection.saga";
import { setPostofficeCode } from "../../connection/connection.state";
import { rootLogger } from "../../log/log.service";
import { getCodeFromPostoffice } from "../postoffice.service";

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

    const confirmCode = yield* call(getCodeFromPostoffice, {
      postofficeCode: connection.postofficeCode,
      getReply: true,
    });

    yield dispatch(
      confirmConnectionSagaAction({ connectionId: connection.id, confirmCode })
    );

    // Remove the postofficeCode
    yield dispatch(setPostofficeCode({ id: connection.id, code: undefined }));
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
