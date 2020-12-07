import { all } from "redux-saga/effects";
import librarySaga from "./services/library/library.saga";
import repoSaga from "./services/repo/repo.saga";
import reposYamlSaga from "./services/reposYaml/reposYaml.saga";
import setupSaga from "./services/setup/setup.saga";
import startupSaga from "./services/startup/startup.saga";

export default function* rootSaga() {
  yield all([
    librarySaga(),
    repoSaga(),
    reposYamlSaga(),
    setupSaga(),
    startupSaga(),
  ]);
}
