import { call, put } from "typed-redux-saga/macro";
import { v4 as generateUuid } from "uuid";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId } from "../../../utils/id.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import {
  saveNewRepoToReduxEffect,
  saveNewRepoToReduxSagaAction,
} from "../../repo/repo.saga";
import { createConnectionRepo } from "../../repo/repo.service";
import { addOneConnectionAction } from "../connection.state";

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes">,
  ConnectionInRedux
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

    const connection = {
      id,
      name,
      notes,
      myRepoId: repo.id,
    };

    // TODO Save the connection to connections.yaml

    yield* put(addOneConnectionAction(connection));

    return connection;
  },
});

export const { request, success, failure } = saga;
const createInviteSaga = saga.saga;
export default createInviteSaga;
