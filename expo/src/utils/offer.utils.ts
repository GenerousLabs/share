import invariant from "tiny-invariant";
import { EnhancedOfferWithAlternates } from "../shared.types";

export const getOfferSharingText = ({
  offer,
  connection,
  alternates,
}: EnhancedOfferWithAlternates) => {
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

  if (typeof alternates !== "undefined" && alternates.length > 0) {
    const names = alternates.reduce(
      (names, { connection }, i) =>
        typeof connection?.name === "string"
          ? `${names},${i + 1 === alternates.length ? " and" : ""} ${
              connection.name
            }`
          : names,
      connection.name
    );

    if (offer.isSeeking) {
      return `A friend of ${names} is looking for`;
    }
    return `A friend of ${names} shares`;
  }

  if (offer.isSeeking) {
    return `${name}'s friend is looking for`;
  }
  return `${name}'s friend shares`;
};
