import { all } from "redux-saga/effects";
import librarySaga from "./services/library/library.saga";
import repoSaga from "./services/repo/repo.saga";

export default function* rootSaga() {
  yield all([repoSaga(), librarySaga()]);
}
