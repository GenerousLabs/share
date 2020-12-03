import { ensureDirectoryExists } from "git-encrypted";
import { all, takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { gitFsHttp, REPOS_PATH } from "../../shared.constants";
import { writeConfigToFilesystem } from "../config/config.service";
import { commitAllEffect } from "../repo/repo.saga";
import { createCommandsRepo, createMeRepo } from "../repo/repo.service";
import { commitAllSagaAction, upsertOneRepo } from "../repo/repo.state";
import { maybeStartupSagaAction } from "../startup/startup.state";
import { setupErrorAction, setupSagaAction } from "./setup.state";

export function* setupEffect(action: ReturnType<typeof setupSagaAction>) {
  try {
    const { config } = action.payload;
    const { fs, http } = gitFsHttp;

    yield* call(ensureDirectoryExists, { fs, path: REPOS_PATH });

    yield* call(writeConfigToFilesystem, { config });

    const { remote } = config;

    const meRepo = yield* call(createMeRepo);

    yield* put(upsertOneRepo(meRepo));

    const commandsRepo = yield* call(createCommandsRepo);

    yield* put(upsertOneRepo(commandsRepo));

    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: commandsRepo.id,
        message: "Initial commands commit. #Nn0SdS",
      })
    );

    yield* put(maybeStartupSagaAction());

    // - setup the remote service
    // - ????
  } catch (error) {
    console.error("setupErrorAction #SEU3lx", error);
    // console.log("chmac ERROR hit #SLBwF1");
    yield* put(
      setupErrorAction({
        message: "Setup error #BaTVXH",
        error,
      })
    );
  }
}

export default function* setupSaga() {
  yield all([takeEvery(setupSagaAction, setupEffect)]);
}
