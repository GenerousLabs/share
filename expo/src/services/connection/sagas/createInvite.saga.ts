import { call, put, putResolve } from "typed-redux-saga/macro";
import { ConnectionInRedux } from "../../../shared.types";
import {
  createAsyncPromiseSaga,
  getAsyncPromiseResolveValue,
} from "../../../utils/saga.utils";
import { sendMessageToPostoffice } from "../../postoffice/postoffice.service";
import { createInvitationMessage } from "../connection.service";
import { setPostofficeCode } from "../connection.state";
import { createConnectionSagaAction } from "./createConnection.saga";

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
