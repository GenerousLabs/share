import { dispatch } from "redux-saga-promise-actions";
import { all, takeEvery } from "redux-saga/effects";
import { select } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { selectAllConnections } from "../connection/connection.state";
import { rootLogger } from "../log/log.service";
import { startupSagaAction } from "../startup/startup.state";
import fetchRepliesSaga, {
  fetchRepliesSagaAction,
} from "./sagas/fetchReplies.saga";

const log = rootLogger.extend("postoffice.saga");

export function* postofficeStartupSaga() {
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
      log.error("Error dispatching fetchRepliesSagaAction #G8fKZH", error);
    }
  }
}

export default function* postofficeSaga() {
  yield all([
    fetchRepliesSaga(),
    takeEvery(startupSagaAction, postofficeStartupSaga),
  ]);
}
