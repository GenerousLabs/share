import { all } from "redux-saga/effects";
import commandsSaga from "../commands/commands.saga";
import connectionSaga from "../connection/connection.saga";
import librarySaga from "../library/library.saga";
import repoSaga from "../repo/repo.saga";
import reposYamlSaga from "../reposYaml/reposYaml.saga";
import setupSaga from "../setup/setup.saga";
import startupSaga from "../startup/startup.saga";

export default function* rootSaga() {
  yield all([
    commandsSaga(),
    connectionSaga(),
    librarySaga(),
    repoSaga(),
    reposYamlSaga(),
    setupSaga(),
    startupSaga(),
  ]);
}
