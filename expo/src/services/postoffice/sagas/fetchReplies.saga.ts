import { call, putResolve } from "typed-redux-saga/macro";
import { ConnectionInRedux, InvitationSchema } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { confirmInviteSagaAction } from "../../connection/sagas/confirmInvite.saga";
import { rootLogger } from "../../log/log.service";
import { getMessageFromPostoffice } from "../postoffice.service";

const log = rootLogger.extend("postoffice.fetchReplies");

const saga = createAsyncPromiseSaga<{ connection: ConnectionInRedux }, void>({
  prefix: "SHARE/postoffice/fetchReplies",
  *effect(action) {
    const { connection } = action.payload;

    // If the connection is not awaiting a reply, something went awry
    if (
      typeof connection.postofficeCode !== "string" ||
      connection.postofficeCode.length === 0
    ) {
      throw new Error("Tried to get reply for invalid connection #IvAb1i");
    }

    const message = yield* call(getMessageFromPostoffice, {
      postofficeCode: connection.postofficeCode,
      getReply: true,
      returnEmptyStringOn404: true,
    });

    // If we got an empty string, then the reply is not yet available, in that
    // case we simply return doing nothing more, and this attempt will be
    // retried.
    if (message.length === 0) {
      return;
    }

    const {
      connectionRepoRemoteUrl: theirConnectionRepoRemoteUrl,
      libraryRemoteUrl: theirLibraryRemoteUrl,
    } = InvitationSchema.parse(JSON.parse(message));

    yield* putResolve(
      confirmInviteSagaAction({
        connection,
        connectionRepoRemoteUrl: theirConnectionRepoRemoteUrl,
        libraryRemoteUrl: theirLibraryRemoteUrl,
      })
    );
  },
});

export const {
  request: fetchRepliesSagaAction,
  success: fetchRepliesSuccess,
  failure: fetchRepliesError,
  effect,
} = saga;
const fetchRepliesSaga = saga.saga;
export default fetchRepliesSaga;
