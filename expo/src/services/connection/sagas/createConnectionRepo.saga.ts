import { call, putResolve } from "typed-redux-saga/macro";
import { RepoInRedux } from "../../../shared.types";
import { generateUuid } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createConnectionRepo } from "../../repo/repo.service";
import { saveNewRepoToReduxAndReposYamlSagaAction } from "../../repo/sagas/saveNewRepoToReduxAndReposYaml.saga";

const saga = createAsyncPromiseSaga<void, RepoInRedux>({
  prefix: "SHARE/connection/createConnectionRepo",
  *effect() {
    const connectionRepoUuid = yield* call(generateUuid);

    const repo = yield* call(createConnectionRepo, {
      uuid: connectionRepoUuid,
      title: "",
      bodyMarkdown: "",
      mine: true,
    });

    yield* putResolve(
      saveNewRepoToReduxAndReposYamlSagaAction({
        repo,
      })
    );

    return repo;
  },
});

export const {
  request: createConnectionRepoSagaAction,
  saga: createConnectionRepoSaga,
} = saga;
