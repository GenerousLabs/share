import { all } from "redux-saga/effects";
import librarySaga from "./services/library/library.saga";
import repoSaga from "./services/repo/repo.saga";
import setupSaga from "./services/setup/setup.saga";

export default function* rootSaga() {
  yield all([librarySaga(), repoSaga(), setupSaga()]);
}
