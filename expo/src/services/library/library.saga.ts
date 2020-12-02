import fs from "expo-fs";
import { all, takeEvery } from "redux-saga/effects";
import slugify from "slugify";
import { call, put, select } from "typed-redux-saga/macro";
import { v4 as generateUuid } from "uuid";
import { join } from "../fs/fs.service";
import { commitAllEffect } from "../repo/repo.saga";
import { createLibraryRepo } from "../repo/repo.service";
import {
  commitAllAction,
  selectRepoById,
  upsertOneRepo,
} from "../repo/repo.state";
import { offerToString, readOfferFromDisk } from "./library.service";
import {
  createNewLibraryAction,
  createNewLibraryErrorAction,
  createNewOfferAction,
  createNewOfferError,
  loadOfferAction,
  loadOfferError,
  upsertOneOffer,
} from "./library.state";

export function* createNewLibraryEffect(
  action: ReturnType<typeof createNewLibraryAction>
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

    yield* put(upsertOneRepo(repo));

    yield* call(
      commitAllEffect,
      commitAllAction({
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

export function* createNewOfferEffect(
  action: ReturnType<typeof createNewOfferAction>
) {
  try {
    const { offer, repoId } = action.payload;

    const repo = yield* select(selectRepoById, repoId);

    if (typeof repo === "undefined") {
      yield* put(
        createNewOfferError({
          message: "Repo does not exist #xJeqQd",
          meta: { repoId },
        })
      );
      return;
    }

    const repoPath = repo.path;

    const offerString = offerToString({ offer });

    const directoryName = slugify(offer.title, { lower: true });
    const directoryPath = join(repoPath, directoryName);
    const offerPath = join(directoryPath, "index.md");

    yield* call(fs.promises.mkdir, directoryPath);
    yield* call(fs.promises.writeFile, offerPath, offerString, {
      encoding: "utf8",
    });

    yield* call(
      commitAllEffect,
      commitAllAction({
        repoId: repoId,
        message: "Creating a new offer",
      })
    );
  } catch (error) {
    yield* put(
      createNewOfferError({
        message: "createNewOfferEffect() error #i6Sj2b",
        error,
        meta: { action },
      })
    );
  }
}

export function* loadOfferEffect(action: ReturnType<typeof loadOfferAction>) {
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
    takeEvery(createNewLibraryAction, createNewLibraryEffect),
    takeEvery(createNewOfferAction, createNewOfferEffect),
    takeEvery(loadOfferAction, loadOfferEffect),
  ]);
}
