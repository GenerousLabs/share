import { all } from "typed-redux-saga/macro";
import createReadAuthTokenforRepoSaga from "./sagas/createReadAuthTokenForRepo.saga";

export {
  sagaAction as createReadAuthTokenForRepoSagaAction,
  effectSaga as createReadAuthTokenForRepoEffect,
} from "./sagas/createReadAuthTokenForRepo.saga";

export default function* commandsSaga() {
  yield all([createReadAuthTokenforRepoSaga()]);
}
