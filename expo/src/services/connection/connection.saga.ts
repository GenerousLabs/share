import { all } from "redux-saga/effects";
import createInviteSaga from "./sagas/createInvite.saga";

export {
  request as createInviteSagaAction,
  failure as createInviteError,
  success as createInviteSagaSuccess,
} from "./sagas/createInvite.saga";

export default function* connectionSaga() {
  yield all([createInviteSaga()]);
}
