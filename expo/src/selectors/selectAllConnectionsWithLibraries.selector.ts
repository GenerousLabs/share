import { createSelector } from "@reduxjs/toolkit";
import { selectAllConnections } from "../services/connection/connection.state";
import { selectAllSubscribedLibraries } from "../services/repo/repo.state";

export const selectAllConnectionsWithLibraries = createSelector(
  [selectAllConnections, selectAllSubscribedLibraries],
  (connections, libraries) => {
    return connections.map((connection) => {
      const library = libraries.find(
        (library) => library.connectionId === connection.id
      );
      return { connection, library };
    });
  }
);
