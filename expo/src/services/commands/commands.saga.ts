import { all } from "typed-redux-saga/macro";
import createReadAuthTokenforRepoSaga from "./sagas/createReadAuthTokenForRepo.saga";

export {
  request as createReadAuthTokenForRepoSagaAction,
  failure as createReadAuthTokenForRepoError,
  success as createReadAuthTokenForRepoSuccess,
} from "./sagas/createReadAuthTokenForRepo.saga";

export default function* commandsSaga() {
  yield all([createReadAuthTokenforRepoSaga()]);
}
