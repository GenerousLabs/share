import { createAction } from "@reduxjs/toolkit";
import { all, call, put, takeEvery } from "typed-redux-saga/macro";
import { RepoInRedux } from "../../../shared.types";
import { makeErrorActionCreator } from "../../../utils/errors.utils";
import { rootLogger } from "../../log/log.service";
import { commitAllEffect } from "../../repo/repo.saga";
import { commitAllSagaAction } from "../../repo/repo.state";
import { addNewRepoToReposYaml } from "../reposYaml.service";

const log = rootLogger.extend("repoYaml").extend("saveRepoToReposYaml");

export const saveRepoToReposYamlSagaAction = createAction<{
  repo: RepoInRedux;
}>("SHARE/reposYaml/saveRepoToReposYaml");
export const saveRepoToReposYamlError = makeErrorActionCreator(
  saveRepoToReposYamlSagaAction
);

export function* saveRepoToReposYamlEffect(
  action: ReturnType<typeof saveRepoToReposYamlSagaAction>
) {
  // Write the repo into our `repos.yaml` file
  log.debug("addOneRepoEffect() #K2X6P8", { action });

  try {
    yield* call(addNewRepoToReposYaml, action.payload);

    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        message: "Adding a new repo to repos.yaml",
        repoId: action.payload.repo.id,
      })
    );
  } catch (error) {
    yield* put(
      saveRepoToReposYamlError({
        message: "saveRepoToReposYamlEffect() error #gjfMBB",
        error,
      })
    );
  }
}

export default function* saveRepoToReposYamlSaga() {
  yield all([
    takeEvery(saveRepoToReposYamlSagaAction, saveRepoToReposYamlEffect),
  ]);
}
