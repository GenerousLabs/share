import { call, putResolve } from "typed-redux-saga/macro";
import { RepoType } from "../../../shared.constants";
import { RepoYaml } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import {
  cloneNewLibraryRepo,
  getRepoParamsFromFilesystem,
  getRepoPath,
} from "../../repo/repo.service";
import { loadRepoFromFilesystemSagaAction } from "../../repo/sagas/loadRepoFromFilesystem.saga";
import { saveNewRepoToReduxAndReposYamlSagaAction } from "../../repo/sagas/saveNewRepoToReduxAndReposYaml.saga";

const saga = createAsyncPromiseSaga<
  {
    remoteUrl: string;
    name: string;
    connectionId: string;
  },
  void
>({
  prefix: "SHARE/library/subscribeToLibrary",
  *effect(action) {
    const { name, connectionId, remoteUrl } = action.payload;

    const id = yield* call(generateId);
    const type = RepoType.library;

    const path = yield* call(getRepoPath, { type, id });

    const repoYaml: RepoYaml = {
      id,
      isReadOnly: true,
      name,
      type,
      remoteUrl,
      connectionId,
    };

    yield* call(cloneNewLibraryRepo, { path, remoteUrl });

    const repoOnDisk = yield* call(getRepoParamsFromFilesystem, { path });

    const repo = { ...repoOnDisk, ...repoYaml };

    yield* putResolve(saveNewRepoToReduxAndReposYamlSagaAction({ repo }));

    // NOTE: This must be invoked after the `addOneRepoAction()` has successfully
    // dispatched because this method requires the repo to exist in redux.
    yield* putResolve(
      loadRepoFromFilesystemSagaAction({
        repoYaml,
      })
    );
  },
});

export const {
  request: subscribeToLibrarySagaAction,
  success: subscribeToLibrarySuccess,
  failure: subscribeToLibraryError,
  effect,
} = saga;
const subscribeToLibrarySaga = saga.saga;
export default subscribeToLibrarySaga;
