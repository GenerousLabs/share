import { OfferPlusRepoAndConnection } from "../selectors/selectAllOffersPlusRepoAndConnection.selector";
import { isOfferMine } from "../services/library/library.service";
import { OfferMine } from "../shared.types";

export const getOfferSharingText = (
  offer: OfferMine | OfferPlusRepoAndConnection
) => {
  if (isOfferMine(offer)) {
    if (offer.isSeeking) {
      return `You are looking for`;
    }
    return `You share`;
  }

  const { name } = offer.connection;

  if (offer.proximity === 0) {
    if (offer.isSeeking) {
      return `${name} is looking for`;
    }
    return `${name} shares`;
  }

  if (offer.isSeeking) {
    return `${name}'s friend is looking for`;
  }
  return `${name}'s friend shares`;
};
