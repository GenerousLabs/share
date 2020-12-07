import { createAction } from "@reduxjs/toolkit";
import fs from "expo-fs";
import slugify from "slugify";
import { call, put, select, takeEvery } from "typed-redux-saga/macro";
import { OfferOnDisk } from "../../../shared.types";
import { makeErrorActionCreator } from "../../../utils/errors.utils";
import { getTimestampSeconds } from "../../../utils/time.utils";
import { join } from "../../fs/fs.service";
import { commitAllEffect, commitAllSagaAction } from "../../repo/repo.saga";
import { getRepoPath } from "../../repo/repo.service";
import { selectRepoById } from "../../repo/repo.state";
import { offerToString } from "../library.service";

export const createNewOfferSagaAction = createAction(
  "SHARE/library/createNewOffer",
  ({
    offer,
    repoId,
  }: {
    offer: Omit<OfferOnDisk, "createdAt" | "updatedAt">;
    repoId: string;
  }) => {
    const now = getTimestampSeconds();
    return {
      payload: {
        repoId,
        offer: {
          ...offer,
          createdAt: now,
          updatedAt: now,
        },
      },
    };
  }
);
export const createNewOfferError = makeErrorActionCreator(
  createNewOfferSagaAction
);

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

export default function* createNewOfferSaga() {
  yield takeEvery(createNewOfferSagaAction, createNewOfferEffect);
}
