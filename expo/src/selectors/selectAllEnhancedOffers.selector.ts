import { createSelector } from "@reduxjs/toolkit";
import { selectConnectionById } from "../services/connection/connection.state";
import { selectAllOffers } from "../services/library/library.state";
import { rootLogger } from "../services/log/log.service";
import { selectRepoById } from "../services/repo/repo.state";
import { EnhancedOffer } from "../shared.types";
import { RootState } from "../store";

const log = rootLogger.extend("selectEnhancedOffers");

const reposAndConnections = (state: RootState) => {
  const { repo, connection } = state;
  return {
    repo,
    connection,
  };
};

export const selectAllEnhancedOffers = createSelector(
  [selectAllOffers, reposAndConnections],
  (offers, reposAndConnections) => {
    return offers.map(
      (offer): EnhancedOffer => {
        const repo = selectRepoById(
          reposAndConnections as RootState,
          offer.repoId
        );

        if (typeof repo === "undefined") {
          log.error("Should have found repo for offer. #PFevdw", {
            offer,
            reposAndConnections,
          });
          throw new Error("Failed to find repo for offer. #aIBAiN");
        }

        const connection =
          typeof repo.connectionId === "string"
            ? selectConnectionById(
                reposAndConnections as RootState,
                repo.connectionId
              )
            : undefined;

        if (
          typeof repo.connectionId === "string" &&
          typeof connection === "undefined"
        ) {
          log.error("Should have found connection for repo. #7RSm0w", {
            offer,
            repo,
            reposAndConnections,
          });
          throw new Error("Failed to find connection for repo. #YkMdAA");
        }

        return {
          offer,
          repo,
          connection,
        };
      }
    );
  }
);
