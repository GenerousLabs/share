import { all, takeEvery } from "typed-redux-saga/dist";
import { rootLogger } from "../log/log.service";
import { addOneRepoSagaAction } from "../repo/repo.state";

const log = rootLogger.extend("repoYaml");

export function* addOneRepoEffect(
  action: ReturnType<typeof addOneRepoSagaAction>
) {
  // Write the repo into our `repos.yaml` file
  log.debug("addOneRepoEffect() #K2X6P8", { action });
}

export default function* repoSaga() {
  yield all([takeEvery(addOneRepoSagaAction, addOneRepoEffect)]);
}
