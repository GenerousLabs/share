import { all, takeEvery } from "redux-saga/effects";
import slugify from "slugify";
import { call, put, putResolve } from "typed-redux-saga/macro";
import { generateId, generateUuid } from "../../utils/id.utils";
import { rootLogger } from "../log/log.service";
import { createLibraryRepo } from "../repo/repo.service";
import { commitAllSagaAction } from "../repo/sagas/commitAll.saga";
import { saveNewRepoToReduxAndReposYamlSagaAction } from "../repo/sagas/saveNewRepoToReduxAndReposYaml.saga";
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

    yield* putResolve(saveNewRepoToReduxAndReposYamlSagaAction({ repo }));

    yield* putResolve(
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
    subscribeToLibrarySaga(),
    // TODO: Refactor this to the create saga helper
    takeEvery(createNewLibrarySagaAction, createNewLibraryEffect),
    // TODO: Refactor this to the create saga helper
    takeEvery(loadOfferSagaAction, loadOfferEffect),
  ]);
}
