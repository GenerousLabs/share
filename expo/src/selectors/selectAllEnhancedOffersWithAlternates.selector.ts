import { createSelector } from "@reduxjs/toolkit";
import * as R from "remeda";
import { EnhancedOffer, EnhancedOfferWithAlternates } from "../shared.types";
import { selectAllEnhancedOffers } from "./selectAllEnhancedOffers.selector";

/**
 * I only care about offers at a lower proximity. So if I have the same offer
 * at proximity 0 and proximity 1, I can ignore all at proximity > 0
 *
 * If the offer is included in my repo at proximity 1, then I must have its
 * original copy at proximity 0. When I'm looking at my own offers, do I want
 * to see it? Maybe I see it in a separate view...
 *
 * It's possible I'll see the same offer at the same proximity many times.
 * Maybe many friends are sharing the same item that a friend of theirs has. In
 * this case, I want to be able to see all the possible connections that have
 * the item.
 */

export const selectAllEnhnancedOffersWithAlternates = createSelector(
  [selectAllEnhancedOffers],
  (enhancedOffers): EnhancedOfferWithAlternates[] => {
    return R.pipe(
      enhancedOffers,
      R.groupBy((enhanced) => enhanced.offer.uuid),
      (o) => Object.values(o),
      R.map((group) => {
        const mineIndex = group.findIndex(
          ({ offer }) => offer.mine && offer.proximity === 0
        );

        if (mineIndex !== -1) {
          const alternates = R.reject.indexed(
            group,
            (o, i) => i === mineIndex
          ) as EnhancedOffer[];
          const mine = group[mineIndex];
          return {
            ...mine,
            alternates,
          };
        }

        const friendIndex = group.findIndex(
          ({ offer }) => !offer.mine && offer.proximity === 0
        );

        if (friendIndex !== -1) {
          const alternates = R.reject.indexed(
            group,
            (o, i) => i === friendIndex
          ) as EnhancedOffer[];
          const friend = group[friendIndex];
          return { ...friend, alternates };
        }

        const [first, ...alternates] = group;
        return {
          ...first,
          alternates,
        };
      })
    );
  }
);
