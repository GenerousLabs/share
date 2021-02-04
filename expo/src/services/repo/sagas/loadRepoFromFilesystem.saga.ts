import { call, put } from "typed-redux-saga/macro";
import { RepoType } from "../../../shared.constants";
import { RepoYaml } from "../../../shared.types";
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

    // The commands and me repos do not need to be loaded from disk
    if (repoYaml.type === RepoType.commands || repoYaml.type === RepoType.me) {
      return;
    }

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
