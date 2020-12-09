import { KeysBase64 } from "git-encrypted";
import { call, put, select } from "typed-redux-saga/macro";
import { v4 as generateUuid } from "uuid";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { subscribeToLibraryEffect } from "../../library/library.saga";
import { subscribeToLibrarySagaAction } from "../../library/library.state";
import {
  commitAllEffect,
  commitAllSagaAction,
  saveNewRepoToReduxEffect,
  saveNewRepoToReduxSagaAction,
} from "../../repo/repo.saga";
import { createConnectionRepo } from "../../repo/repo.service";
import { selectMeRepo } from "../../repo/repo.state";
import { saveConnectionToConnectionsYaml } from "../connection.service";
import { addOneConnectionAction } from "../connection.state";

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes"> & {
    theirRemoteUrl: string;
    theirKeysBase64: KeysBase64;
  },
  ConnectionInRedux
>({
  prefix: "SHARE/connection/acceptInvite",
  *effect(action) {
    const { name, notes, theirRemoteUrl, theirKeysBase64 } = action.payload;

    const theirRepoId = yield* call(generateId);

    const theirRepo = yield* call(
      subscribeToLibraryEffect,
      subscribeToLibrarySagaAction({
        name,
        remoteUrl: theirRemoteUrl,
        keysBase64: theirKeysBase64,
      })
    );

    const uuid = generateUuid();

    const repo = yield* call(createConnectionRepo, {
      uuid,
      title: name,
      bodyMarkdown: "",
      mine: true,
    });

    yield* call(
      saveNewRepoToReduxEffect,
      saveNewRepoToReduxSagaAction({
        repo,
      })
    );

    const id = yield* call(generateId);

    const connection: ConnectionInRedux = {
      id,
      name,
      notes,
      myRepoId: repo.id,
      theirRepoId,
    };

    const meRepo = yield* select(
      invariantSelector(selectMeRepo, "Failed to find me repo #rMgyAc")
    );

    yield* call(saveConnectionToConnectionsYaml, connection);
    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: meRepo.id,
        message: "Saving a new connection #3UujQ1",
      })
    );

    yield* put(addOneConnectionAction(connection));

    return connection;
  },
});

export const { request, success, failure } = saga;
const acceptInviteSaga = saga.saga;
export default acceptInviteSaga;
