import * as Updates from "expo-updates";
import { ensureDirectoryExists } from "git-encrypted";
import { AsyncStorage } from "react-native";
import { purgeStoredState } from "redux-persist";
import { all, takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { gitFsHttp, REPOS_PATH } from "../../shared.constants";
import { persistConfig } from "../../store";
import { writeConfigToFilesystem } from "../config/config.service";
import { DANGEROUS_deleteEverything } from "../fs/fs.service";
import { rootLogger } from "../log/log.service";
import { createCommandsRepo, createMeRepo } from "../repo/repo.service";
import { addOneRepoSagaAction } from "../repo/repo.state";
import { maybeStartupSagaAction } from "../startup/startup.state";
import {
  DANGEROUS_setupResetSagaAction,
  setSetupCompleteAction,
  setupErrorAction,
  setupSagaAction,
} from "./setup.state";

const log = rootLogger.extend("setup.saga");

export function* setupEffect(action: ReturnType<typeof setupSagaAction>) {
  try {
    const { config } = action.payload;
    const { fs } = gitFsHttp;

    yield* call(ensureDirectoryExists, { fs, path: REPOS_PATH });

    yield* call(writeConfigToFilesystem, { config });

    const meRepo = yield* call(createMeRepo);

    yield* put(addOneRepoSagaAction(meRepo));

    const commandsRepo = yield* call(createCommandsRepo);

    yield* put(addOneRepoSagaAction(commandsRepo));

    yield* put(setSetupCompleteAction());

    yield* put(maybeStartupSagaAction());
  } catch (error) {
    log.error("setupErrorAction #SEU3lx", error);
    yield* put(
      setupErrorAction({
        message: "Setup error #BaTVXH",
        error,
      })
    );
  }
}

export function* setupResetEffect() {
  yield* call(purgeStoredState, persistConfig);
  yield* call(DANGEROUS_deleteEverything);
  yield* call(AsyncStorage.clear);
  // NOTE: It's unwise to put anything after this line, it will cause the whole
  // app to be rebooted. However, it doesn't seem to kill currently executing
  // scripts, so it's also not as final as a `process.exit()`.
  yield* call(Updates.reloadAsync);
}

export default function* setupSaga() {
  yield all([
    takeEvery(setupSagaAction, setupEffect),
    takeEvery(DANGEROUS_setupResetSagaAction, setupResetEffect),
  ]);
}
