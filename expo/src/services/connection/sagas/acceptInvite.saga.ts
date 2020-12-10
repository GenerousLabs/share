import { putResolve } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId, generateUuid } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { getKeysIfEncryptedRepo } from "../../../utils/key.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/commands.saga";
import { subscribeToLibraryEffect } from "../../library/library.saga";
import { subscribeToLibrarySagaAction } from "../../library/library.state";
import { rootLogger } from "../../log/log.service";
import { createRemoteUrlForSharedRepo } from "../../remote/remote.service";
import {
  commitAllEffect,
  commitAllSagaAction,
  saveNewRepoToReduxEffect,
  saveNewRepoToReduxSagaAction,
} from "../../repo/repo.saga";
import { createConnectionRepo } from "../../repo/repo.service";
import { selectMeRepo } from "../../repo/repo.state";
import {
  ConnectionCodeType,
  createConnectionCode,
  getConnectionCode,
  parseInviteCode,
  saveConnectionToConnectionsYaml,
} from "../connection.service";
import { addOneConnectionAction } from "../connection.state";

const log = rootLogger.extend("acceptInvite");

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes"> & {
    inviteCode: string;
  },
  { confirmCode: string }
>({
  prefix: "SHARE/connection/acceptInvite",
  *effect(action) {
    const { name, notes, inviteCode } = action.payload;
    const { theirRemoteUrl, theirKeysBase64 } = parseInviteCode({
      code: inviteCode,
      type: ConnectionCodeType.INVITE,
    });
    log.debug("Invoked #iNrNNv", {
      name,
      notes,
      inviteCode,
      theirRemoteUrl,
      theirKeysBase64,
    });

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

    // TODO SagaTypes fix the type here once putResolve is typed
    // const { token }: { token: string } = yield* putResolve(
    //   createReadAuthTokenForRepoSagaAction({ repoId: repo.id })
    // ) as any;
    // NOTE: `putResolve()` from `typed-redux-saga` DOES NOT return the value
    // here, it results in `tokenResult` being undefined.
    const tokenResult: any = yield putResolve(
      createReadAuthTokenForRepoSagaAction({ repoId: repo.id })
    );
    const { token } = tokenResult;
    // This works from a typing perspective, but is probably not a very good
    // idea. Somehow in this constellation TypeScript can figure out the type of
    // the output value.
    // const { token } = yield* call(() =>
    //   store.dispatch(createReadAuthTokenForRepoSagaAction({ repoId: repo.id }))
    // );

    const id = yield* call(generateId);

    const connection: ConnectionInRedux = {
      id,
      name,
      notes,
      myRepoId: repo.id,
      token,
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

    const code = yield* call(getConnectionCode, {
      connection,
      repo,
      type: ConnectionCodeType.CONFIRM,
    });
    return { confirmCode: code };
  },
});

export const { request, success, failure } = saga;
const acceptInviteSaga = saga.saga;
export default acceptInviteSaga;
