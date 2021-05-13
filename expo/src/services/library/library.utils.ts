import { OfferInRedux } from "../../shared.types";

export const isImportedOffer = (offer: OfferInRedux) =>
  offer.mine && offer.proximity > 0;

export const isArchivedOffer = (offer: OfferInRedux) =>
  typeof offer.archivedAt !== "undefined";

export const isNotArchivedOffer = (offer: OfferInRedux) =>
  typeof offer.archivedAt === "undefined";
