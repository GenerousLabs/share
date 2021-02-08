import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { ConnectionInRedux, Invitation } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import {
  createAsyncPromiseSaga,
  getAsyncPromiseResolveValue,
} from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/sagas/createReadAuthTokenForRepo.saga";
import { sendMessageToPostoffice } from "../../postoffice/postoffice.service";
import { createRemoteUrlForSharedRepo } from "../../remote/remote.service";
import { commitAllEffect, commitAllSagaAction } from "../../repo/repo.saga";
import { selectMeRepo, selectMyLibraryRepo } from "../../repo/repo.state";
import {
  createInvitationMessage,
  saveConnectionToConnectionsYaml,
} from "../connection.service";
import { addOneConnectionAction, setPostofficeCode } from "../connection.state";
import createConnectionSaga, {
  createConnectionSagaAction,
} from "./createConnection.saga";
import { createConnectionRepoSagaAction } from "./createConnectionRepo.saga";

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes">,
  { postofficeCode: string }
>({
  prefix: "SHARE/connection/createInvite",
  *effect(action) {
    const { name, notes } = action.payload;

    const {
      connection,
      connectionRepoRemoteUrl,
      libraryRemoteUrl,
    } = getAsyncPromiseResolveValue(
      yield* putResolve(createConnectionSagaAction({ name, notes }))
    );

    const message = yield* call(createInvitationMessage, {
      connectionRepoRemoteUrl,
      libraryRemoteUrl,
    });

    const postofficeCode = yield* call(sendMessageToPostoffice, {
      message,
    });

    yield* put(setPostofficeCode({ id: connection.id, code: postofficeCode }));

    return { postofficeCode };
  },
});

export const {
  request: createInviteSagaAction,
  failure: createInviteError,
  success: createInviteSagaSuccess,
} = saga;
const createInviteSaga = saga.saga;
export default createInviteSaga;
