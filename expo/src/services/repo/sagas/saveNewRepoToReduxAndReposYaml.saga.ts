import { put, putResolve } from "typed-redux-saga/macro";
import { RepoInRedux } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { saveRepoToReposYamlSagaAction } from "../../reposYaml/sagas/saveRepoToReposYaml.saga";
import { addOneRepoAction } from "../repo.state";

const saga = createAsyncPromiseSaga<{ repo: RepoInRedux }, void>({
  prefix: "SHARE/repo/saveNewRepoToReduxAndReposYaml",
  *effect(action) {
    const { repo } = action.payload;

    // Add the repo to redux state
    yield* put(addOneRepoAction(repo));

    // Save the repo into the repos.yaml file
    yield* putResolve(saveRepoToReposYamlSagaAction({ repo }));
  },
});

export const {
  request: saveNewRepoToReduxAndReposYamlSagaAction,
  saga: saveNewRepoToReduxAndReposYamlSaga,
} = saga;
