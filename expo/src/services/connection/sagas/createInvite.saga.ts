import { putResolve } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga/macro";
import { ConnectionInRedux } from "../../../shared.types";
import { generateId, generateUuid } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { createReadAuthTokenForRepoSagaAction } from "../../commands/commands.saga";
import {
  commitAllEffect,
  commitAllSagaAction,
  saveNewRepoToReduxEffect,
  saveNewRepoToReduxSagaAction,
} from "../../repo/repo.saga";
import { createConnectionRepo } from "../../repo/repo.service";
import { selectMeRepo } from "../../repo/repo.state";
import {
  ConnectionCodeType,
  getConnectionCode,
  saveConnectionToConnectionsYaml,
} from "../connection.service";
import { addOneConnectionAction } from "../connection.state";

const saga = createAsyncPromiseSaga<
  Pick<ConnectionInRedux, "name" | "notes">,
  { inviteCode: string }
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
    const tokenResult: any = yield putResolve(
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

    const code = yield* call(getConnectionCode, {
      connection,
      repo,
      type: ConnectionCodeType.INVITE,
    });

    return { inviteCode: code };
  },
});

export const { request, success, failure } = saga;
const createInviteSaga = saga.saga;
export default createInviteSaga;
