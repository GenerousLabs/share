import { all, takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { gitFsHttp, RepoType } from "../../shared.constants";
import { ME_REPO_GITDIR, ME_REPO_PATH, REPOS_PATH } from "../../shared.paths";
import { writeConfigToFilesystem } from "../config/config.service";
import { getRemoteParamsForRepo } from "../git/services/remote/remote.service";
import { createCommandsRepo, createMeRepo } from "../repo/repo.service";
import { commitAllSagaAction, upsertOneRepo } from "../repo/repo.state";
import { setupSagaAction, setupErrorAction } from "./setup.state";
import { gitApi } from "isomorphic-git-remote-encrypted";
import {
  createKeys,
  encryptedInit,
  encryptedPush,
  ensureDirectoryExists,
  getKeysFromDisk,
} from "git-encrypted";
import { maybeStartupSagaAction } from "../startup/startup.state";
import {
  gitSetEncryptedExtraHeaders,
  gitSetEncryptedRemote,
} from "../git/git.service";
import { commitAllEffect } from "../repo/repo.saga";

export function* setupEffect(action: ReturnType<typeof setupSagaAction>) {
  try {
    const { config } = action.payload;
    const { fs, http } = gitFsHttp;

    yield* call(ensureDirectoryExists, { fs, path: REPOS_PATH });

    yield* call(writeConfigToFilesystem, { config });

    const { remote } = config;

    const meRepo = yield* call(createMeRepo);

    yield* put(upsertOneRepo(meRepo));

    // NOTE: This does not wait for the action's SAGA to have completd, it only
    // starts it immediately, and then continues...
    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: meRepo.id,
        message: "Initial me commit. #bISz6d",
      })
    );

    const meRepoEncryptedRemoteParams = yield* call(getRemoteParamsForRepo, {
      repoUuid: meRepo.uuid,
      repoBasename: "me",
      repoType: RepoType.me,
    });

    yield* call(encryptedInit, {
      ...gitFsHttp,
      encryptedRemoteUrl: meRepoEncryptedRemoteParams.url,
      encryptedRemoteHeaders: meRepoEncryptedRemoteParams.headers,
      gitApi,
      gitdir: ME_REPO_GITDIR,
    });

    yield* call(gitSetEncryptedRemote, {
      sourceGitDir: ME_REPO_GITDIR,
      encryptedRemoteUrl: meRepoEncryptedRemoteParams.url,
    });

    yield* call(gitSetEncryptedExtraHeaders, {
      sourceGitDir: ME_REPO_GITDIR,
      encryptedRemoteUrl: meRepoEncryptedRemoteParams.url,
      headers: meRepoEncryptedRemoteParams.headers,
    });

    // TODO Encrypted push here
    const keys = yield* call(getKeysFromDisk, { fs, gitdir: ME_REPO_GITDIR });

    // debugger;
    console.log("chmac step 1 #B7QRo6");

    yield* call(encryptedPush, {
      fs,
      gitApi,
      gitdir: ME_REPO_GITDIR,
      http,
      refs: [
        { src: "refs/heads/master", dst: "refs/heads/master", force: false },
      ],
      remoteUrl: meRepoEncryptedRemoteParams.url,
      keys,
    });

    // debugger;
    console.log("chmac step 2 #dvcKMa");

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
