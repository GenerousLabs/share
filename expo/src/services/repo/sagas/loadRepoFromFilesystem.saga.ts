import { call, put, putResolve } from "typed-redux-saga/macro";
import { RepoInRedux, RepoYaml } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { loadRepoContentsEffect } from "../repo.saga";
import { getRepoParamsFromFilesystem, getRepoPath } from "../repo.service";
import { loadRepoContentsSagaAction, updateOneRepoAction } from "../repo.state";

const saga = createAsyncPromiseSaga<
  {
    repoYaml: RepoYaml;
  },
  void
>({
  prefix: "SHARE/repo/loadRepoFromFilesystem",
  *effect(action) {
    const { repoYaml } = action.payload;
    const path = getRepoPath(repoYaml);

    const repoOnDisk = yield* call(getRepoParamsFromFilesystem, { path });

    yield* put(updateOneRepoAction({ id: repoYaml.id, changes: repoOnDisk }));

    yield* call(
      loadRepoContentsEffect,
      loadRepoContentsSagaAction({ repoId: repoYaml.id })
    );
  },
});

export const {
  request: loadRepoFromFilesystemSagaAction,
  success: loadRepoFromFilesystemSuccess,
  failure: loadRepoFromFilesystemError,
  effect,
} = saga;
const loadRepoFromFilesystemSaga = saga.saga;
export default loadRepoFromFilesystemSaga;
