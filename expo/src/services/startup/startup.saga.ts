import { all } from "redux-saga/effects";
import { put, select, take, takeEvery } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { startupResetSagaAction, startupSagaAction } from "./startup.state";

export function* maybeStartupEffect() {
  while (true) {
    const action = yield* take("*");

    const { isRehydrated, isSetupComplete } = yield* select(
      (state: RootState) => ({
        isSetupComplete: state.setup.isSetupComplete,
        isRehydrated: state._persist.rehydrated,
      })
    );

    if (isRehydrated && isSetupComplete) {
      yield* put(startupSagaAction());
      break;
    }
  }
}

export function* startupResetEffect() {
  throw new Error("Not yet implemented. #QRsLaz");
  /**
   * - Delete /repos/
   * - Delete /logs/
   * - Empty AsyncStorage
   * - Purge redux persist
   */
}

export default function* startupSaga() {
  yield all([
    maybeStartupEffect(),
    takeEvery(startupResetSagaAction, startupResetEffect),
  ]);
}
