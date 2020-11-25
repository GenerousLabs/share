import fs from "expo-fs";
import slugify from "slugify";
import { call, put, select } from "typed-redux-saga/macro";
import { all, takeEvery } from "redux-saga/effects";
import { join } from "../fs/fs.service";
import { commitAll, selectRepoById } from "../repo/repo.state";
import { offerToString, readOfferFromDisk } from "./library.service";
import {
  createNewOffer,
  createNewOfferError,
  loadOffer,
  loadOfferError,
  upsertOneOffer,
} from "./library.state";

export function* createNewOfferEffect(
  action: ReturnType<typeof createNewOffer>
) {
  try {
    const { offer } = action.payload;

    const repo = yield* select(selectRepoById, offer.repoId);

    if (typeof repo === "undefined") {
      yield put(
        createNewOfferError({
          message: "Repo does not exist #xJeqQd",
          meta: { repoId: offer.repoId },
        })
      );
      return;
    }

    const repoPath = repo.path;

    const offerString = offerToString({ offer });

    const directoryName = slugify(offer.title, { lower: true });
    const directoryPath = join(repoPath, directoryName);
    const offerPath = join(directoryPath, "index.md");

    yield call(fs.promises.mkdir, directoryPath);
    yield call(fs.promises.writeFile, offerPath, offerString, {
      encoding: "utf8",
    });

    yield put(
      commitAll({
        repoId: offer.repoId,
        message: "Creating a new offer",
      })
    );
  } catch (error) {
    yield put(
      createNewOfferError({
        message: "createNewOfferEffect() error #i6Sj2b",
        error,
        meta: { action },
      })
    );
  }
}

export function* loadOfferEffect(action: ReturnType<typeof loadOffer>) {
  try {
    const { directoryPath, repoId } = action.payload;

    const offer = yield* call(readOfferFromDisk, { directoryPath });

    yield put(upsertOneOffer({ ...offer, id: directoryPath, repoId }));
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
    takeEvery(createNewOffer, createNewOfferEffect),
    takeEvery(loadOffer, loadOfferEffect),
  ]);
}
