import fs from "expo-fs";
import slugify from "slugify";
import { call, put, select } from "typed-redux-saga/macro";
import { OfferOnDisk } from "../../../shared.types";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { getTimestampSeconds } from "../../../utils/time.utils";
import { join } from "../../fs/fs.service";
import { commitAllEffect, commitAllSagaAction } from "../../repo/repo.saga";
import { getRepoPath } from "../../repo/repo.service";
import { selectRepoById } from "../../repo/repo.state";
import { offerToString } from "../library.service";
import { addOneOfferAction } from "../library.state";

const saga = createAsyncPromiseSaga<
  {
    offer: Omit<OfferOnDisk, "createdAt" | "updatedAt">;
    repoId: string;
  },
  void
>({
  prefix: "SHARE/library/createNewOffer",
  *effect(action) {
    const { offer: offerWithoutTimestamps, repoId } = action.payload;

    const now = getTimestampSeconds();
    const offer = {
      ...offerWithoutTimestamps,
      createdAt: now,
      updatedAt: now,
    };

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo does not exist #xJeqQd"),
      repoId
    );

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

    yield* put(
      addOneOfferAction({ ...offer, id: offer.uuid, repoId, mine: true })
    );
  },
});

export const {
  request: createNewOfferSagaAction,
  success: createNewOfferSuccess,
  failure: createNewOfferError,
  effect,
} = saga;
const createNewOfferSaga = saga.saga;
export default createNewOfferSaga;
