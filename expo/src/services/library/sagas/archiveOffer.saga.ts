import fs from "expo-fs";
import { call, put, putResolve, select } from "typed-redux-saga/macro";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { getTimestampSeconds } from "../../../utils/time.utils";
import { selectRepoById } from "../../repo/repo.state";
import { commitAllSagaAction } from "../../repo/sagas/commitAll.saga";
import { getOfferFilesystemParams, offerToString } from "../library.service";
import { selectOfferById, upsertOneOfferAction } from "../library.state";

const saga = createAsyncPromiseSaga<{ id: string }, void>({
  prefix: "SHARE/library/archiveOffer",
  *effect(action) {
    const { id } = action.payload;

    const now = getTimestampSeconds();

    const originalOffer = yield* select(
      invariantSelector(selectOfferById, "Offer does not exist #bEzGyC"),
      id
    );

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo does not exist #T9qnmL"),
      originalOffer.repoId
    );

    const offer = {
      ...originalOffer,
      updatedAt: now,
      archivedAt: now,
    };

    const { filePath } = getOfferFilesystemParams({
      offer: originalOffer,
      repo,
    });

    const offerString = offerToString({ offer });

    yield* call(fs.promises.writeFile, filePath, offerString, {
      encoding: "utf8",
    });

    yield* putResolve(
      commitAllSagaAction({
        repoId: repo.id,
        message: "Archiving offer",
      })
    );

    yield* put(upsertOneOfferAction(offer));

    /**
     * - Read the offer from disk
     * - Set archived to true
     * - Write to disk
     * - Commit & push
     * - Update redux, maybe with load from disk
     */
  },
});

export const { request: archiveOfferSagaAction } = saga;
const archiveOfferSaga = saga.saga;
export default archiveOfferSaga;
