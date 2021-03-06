import { all } from "redux-saga/effects";
import { call, select, take } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { startLinkService } from "./link.service";

export function* linkSagaEffect() {
  while (true) {
    const action = yield* take("*");

    const { isRehydrated, splashScreenHidden } = yield* select(
      (state: RootState) => ({
        isRehydrated: state._persist.rehydrated,
        splashScreenHidden: state.startup.splashScreenHidden,
      })
    );

    if (isRehydrated && splashScreenHidden) {
      // Once redux has rehydrated, start the link service
      yield* call(startLinkService);
      break;
    }
  }
}

export default function* linkSaga() {
  yield all([linkSagaEffect()]);
}
