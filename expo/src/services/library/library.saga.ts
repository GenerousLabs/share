import { all, takeEvery } from "redux-saga/effects";
import slugify from "slugify";
import { call, put } from "typed-redux-saga/macro";
import { RepoInRedux, RepoYamlWithoutKeys } from "../../shared.types";
import { generateUuid } from "../../utils/id.utils";
import { rootLogger } from "../log/log.service";
import {
  commitAllEffect,
  commitAllSagaAction,
  saveNewRepoToReduxEffect,
  saveNewRepoToReduxSagaAction,
} from "../repo/repo.saga";
import { createLibraryRepo } from "../repo/repo.service";
import { readOfferFromDisk } from "./library.service";
import {
  createNewLibraryErrorAction,
  createNewLibrarySagaAction,
  loadOfferError,
  loadOfferSagaAction,
  upsertOneOfferAction,
} from "./library.state";
import createNewOfferSaga from "./sagas/createNewOffer.saga";
import subscribeToLibrarySaga from "./sagas/subscribeToLibrary.saga";

export {
  createNewOfferEffect,
  createNewOfferSagaAction,
} from "./sagas/createNewOffer.saga";

const log = rootLogger.extend("library.saga");

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

    yield* call(
      saveNewRepoToReduxEffect,
      saveNewRepoToReduxSagaAction({ repo })
    );

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

    yield put(upsertOneOfferAction({ ...offer, id: offer.uuid, repoId }));
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
    subscribeToLibrarySaga(),
    // TODO: Refactor this to the create saga helper
    takeEvery(createNewLibrarySagaAction, createNewLibraryEffect),
    // TODO: Refactor this to the create saga helper
    takeEvery(loadOfferSagaAction, loadOfferEffect),
  ]);
}
