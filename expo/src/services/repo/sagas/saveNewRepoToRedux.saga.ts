import { createAction } from "@reduxjs/toolkit";
import { takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { RepoInRedux } from "../../../shared.types";
import { makeErrorActionCreator } from "../../../utils/errors.utils";
import {
  saveRepoToReposYamlEffect,
  saveRepoToReposYamlSagaAction,
} from "../../reposYaml/sagas/saveRepoToReposYaml.saga";
import { addOneRepoAction } from "../repo.state";

export const sagaAction = createAction<{
  repo: RepoInRedux;
}>("SHARE/repo/createNewRepo");
export const createNewRepoError = makeErrorActionCreator(sagaAction);
export function* sagaEffect(action: ReturnType<typeof sagaAction>) {
  const { repo } = action.payload;

  // Add the repo to redux state
  yield* put(addOneRepoAction(repo));

  // Save the repo into the repos.yaml file
  yield* call(
    saveRepoToReposYamlEffect,
    saveRepoToReposYamlSagaAction({ repo })
  );
}

export default function* saveNewRepoToReduxSaga() {
  yield takeEvery(sagaAction, sagaEffect);
}
