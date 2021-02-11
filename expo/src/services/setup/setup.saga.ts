import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { ensureDirectoryExists } from "git-encrypted";
import { purgeStoredState } from "redux-persist";
import { all, takeEvery } from "redux-saga/effects";
import { call, put, putResolve } from "typed-redux-saga/macro";
import { gitFsHttp, REPOS_PATH } from "../../shared.constants";
import { writeConfigToFilesystem } from "../config/config.service";
import { DANGEROUS_deleteEverything } from "../fs/fs.service";
import { createNewLibraryEffect } from "../library/library.saga";
import { createNewLibrarySagaAction } from "../library/library.state";
import { rootLogger } from "../log/log.service";
import { createCommandsRepo, createMeRepo } from "../repo/repo.service";
import { saveNewRepoToReduxAndReposYamlSagaAction } from "../repo/sagas/saveNewRepoToReduxAndReposYaml.saga";
import { maybeStartupSagaAction } from "../startup/startup.state";
import { persistConfig } from "../store/store.config";
import {
  DANGEROUS_setupResetSagaAction,
  setSetupCompleteAction,
  setupErrorAction,
  setupSagaAction,
} from "./setup.state";

const log = rootLogger.extend("setup.saga");

export function* setupEffect(action: ReturnType<typeof setupSagaAction>) {
  try {
    const { fs } = gitFsHttp;

    const { config } = action.payload;

    yield* call(ensureDirectoryExists, { fs, path: REPOS_PATH });

    yield* call(writeConfigToFilesystem, { config });

    const meRepo = yield* call(createMeRepo);

    yield* putResolve(
      saveNewRepoToReduxAndReposYamlSagaAction({ repo: meRepo })
    );

    const commandsRepo = yield* call(createCommandsRepo);
    yield* putResolve(
      saveNewRepoToReduxAndReposYamlSagaAction({ repo: commandsRepo })
    );

    // Create an empty library to start
    yield* call(
      createNewLibraryEffect,
      createNewLibrarySagaAction({ title: "Everybody", bodyMarkdown: "" })
    );

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
