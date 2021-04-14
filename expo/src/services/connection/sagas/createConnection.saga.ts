import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import {
  createAsyncPromiseSaga,
  getAsyncPromiseResolveValue,
} from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/sagas/createReadAuthTokenForRepo.saga";
import { createRemoteUrlForSharedRepo } from "../../remote/remote.service";
import { selectMeRepo, selectMyLibraryRepo } from "../../repo/repo.state";
import { commitAllSagaAction } from "../../repo/sagas/commitAll.saga";
import { saveConnectionToConnectionsYaml } from "../connection.service";
import { addOneConnectionAction } from "../connection.state";
import { createConnectionRepoSagaAction } from "./createConnectionRepo.saga";

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes" | "receivedPostofficeCode">,
  {
    connection: ConnectionInRedux;
    connectionRepoRemoteUrl: string;
    libraryRemoteUrl: string;
  }
>({
  prefix: "SHARE/connection/createConnection",
  *effect(action) {
    const { name, notes, receivedPostofficeCode } = action.payload;

    const connectionRepo = getAsyncPromiseResolveValue(
      yield* putResolve(createConnectionRepoSagaAction())
    );

    const meRepo = yield* select(
      invariantSelector(selectMeRepo, "Failed to find me repo #rMgyAc")
    );

    const connectionId = yield* call(generateId);

    const connectionRepoShare = getAsyncPromiseResolveValue(
      yield* putResolve(
        createReadAuthTokenForRepoSagaAction({
          repoId: connectionRepo.id,
          connectionId,
        })
      )
    );

    const connectionOnDisk = {
      id: connectionId,
      name,
      notes,
      myRepoId: connectionRepo.id,
      token: connectionRepoShare.token,
    };
    const connection = {
      ...connectionOnDisk,
      receivedPostofficeCode,
    };

    yield* call(saveConnectionToConnectionsYaml, connectionOnDisk);
    yield* putResolve(
      commitAllSagaAction({
        repoId: meRepo.id,
        message: "Saving a new connection #3UujQ1",
      })
    );

    yield* put(addOneConnectionAction(connection));

    const libraryRepo = yield* select(selectMyLibraryRepo);

    const libraryRepoShare = getAsyncPromiseResolveValue(
      yield* putResolve(
        createReadAuthTokenForRepoSagaAction({
          repoId: libraryRepo.id,
          connectionId,
        })
      )
    );

    const connectionRepoRemoteUrl = yield* call(createRemoteUrlForSharedRepo, {
      repo: connectionRepo,
      token: connectionRepoShare.token,
    });
    const libraryRemoteUrl = yield* call(createRemoteUrlForSharedRepo, {
      repo: libraryRepo,
      token: libraryRepoShare.token,
    });

    return { connection, connectionRepoRemoteUrl, libraryRemoteUrl };
  },
});

export const { request: createConnectionSagaAction } = saga;
const createConnectionSaga = saga.saga;
export default createConnectionSaga;
