import { all } from "redux-saga/effects";
import repoSaga from "./services/repo/repo.saga";

export default function* rootSaga() {
  yield all([repoSaga()]);
}
