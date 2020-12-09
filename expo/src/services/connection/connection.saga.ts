import { all } from "redux-saga/effects";
import acceptInviteSaga from "./sagas/acceptInvite.saga";
import confirmConnectionSaga from "./sagas/confirmConnection.saga";
import createInviteSaga from "./sagas/createInvite.saga";

export {
  request as acceptInviteSagaAction,
  failure as acceptInviteError,
  success as acceptInviteSagaSuccess,
} from "./sagas/acceptInvite.saga";

export {
  request as confirmConnectionSagaAction,
  failure as confirmConnectionError,
  success as confirmConnectionSagaSuccess,
} from "./sagas/confirmConnection.saga";

export {
  request as createInviteSagaAction,
  failure as createInviteError,
  success as createInviteSagaSuccess,
} from "./sagas/createInvite.saga";

export default function* connectionSaga() {
  yield all([acceptInviteSaga(), confirmConnectionSaga(), createInviteSaga()]);
}
