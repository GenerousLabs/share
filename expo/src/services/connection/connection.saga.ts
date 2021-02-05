import { all } from "redux-saga/effects";
import acceptInviteSaga from "./sagas/acceptInvite.saga";
import confirmConnectionSaga from "./sagas/confirmConnection.saga";
import createInviteSaga from "./sagas/createInvite.saga";

export default function* connectionSaga() {
  yield all([acceptInviteSaga(), confirmConnectionSaga(), createInviteSaga()]);
}
