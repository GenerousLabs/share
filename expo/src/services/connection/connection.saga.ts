import { all } from "redux-saga/effects";
import acceptInviteSaga from "./sagas/acceptInvite.saga";
import { confirmInviteSaga } from "./sagas/confirmInvite.saga";
import createConnectionSaga from "./sagas/createConnection.saga";
import { createConnectionRepoSaga } from "./sagas/createConnectionRepo.saga";
import createInviteSaga from "./sagas/createInvite.saga";
import { subscribeToConnectionRepoSaga } from "./sagas/subscribeToConnectionRepo.saga";

export default function* connectionSaga() {
  yield all([
    acceptInviteSaga(),
    confirmInviteSaga(),
    createConnectionSaga(),
    createConnectionRepoSaga(),
    createInviteSaga(),
    subscribeToConnectionRepoSaga(),
  ]);
}
