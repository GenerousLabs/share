import { describe, it, expect } from "@jest/globals";
import { RepoType } from "../shared.constants";
import {
  ConnectionInRedux,
  EnhancedOffer,
  OfferInRedux,
  RepoInRedux,
} from "../shared.types";
import { selectAllEnhancedOffers } from "./selectAllEnhancedOffers.selector";

const offer: OfferInRedux = {
  id: "id1",
  uuid: "id1uuid",
  title: "An offer",
  bodyMarkdown: "",
  mine: false,
  proximity: 0,
  shareToProximity: 1,
  repoId: "repo1",
  tags: [],
  createdAt: 1,
  updatedAt: 1,
};
const repo: RepoInRedux = {
  id: "repo1",
  connectionId: "c1",
  bodyMarkdown: "",
  title: "Repo",
  uuid: "repo1uuid",
  isReadOnly: false,
  remoteUrl: "fakeRemoteUrl",
  type: RepoType.library,
};
const connection: ConnectionInRedux = {
  id: "c1",
  name: "C",
  notes: "",
  myRepoId: "fake1",
  theirRepoId: "fake2",
  token: "abc123",
};

describe("selectAllEnhancedOffers()", () => {
  describe("resultFunc", () => {
    it("Matches a snapshot #YOjqlN", () => {
      const state = {
        repo: {
          ids: [repo.id],
          entities: {
            [repo.id]: repo,
          },
        },
        connection: {
          connections: {
            ids: [connection.id],
            entities: {
              [connection.id]: connection,
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
        selectAllEnhancedOffers.resultFunc([offer], state)
      ).toMatchSnapshot();
    });
  });
});
