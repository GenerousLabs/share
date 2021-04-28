import invariant from "tiny-invariant";
import { EnhancedOffer } from "../shared.types";

export const getOfferSharingText = ({ offer, connection }: EnhancedOffer) => {
  if (offer.mine && offer.proximity === 0) {
    if (offer.isSeeking) {
      return `You are looking for`;
    }
    return `You share`;
  }

  invariant(connection, "Offer not mine and no connection. #8ilZoi");

  const { name } = connection;

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
