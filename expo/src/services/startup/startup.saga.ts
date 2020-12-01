import { all, takeEvery } from "redux-saga/effects";
import { put, select } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { maybeStartupAction, startupAction } from "./startup.state";

export function* maybeStartupEffect() {
  const isSetupComplete = yield* select(
    (state: RootState) => state.setup.isSetupComplete
  );

  if (isSetupComplete) {
    yield put(startupAction);
  }
}

export default function* startupSaga() {
  yield all([takeEvery(maybeStartupAction, maybeStartupEffect)]);
}
