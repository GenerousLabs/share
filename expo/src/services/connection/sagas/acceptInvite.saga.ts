import { call, put, putResolve } from "typed-redux-saga/macro";
import { ConnectionInRedux, InvitationSchema } from "../../../shared.types";
import {
  createAsyncPromiseSaga,
  getAsyncPromiseResolveValue,
} from "../../../utils/saga.utils";
import { rootLogger } from "../../log/log.service";
import {
  getMessageFromPostoffice,
  sendReplyToPostoffice,
} from "../../postoffice/postoffice.service";
import { removeInviteCode } from "../../setup/setup.state";
import { createInvitationMessage } from "../connection.service";
import { confirmInviteSagaAction } from "./confirmInvite.saga";
import { createConnectionSagaAction } from "./createConnection.saga";

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
    postofficeCode: string;
  },
  void
>({
  prefix: "SHARE/connection/acceptInvite",
  *effect(action) {
    const { name, notes, postofficeCode } = action.payload;

    // NOTE: We fetch the message from the postoffice FIRST, because if this
    // fails, we will abort before creating any repos, etc.
    const message = yield* call(getMessageFromPostoffice, {
      postofficeCode,
    });

    yield* put(removeInviteCode({ inviteCode: postofficeCode }));

    const {
      connectionRepoRemoteUrl: theirConnectionRepoRemoteUrl,
      libraryRemoteUrl: theirLibraryRemoteUrl,
    } = InvitationSchema.parse(JSON.parse(message));

    const {
      connection,
      connectionRepoRemoteUrl,
      libraryRemoteUrl,
    } = getAsyncPromiseResolveValue(
      yield* putResolve(createConnectionSagaAction({ name, notes }))
    );

    yield* putResolve(
      confirmInviteSagaAction({
        connection,
        connectionRepoRemoteUrl: theirConnectionRepoRemoteUrl,
        libraryRemoteUrl: theirLibraryRemoteUrl,
      })
    );

    const replyMessage = yield* call(createInvitationMessage, {
      connectionRepoRemoteUrl,
      libraryRemoteUrl,
    });

    yield* call(sendReplyToPostoffice, {
      message: replyMessage,
      replyToPostofficeCode: postofficeCode,
    });
  },
});

export const {
  request: acceptInviteSagaAction,
  failure: acceptInviteError,
  success: acceptInviteSagaSuccess,
} = saga;
const acceptInviteSaga = saga.saga;
export default acceptInviteSaga;
