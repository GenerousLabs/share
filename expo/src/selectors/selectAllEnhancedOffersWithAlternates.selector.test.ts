import { describe, it, expect } from "@jest/globals";
import { RepoType } from "../shared.constants";
import {
  ConnectionInRedux,
  EnhancedOffer,
  OfferInRedux,
  RepoInRedux,
} from "../shared.types";
import { selectAllEnhancedOffersWithAlternates } from "./selectAllEnhancedOffersWithAlternates.selector";

const offer: OfferInRedux = {
  id: "id1",
  uuid: "id1uuid",
  title: "An offer",
  bodyMarkdown: "",
  mine: true,
  proximity: 0,
  shareToProximity: 1,
  repoId: "repo1",
  tags: [],
  createdAt: 1,
  updatedAt: 1,
};
const repo: RepoInRedux = {
  id: "repo1",
  bodyMarkdown: "",
  title: "Repo",
  uuid: "repo1uuid",
  isReadOnly: false,
  remoteUrl: "fakeRemoteUrl",
  type: RepoType.library,
};

describe("selectAllEnhancedOffersWithAlternates()", () => {
  describe("resultFunc", () => {
    it("Combines offer, repo and connection #R8dDBO", () => {
      const state = {
        repo: {
          ids: [repo.id],
          entities: {
            [repo.id]: repo,
          },
        },
        connection: {
          connections: {
            entities: {},
            ids: [],
          },
          meta: { name: "My Name" },
          repoShares: {
            entities: {},
            ids: [],
          },
        },
      };

      expect(
        selectAllEnhancedOffersWithAlternates.resultFunc([
          {
            offer,
            repo,
          },
        ])
      ).toMatchSnapshot();
    });

    it("Groups multiple offers with the same uuid #HOSjud", () => {
      const foafOffer1 = { ...offer, uuid: "foaf", id: "foaf1", proximity: 1 };
      const foafOffer2 = {
        ...foafOffer1,
        uuid: "foaf",
        id: "foafoaff2",
        repoId: "f2",
      };

      const friendRepo1 = { ...repo, id: "f1", uuid: "f1", connectionId: "c1" };
      const friendRepo2 = { ...repo, id: "f2", uuid: "f2", connectionId: "c2" };
      const connection1: ConnectionInRedux = {
        id: "c1",
        name: "C",
        notes: "",
        myRepoId: "fake1",
        theirRepoId: "fake2",
        token: "abc123",
      };
      const connection2 = {
        ...connection1,
        id: "c2",
        name: "D",
      };

      const state = {
        repo: {
          ids: [repo.id, friendRepo1.id, friendRepo2.id],
          entities: {
            [repo.id]: repo,
            [friendRepo1.id]: friendRepo1,
            [friendRepo2.id]: friendRepo2,
          },
        },
        connection: {
          connections: {
            ids: [connection1.id, connection2.id],
            entities: {
              [connection1.id]: connection1,
              [connection2.id]: connection2,
            },
          },
          meta: { name: "My Name" },
          repoShares: {
            entities: {},
            ids: [],
          },
        },
      };

      expect(
        selectAllEnhancedOffersWithAlternates.resultFunc([
          { offer, repo },
          { offer: foafOffer1, repo: friendRepo1, connection: connection1 },
          { offer: foafOffer2, repo: friendRepo2, connection: connection2 },
        ])
      ).toEqual(
        expect.arrayContaining([
          {
            offer: foafOffer1,
            repo: friendRepo1,
            connection: connection1,
            alternates: expect.arrayContaining([
              { offer: foafOffer2, repo: friendRepo2, connection: connection2 },
            ]),
          },
        ])
      );
    });
  });
});
