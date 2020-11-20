import { AnyAction } from "@reduxjs/toolkit";
import { call, takeEvery } from "typed-redux-saga/macro";
import { gitAddAndCommit } from "../git/git.service";
import { commitAll } from "./repo.actions";

export function* commitAllEffect(action: AnyAction) {
  const { repoId, message, ...gitBaseParams } = action.payload;

  console.log("Got a commitAll action #sEpx3w");
  return;

  const dir = "/repo1";
  const newCommitHash = yield* call(gitAddAndCommit, {
    ...gitBaseParams,
    message,
    dir,
  });
}

export default function* repoSaga() {
  yield takeEvery(commitAll, commitAllEffect);
}
