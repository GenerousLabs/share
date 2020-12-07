import { all } from "typed-redux-saga/macro";
import saveRepoToReposYamlSaga from "./sagas/saveRepoToReposYaml.saga";
export {
  saveRepoToReposYamlSagaAction,
  saveRepoToReposYamlEffect,
} from "./sagas/saveRepoToReposYaml.saga";

export default function* reposYamlSaga() {
  yield all([saveRepoToReposYamlSaga()]);
}
