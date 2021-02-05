import { KeysBase64 } from "git-encrypted";
import { call, put, putResolve } from "typed-redux-saga/macro";
import { RepoType } from "../../../shared.constants";
import { RepoYaml } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import {
  cloneNewLibraryRepo,
  getRepoParamsFromFilesystem,
  getRepoPath,
} from "../../repo/repo.service";
import { addOneRepoAction } from "../../repo/repo.state";
import { loadRepoFromFilesystemSagaAction } from "../../repo/sagas/loadRepoFromFilesystem.saga";

const SUBSCRIBE_LIBRARY = "SHARE/library/subscribeToLibrary";

const saga = createAsyncPromiseSaga<
  {
    remoteUrl: string;
    name: string;
    connectionId: string;
    keysBase64: KeysBase64;
  },
  void
>({
  prefix: "SHARE/library/subscribeToLibrary",
  *effect(action) {
    const { name, connectionId, keysBase64, remoteUrl } = action.payload;

    const id = yield* call(generateId);
    const type = RepoType.library;

    const path = yield* call(getRepoPath, { type, id });

    // TODO Save the repo to `repos.yaml`
    const repoYaml: RepoYaml = {
      id,
      isReadOnly: true,
      name,
      type,
      remoteUrl,
      connectionId,
      keysContentBase64: keysBase64.content,
      keysFilenamesBase64: keysBase64.filename,
      keysSaltBase64: keysBase64.salt,
    };

    yield* call(cloneNewLibraryRepo, { path, remoteUrl, keysBase64 });

    const repoOnDisk = yield* call(getRepoParamsFromFilesystem, { path });

    const repo = { ...repoOnDisk, ...repoYaml };

    yield* put(addOneRepoAction(repo));

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
