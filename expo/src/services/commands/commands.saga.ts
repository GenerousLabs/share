import { all } from "typed-redux-saga/macro";
import { createReadAuthTokenForRepoSaga } from "./sagas/createReadAuthTokenForRepo.saga";

export default function* commandsSaga() {
  yield all([createReadAuthTokenForRepoSaga()]);
}
