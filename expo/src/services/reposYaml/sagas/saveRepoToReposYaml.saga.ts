import { call, putResolve } from "typed-redux-saga/macro";
import { RepoInRedux } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { rootLogger } from "../../log/log.service";
import { commitAllSagaAction } from "../../repo/sagas/commitAll.saga";
import { addNewRepoToReposYaml } from "../reposYaml.service";

const log = rootLogger.extend("repoYaml.saveRepoToReposYaml");

const saga = createAsyncPromiseSaga<
  {
    repo: RepoInRedux;
  },
  void
>({
  prefix: "SHARE/reposYaml/saveRepoToReposYaml",
  *effect(action) {
    log.debug("addOneRepoEffect() #K2X6P8", { action });

    yield* call(addNewRepoToReposYaml, action.payload);

    yield* putResolve(
      commitAllSagaAction({
        message: "Adding a new repo to repos.yaml",
        repoId: action.payload.repo.id,
      })
    );
  },
});

export const {
  request: saveRepoToReposYamlSagaAction,
  saga: saveRepoToReposYamlSaga,
} = saga;
