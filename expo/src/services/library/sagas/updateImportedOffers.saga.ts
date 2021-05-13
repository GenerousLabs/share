import { putResolve, select } from "typed-redux-saga/macro";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { selectAllOffers } from "../library.state";
import {
  isArchivedOffer,
  isImportedOffer,
  isNotArchivedOffer,
} from "../library.utils";
import { archiveOfferSagaAction } from "./archiveOffer.saga";

const saga = createAsyncPromiseSaga<void, void>({
  prefix: "SHARE/library/updateImportedOffers",
  *effect() {
    const allOffers = yield* select(selectAllOffers);

    const importedOffers = allOffers.filter(
      (offer) => isImportedOffer(offer) && isNotArchivedOffer(offer)
    );

    for (const importedOffer of importedOffers) {
      const sourceOffer = allOffers.find(
        (offer) =>
          offer.uuid === importedOffer.uuid &&
          offer.proximity === importedOffer.proximity - 1
      );

      // If we don't find the source offer, then we can assume that this offer
      // has been removed from our visibility and so we archive the imported
      // offer.
      // TODO - Does this logic really hold?

      // NOTE: We cannot use the `sourceOfferHasBeenDeleted` boolean because
      // TypeScript doesn't understand that the boolean means that in the second
      // test `sourceOffer` will not be `undefined`.
      // const sourceOfferHasBeenDeleted = typeof sourceOffer === 'undefined'
      if (typeof sourceOffer === "undefined" || isArchivedOffer(sourceOffer)) {
        yield* putResolve(archiveOfferSagaAction({ id: importedOffer.id }));
      }
    }
  },
});

export const { request: updateImportedOffersSagaAction } = saga;
const updateImportedOffersSaga = saga.saga;
export default updateImportedOffersSaga;
