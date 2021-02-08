import { all } from "redux-saga/effects";
import { saveRepoToReposYamlSaga } from "./sagas/saveRepoToReposYaml.saga";

export default function* reposYamlSaga() {
  yield all([saveRepoToReposYamlSaga()]);
}
