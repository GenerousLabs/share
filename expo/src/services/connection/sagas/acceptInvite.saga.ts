import { dispatch } from "redux-saga-promise-actions";
import invariant from "tiny-invariant";
import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { POSTOFFICE_MESSAGE_SEPARATOR } from "../../../shared.constants";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId, generateUuid } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { getKeysIfEncryptedRepo } from "../../../utils/key.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/commands.saga";
import { subscribeToLibrarySagaAction } from "../../library/sagas/subscribeToLibrary.saga";
import { rootLogger } from "../../log/log.service";
import {
  getMessageFromPostoffice,
  sendReplyToPostoffice,
} from "../../postoffice/postoffice.service";
import { createRemoteUrlForSharedRepo } from "../../remote/remote.service";
import {
  commitAllEffect,
  commitAllSagaAction,
  saveNewRepoToReduxEffect,
  saveNewRepoToReduxSagaAction,
} from "../../repo/repo.saga";
import { createConnectionRepo } from "../../repo/repo.service";
import { selectMeRepo, selectMyLibraryRepo } from "../../repo/repo.state";
import {
  ConnectionCodeType,
  createConnectionCode,
  getConnectionCode,
  parseSharingCode,
  saveConnectionToConnectionsYaml,
} from "../connection.service";
import { addOneConnectionAction } from "../connection.state";

const log = rootLogger.extend("acceptInvite");

/**
 * TODO Think about how to handle errors in this saga
 *
 * We import repos, then create repos in redux, then create connections, etc.
 * If this fails at some point in the chain, some data can end up left in redux
 * while the IDs that it refers to are missing.
 */

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes"> & {
    inviteCode: string;
  },
  void
>({
  prefix: "SHARE/connection/acceptInvite",
  *effect(action) {
    const { name, notes, inviteCode } = action.payload;

    // TODO Resolve `inviteCode` via the postoffice service
    const message = yield* call(getMessageFromPostoffice, {
      postofficeCode: inviteCode,
    });
    const [resolvedInviteCode, sharingCode] = message.split(
      POSTOFFICE_MESSAGE_SEPARATOR
    );

    const { theirRemoteUrl, theirKeysBase64 } = parseSharingCode({
      code: resolvedInviteCode,
      type: ConnectionCodeType.INVITE,
    });
    log.debug("Invoked #iNrNNv", {
      name,
      notes,
      inviteCode,
      theirRemoteUrl,
      theirKeysBase64,
    });

    const id = yield* call(generateId);
    const theirRepoId = yield* call(generateId);

    yield* putResolve(
      subscribeToLibrarySagaAction({
        name,
        connectionId: id,
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
    const tokenResult: any = yield* putResolve(
      createReadAuthTokenForRepoSagaAction({ repoId: repo.id })
    );
    const { token } = tokenResult;
    // This works from a typing perspective, but is probably not a very good
    // idea. Somehow in this constellation TypeScript can figure out the type of
    // the output value.
    // const { token } = yield* call(() =>
    //   store.dispatch(createReadAuthTokenForRepoSagaAction({ repoId: repo.id }))
    // );

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

    const params = yield* call(parseSharingCode, {
      code: sharingCode,
      type: ConnectionCodeType.SHARING,
    });

    yield dispatch(
      subscribeToLibrarySagaAction({
        name: connection.name,
        connectionId: connection.id,
        remoteUrl: params.theirRemoteUrl,
        keysBase64: params.theirKeysBase64,
      })
    );

    const myInviteCode = yield* call(getConnectionCode, {
      connection,
      repo,
      type: ConnectionCodeType.CONFIRM,
    });

    const myLibrary = yield* select(selectMyLibraryRepo);

    // TODO SagaTypes fix the type here once putResolve is typed
    // const {token: myLibraryAuthToken} = yield* putResolve(
    //   createReadAuthTokenForRepoSagaAction({ repoId: myLibrary.id })
    // );
    const authTokenResult: any = yield* putResolve(
      createReadAuthTokenForRepoSagaAction({ repoId: myLibrary.id })
    );
    const { token: myLibraryAuthToken } = authTokenResult as { token: string };

    const { url } = yield* call(createRemoteUrlForSharedRepo, {
      repo: myLibrary,
      token: myLibraryAuthToken,
    });

    const myRemoteUrl = `encrypted::${url}`;
    const myKeysBase64 = yield* call(getKeysIfEncryptedRepo, {
      repo: myLibrary,
    });

    invariant(myKeysBase64, "Failed to get keys for library #jNieIf");

    const mySharingCode = yield* call(createConnectionCode, {
      myKeysBase64,
      myRemoteUrl,
      type: ConnectionCodeType.SHARING,
    });

    const replyMessage = [myInviteCode, mySharingCode].join(
      POSTOFFICE_MESSAGE_SEPARATOR
    );

    yield* call(sendReplyToPostoffice, {
      message: replyMessage,
      replyToPostofficeCode: inviteCode,
    });
  },
});

export const { request, success, failure } = saga;
const acceptInviteSaga = saga.saga;
export default acceptInviteSaga;
