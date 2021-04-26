import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { ConnectionInRedux, InvitationSchema } from "../../../shared.types";
import {
  createAsyncPromiseSaga,
  getAsyncPromiseResolveValue,
} from "../../../utils/saga.utils";
import { rootLogger } from "../../log/log.service";
import { getMessageFromPostoffice } from "../../postoffice/postoffice.service";
import { sendReplySagaAction } from "../../postoffice/sagas/sendReply.saga";
import { createInvitationMessage } from "../connection.service";
import { makeSelectConnectionByReceivedPostofficeCode } from "../connection.state";
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

    // If this postofficeCode is already attached to a connection, then it has
    // been used, do not allow it to be used a second time.
    const duplicatedConnection = yield* select(
      makeSelectConnectionByReceivedPostofficeCode(postofficeCode)
    );
    if (typeof duplicatedConnection !== "undefined") {
      throw new Error("This code has already been used. #YEnkRU");
    }

    // NOTE: We fetch the message from the postoffice FIRST, because if this
    // fails, we will abort before creating any repos, etc.
    const message = yield* call(getMessageFromPostoffice, {
      postofficeCode,
    });

    const {
      connectionRepoRemoteUrl: theirConnectionRepoRemoteUrl,
      libraryRemoteUrl: theirLibraryRemoteUrl,
    } = InvitationSchema.parse(JSON.parse(message));

    const {
      connection,
      connectionRepoRemoteUrl,
      libraryRemoteUrl,
    } = getAsyncPromiseResolveValue(
      yield* putResolve(
        createConnectionSagaAction({
          name,
          notes,
          receivedPostofficeCode: postofficeCode,
        })
      )
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

    yield* put(
      sendReplySagaAction({
        message: replyMessage,
        replyToPostofficeCode: postofficeCode,
      })
    );
  },
});

export const {
  request: acceptInviteSagaAction,
  failure: acceptInviteError,
  success: acceptInviteSagaSuccess,
} = saga;
const acceptInviteSaga = saga.saga;
export default acceptInviteSaga;
