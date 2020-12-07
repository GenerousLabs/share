import { all, takeEvery } from "redux-saga/effects";
import slugify from "slugify";
import { call, put } from "typed-redux-saga/macro";
import { v4 as generateUuid } from "uuid";
import { RepoType } from "../../shared.constants";
import { generateId } from "../../utils/id.utils";
import { rootLogger } from "../log/log.service";
import {
  commitAllEffect,
  createNewRepoEffect,
  createNewRepoSagaAction,
} from "../repo/repo.saga";
import {
  cloneNewLibraryRepo,
  createLibraryRepo,
  getRepoPath,
} from "../repo/repo.service";
import { commitAllSagaAction } from "../repo/repo.state";
import { readOfferFromDisk } from "./library.service";
import {
  createNewLibraryErrorAction,
  createNewLibrarySagaAction,
  loadOfferError,
  loadOfferSagaAction,
  subscribeToLibrarySagaAction,
  upsertOneOfferAction,
} from "./library.state";
import createNewOfferSaga from "./sagas/createNewOffer.saga";

export {
  createNewOfferEffect,
  createNewOfferSagaAction,
} from "./sagas/createNewOffer.saga";

const log = rootLogger.extend("library.saga");

export function* subscribeToLibraryEffect(
  action: ReturnType<typeof subscribeToLibrarySagaAction>
) {
  const { name, keysBase64, remoteUrl } = action.payload;

  const id = yield* call(generateId);

  const path = yield* call(getRepoPath, { type: RepoType.library, id });

  yield* call(cloneNewLibraryRepo, { path, remoteUrl, keysBase64 });

  log.debug("subscribeToLibraryEffect() #ezVpNx", name, remoteUrl);

  // TODO - Load the repo into redux after it has downloaded
  throw new Error("Needs to be implemented here. #M3ulny");
}

export function* createNewLibraryEffect(
  action: ReturnType<typeof createNewLibrarySagaAction>
) {
  try {
    const { title, bodyMarkdown } = action.payload;

    const basename = slugify(title);
    const uuid = generateUuid();

    const repo = yield* call(createLibraryRepo, {
      basename,
      uuid,
      title,
      bodyMarkdown,
    });

    yield* call(createNewRepoEffect, createNewRepoSagaAction({ repo }));

    yield* call(
      commitAllEffect,
      commitAllSagaAction({
        repoId: repo.id,
        message: "Initial commit. #hhpj2X",
      })
    );
  } catch (error) {
    yield* put(
      createNewLibraryErrorAction({
        message: "createNewLibraryEffect() error #MAqjTm",
        error,
      })
    );
  }
}

export function* loadOfferEffect(
  action: ReturnType<typeof loadOfferSagaAction>
) {
  try {
    const { directoryPath, repoId } = action.payload;

    const offer = yield* call(readOfferFromDisk, { directoryPath });

    yield put(upsertOneOfferAction({ ...offer, id: directoryPath, repoId }));
  } catch (error) {
    yield put(
      loadOfferError({
        error,
        message: "Unknown error. #arGvI7",
      })
    );
  }
}

export default function* librarySaga() {
  yield all([
    createNewOfferSaga(),
    takeEvery(subscribeToLibrarySagaAction, subscribeToLibraryEffect),
    takeEvery(createNewLibrarySagaAction, createNewLibraryEffect),
    takeEvery(loadOfferSagaAction, loadOfferEffect),
  ]);
}
