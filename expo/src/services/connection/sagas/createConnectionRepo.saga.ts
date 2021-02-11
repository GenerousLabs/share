import { call, putResolve, select } from "typed-redux-saga/macro";
import { RepoInRedux } from "../../../shared.types";
import { generateUuid } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createConnectionRepo } from "../../repo/repo.service";
import { saveNewRepoToReduxAndReposYamlSagaAction } from "../../repo/sagas/saveNewRepoToReduxAndReposYaml.saga";
import { selectName } from "../connection.state";

const saga = createAsyncPromiseSaga<void, RepoInRedux>({
  prefix: "SHARE/connection/createConnectionRepo",
  *effect() {
    const connectionRepoUuid = yield* call(generateUuid);
    const name = yield* select(selectName);

    const repo = yield* call(createConnectionRepo, {
      uuid: connectionRepoUuid,
      title: name,
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
