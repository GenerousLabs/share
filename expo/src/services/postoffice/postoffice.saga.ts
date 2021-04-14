import { dispatch } from "redux-saga-promise-actions";
import { all, takeEvery } from "redux-saga/effects";
import { select } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { selectAllConnections } from "../connection/connection.state";
import { rootLogger } from "../log/log.service";
import { startupSagaAction } from "../startup/startup.state";
import { selectAllReplies } from "./postoffice.state";
import fetchRepliesSaga, {
  fetchRepliesSagaAction,
} from "./sagas/fetchReplies.saga";
import sendReplySaga, { sendReplySagaAction } from "./sagas/sendReply.saga";

const log = rootLogger.extend("postoffice.saga");

// NOTE: If this saga throws, the whole saga stack will crash
export function* postofficeStartupSaga() {
  try {
    const pendingConnections = yield* select((state: RootState) => {
      const connections = selectAllConnections(state);
      return connections.filter(
        (connection) => typeof connection.postofficeCode === "string"
      );
    });

    for (const connection of pendingConnections) {
      try {
        // NOTE: This will bubble errors if it throws. We want to dispach it and
        // swallow any errors so as not to break the loop (or the whole saga /
        // parent sagas).
        yield dispatch(fetchRepliesSagaAction({ connection }));
      } catch (error) {
        // NOTE: If the reply is not (yet) available then we'll receive a 404 in
        // response to our request. That in turn will trigger a throw above. So
        // in summary, most of these errors can be ignored.
        log.error("Error dispatching fetchRepliesSagaAction #G8fKZH", {
          error,
          connection,
        });
      }
    }

    const failedReplies = yield* select(selectAllReplies);

    for (const reply of failedReplies) {
      try {
        yield dispatch(sendReplySagaAction(reply));
      } catch (error) {
        log.error("postofficeStartupSaga reply failed #OBoehr", error);
      }
    }
  } catch (error) {
    log.error("postofficeStartupSaga crashed #OBoehr", error);
  }
}

export default function* postofficeSaga() {
  yield all([
    fetchRepliesSaga(),
    takeEvery(startupSagaAction, postofficeStartupSaga),
    sendReplySaga(),
  ]);
}
