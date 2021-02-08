import { putResolve } from "typed-redux-saga/macro";
import { ConnectionInRedux } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { subscribeToLibrarySagaAction } from "../../library/sagas/subscribeToLibrary.saga";
import { subscribeToConnectionRepoSagaAction } from "./subscribeToConnectionRepo.saga";

const saga = createAsyncPromiseSaga<
  {
    connection: ConnectionInRedux;
    connectionRepoRemoteUrl: string;
    libraryRemoteUrl: string;
  },
  void
>({
  prefix: "SHARE/connection/confirmInvite",
  *effect(action) {
    const {
      connection,
      connectionRepoRemoteUrl,
      libraryRemoteUrl,
    } = action.payload;

    yield* putResolve(
      subscribeToConnectionRepoSagaAction({
        connectionId: connection.id,
        remoteUrl: connectionRepoRemoteUrl,
      })
    );

    yield* putResolve(
      subscribeToLibrarySagaAction({
        name: connection.name,
        connectionId: connection.id,
        remoteUrl: libraryRemoteUrl,
      })
    );
  },
});

export const {
  request: confirmInviteSagaAction,
  saga: confirmInviteSaga,
} = saga;
