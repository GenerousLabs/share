import invariant from "tiny-invariant";
import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { POSTOFFICE_MESSAGE_SEPARATOR } from "../../../shared.constants";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId, generateUuid } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { getKeysIfEncryptedRepo } from "../../../utils/key.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/commands.saga";
import { sendMessageToPostoffice } from "../../postoffice/postoffice.service";
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
  saveConnectionToConnectionsYaml,
} from "../connection.service";
import { addOneConnectionAction, setPostofficeCode } from "../connection.state";

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes">,
  { inviteCode: string; postofficeCode: string }
>({
  prefix: "SHARE/connection/createInvite",
  *effect(action) {
    const { name, notes } = action.payload;

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

    const meRepo = yield* select(
      invariantSelector(selectMeRepo, "Failed to find me repo #rMgyAc")
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

    const connection = {
      id,
      name,
      notes,
      myRepoId: repo.id,
      token,
    };

    yield* call(saveConnectionToConnectionsYaml, connection);
    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: meRepo.id,
        message: "Saving a new connection #3UujQ1",
      })
    );

    yield* put(addOneConnectionAction(connection));

    const inviteCode = yield* call(getConnectionCode, {
      connection,
      repo,
      type: ConnectionCodeType.INVITE,
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

    invariant(myKeysBase64, "Failed to get keys for library #qtivu0");

    const sharingCode = yield* call(createConnectionCode, {
      myKeysBase64,
      myRemoteUrl,
      type: ConnectionCodeType.SHARING,
    });

    const message = [inviteCode, sharingCode].join(
      POSTOFFICE_MESSAGE_SEPARATOR
    );

    const postofficeCode = yield* call(sendMessageToPostoffice, {
      message,
    });

    yield* put(setPostofficeCode({ id: connection.id, code: postofficeCode }));

    return { inviteCode, postofficeCode };
  },
});

export const { request, success, failure } = saga;
const createInviteSaga = saga.saga;
export default createInviteSaga;
