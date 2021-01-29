import { dispatch } from "redux-saga-promise-actions";
import { all, takeEvery } from "redux-saga/effects";
import { call, select } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { confirmConnectionSagaAction } from "../connection/connection.saga";
import { selectAllConnections } from "../connection/connection.state";
import { rootLogger } from "../log/log.service";
import { startupSagaAction } from "../startup/startup.state";
import { getCodeFromPostoffice } from "./postoffice.service";

const log = rootLogger.extend("postoffice.saga");

export function* postofficeStartupSaga() {
  const pendingConnections = yield* select((state: RootState) => {
    const connections = selectAllConnections(state);
    return connections.filter(
      (connection) => typeof connection.postofficeCode === "string"
    );
  });

  for (const connection of pendingConnections) {
    if (
      typeof connection.postofficeCode !== "string" ||
      connection.postofficeCode.length === 0
    ) {
      log.error("Unexpected error. #FoRdR7", { connection });
      break;
    }
    const confirmCode = yield call(getCodeFromPostoffice, {
      postofficeCode: connection.postofficeCode,
      getReply: true,
    });

    yield dispatch(
      confirmConnectionSagaAction({ connectionId: connection.id, confirmCode })
    );
  }
}

export default function* postofficeSaga() {
  yield all([takeEvery(startupSagaAction, postofficeStartupSaga)]);
}
