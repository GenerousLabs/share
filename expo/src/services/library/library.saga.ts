import { nanoid } from "@reduxjs/toolkit";
import fs from "expo-fs";
import { all, takeEvery } from "redux-saga/effects";
import slugify from "slugify";
import { call, put, select } from "typed-redux-saga/macro";
import { v4 as generateUuid } from "uuid";
import { RepoType } from "../../shared.constants";
import { join } from "../fs/fs.service";
import { commitAllEffect } from "../repo/repo.saga";
import {
  cloneNewLibraryRepo,
  createLibraryRepo,
  getRepoPath,
} from "../repo/repo.service";
import {
  commitAllSagaAction,
  selectRepoById,
  upsertOneRepo,
} from "../repo/repo.state";
import { offerToString, readOfferFromDisk } from "./library.service";
import {
  createNewLibraryAction,
  createNewLibraryErrorAction,
  createNewOfferError,
  createNewOfferSagaAction,
  loadOfferError,
  loadOfferSagaAction,
  subscribeToLibrarySagaAction,
  upsertOneOffer,
} from "./library.state";

export function* subscribeToLibraryEffect(
  action: ReturnType<typeof subscribeToLibrarySagaAction>
) {
  const { name, keysBase64, remoteUrl } = action.payload;
  const id = nanoid();

  const path = yield* call(getRepoPath, { type: RepoType.library, id });

  yield* call(cloneNewLibraryRepo, { path, remoteUrl, keysBase64 });

  console.log("subscribeToLibraryEffect() #ezVpNx", name, remoteUrl);

  // TODO - Load the repo into redux after it has downloaded
  throw new Error("Needs to be implemented here. #M3ulny");
}

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

export function* createNewOfferEffect(
  action: ReturnType<typeof createNewOfferSagaAction>
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

    const repoPath = getRepoPath(repo);

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
      commitAllSagaAction({
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

export function* loadOfferEffect(
  action: ReturnType<typeof loadOfferSagaAction>
) {
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
    takeEvery(subscribeToLibrarySagaAction, subscribeToLibraryEffect),
    takeEvery(createNewLibraryAction, createNewLibraryEffect),
    takeEvery(createNewOfferSagaAction, createNewOfferEffect),
    takeEvery(loadOfferSagaAction, loadOfferEffect),
  ]);
}
