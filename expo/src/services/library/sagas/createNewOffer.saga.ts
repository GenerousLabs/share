import fs from "expo-fs";
import { pick } from "remeda";
import slugify from "slugify";
import { call, put, putResolve, select } from "typed-redux-saga/macro";
import {
  OfferInRedux,
  OfferOnDisk,
  OfferOnDiskFrontmatterSchema,
} from "../../../shared.types";
import { generateUuid } from "../../../utils/id.utils";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { assertNever } from "../../../utils/never.utils";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { getTimestampSeconds } from "../../../utils/time.utils";
import { join } from "../../fs/fs.service";
import { getRepoPath } from "../../repo/repo.service";
import { selectRepoById } from "../../repo/repo.state";
import { commitAllSagaAction } from "../../repo/sagas/commitAll.saga";
import { offerToString } from "../library.service";
import { addOneOfferAction, selectOfferById } from "../library.state";

const getOffer = function* (
  args:
    | {
        offer: Omit<OfferOnDisk, "createdAt" | "updatedAt" | "uuid">;
      }
    | {
        importOfferId: string;
      }
) {
  if ("offer" in args) {
    const { offer } = args;
    const now = getTimestampSeconds();
    const uuid = yield* call(generateUuid);
    return {
      ...offer,
      uuid,
      createdAt: now,
      updatedAt: now,
    } as OfferInRedux;
  } else if ("importOfferId" in args) {
    const { importOfferId } = args;
    const offer = yield* select(
      invariantSelector(selectOfferById, "Offer does not exist #KY6abd"),
      importOfferId
    );
    return { ...offer, proximity: offer.proximity + 1 };
  } else {
    assertNever(args);
    throw new Error("Should never happen #nmeWZV");
  }
};

const saga = createAsyncPromiseSaga<
  (
    | {
        offer: Omit<OfferOnDisk, "createdAt" | "updatedAt" | "uuid">;
      }
    | {
        importOfferId: string;
      }
  ) & {
    repoId: string;
  },
  void
>({
  prefix: "SHARE/library/createNewOffer",
  *effect(action) {
    const { repoId } = action.payload;

    // Whenever we import something, we always set `mine = true` because even if
    // the original is not "mine", this copy of it is. A copy can be
    // distinguished by the `proximity` field which will always be >0.
    const mine = true;

    const offer = yield* call(getOffer, action.payload);

    const repo = yield* select(
      invariantSelector(selectRepoById, "Repo does not exist #xJeqQd"),
      repoId
    );

    const repoPath = getRepoPath(repo);

    // TODO Get only the properties that are supposed to be frontmatter
    const keys = Object.keys(
      OfferOnDiskFrontmatterSchema.shape
    ) as (keyof OfferOnDisk)[];
    const offerOnDisk = pick(offer, keys.concat("bodyMarkdown"));

    const offerString = offerToString({ offer: offerOnDisk });

    const directoryName = slugify(offer.title, { lower: true });
    const directoryPath = join(repoPath, directoryName);
    const offerPath = join(directoryPath, "index.md");

    // TODO If I create 2 offers with the same name, the second will throw, this
    // is going to be more likely when I can import somebody else's offers.
    // Perhaps it makes more sense to use an ID for the folder name?
    yield* call(fs.promises.mkdir, directoryPath);
    yield* call(fs.promises.writeFile, offerPath, offerString, {
      encoding: "utf8",
    });

    yield* putResolve(
      commitAllSagaAction({
        repoId: repoId,
        message: "Creating a new offer",
      })
    );

    const offerForRedux = { ...offer, id: directoryPath, repoId, mine };

    yield* put(addOneOfferAction(offerForRedux));
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
