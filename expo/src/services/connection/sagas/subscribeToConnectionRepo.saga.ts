import { call, put, putResolve } from "typed-redux-saga/macro";
import { RepoType } from "../../../shared.constants";
import { RepoInRedux, RepoYaml } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import {
  cloneNewLibraryRepo,
  getRepoParamsFromFilesystem,
  getRepoPath,
} from "../../repo/repo.service";
import { loadRepoFromFilesystemSagaAction } from "../../repo/sagas/loadRepoFromFilesystem.saga";
import { saveNewRepoToReduxAndReposYamlSagaAction } from "../../repo/sagas/saveNewRepoToReduxAndReposYaml.saga";
import { updateOneConnectionAction } from "../connection.state";

const saga = createAsyncPromiseSaga<
  {
    connectionId: string;
    remoteUrl: string;
  },
  {
    repo: RepoInRedux;
  }
>({
  prefix: "SHARE/connection/subscribeToConnectionRepo",
  *effect(action) {
    const { connectionId, remoteUrl } = action.payload;

    const id = yield* call(generateId);
    const type = RepoType.library;

    const path = yield* call(getRepoPath, { type, id });

    const repoYaml: RepoYaml = {
      id,
      isReadOnly: true,
      type,
      remoteUrl,
      connectionId,
    };

    yield* call(cloneNewLibraryRepo, { path, remoteUrl });

    const repoOnDisk = yield* call(getRepoParamsFromFilesystem, { path });

    const repo = { ...repoOnDisk, ...repoYaml };

    yield* putResolve(saveNewRepoToReduxAndReposYamlSagaAction({ repo }));

    yield* put(
      updateOneConnectionAction({
        id: connectionId,
        changes: {
          theirRepoId: repo.id,
        },
      })
    );

    // NOTE: This must be invoked after the `addOneRepoAction()` has successfully
    // dispatched because this method requires the repo to exist in redux.
    yield* putResolve(
      loadRepoFromFilesystemSagaAction({
        repoYaml,
      })
    );

    return {
      repo,
    };
  },
});

export const {
  request: subscribeToConnectionRepoSagaAction,
  saga: subscribeToConnectionRepoSaga,
} = saga;
