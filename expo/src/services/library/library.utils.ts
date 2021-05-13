import { OfferInRedux } from "../../shared.types";

export const isImportedOffer = (offer: OfferInRedux) =>
  offer.mine && offer.proximity > 0;
