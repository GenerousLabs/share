import { createSelector } from "@reduxjs/toolkit";
import invariant from "tiny-invariant";
import { selectConnectionById } from "../services/connection/connection.state";
import { selectAllOffers } from "../services/library/library.state";
import { selectRepoById } from "../services/repo/repo.state";
import { RootState } from "../store";

const reposAndConnections = (state: RootState) => {
  const { repo, connection } = state;
  return {
    repo,
    connection,
  };
};

export const selectAllOffersPlusRepoAndConnection = createSelector(
  [selectAllOffers, reposAndConnections],
  (offers, state) => {
    return offers.map((offer) => {
      const repo = selectRepoById(state as RootState, offer.repoId);
      try {
        invariant(repo, "Failed to find repo for offer #NfBSB2");
        invariant(
          repo.connectionId,
          "Offer -> Repo -> Connection failed #s3x51r"
        );
      } catch (error) {
        debugger;
        throw error;
      }
      const connection = selectConnectionById(
        state as RootState,
        repo.connectionId
      );
      invariant(connection, "Failed to find connection for offer #DPmZHa");
      return { ...offer, connection, repo };
    });
  }
);

export type OfferPlusRepoAndConnections = ReturnType<
  typeof selectAllOffersPlusRepoAndConnection
>;
export type OfferPlusRepoAndConnection = OfferPlusRepoAndConnections[0];
