import { describe, it } from "@jest/globals";
import fs from "expo-fs";
import { testSaga } from "redux-saga-test-plan";
import { commitAll } from "../repo/repo.actions";
import { selectRepoById } from "../repo/repo.state";
import { createNewOffer } from "./library.actions";
import { createNewOfferEffect } from "./library.saga";

describe("library.saga", () => {
  describe("createNewOfferEffect()", () => {
    it("Creates a new offer #nsn5S8", () => {
      testSaga(
        createNewOfferEffect,
        createNewOffer({
          offer: {
            id: "offer1",
            uuid: "offer1-uuid",
            bodyMarkdown: "An offer example",
            mine: true,
            proximity: 0,
            repoId: "repo1",
            shareToProximity: 1,
            title: "An example offer",
          },
        })
      )
        .next()
        .select(selectRepoById, "repo1")
        .next({
          repoId: "repo1",
          path: "/repo1/",
          headCommitObjectId: "",
          lastFetchTimestamp: 0,
        })
        .call(fs.promises.mkdir, "/repo1/an-example-offer")
        .next()
        .call(
          fs.promises.writeFile,
          "/repo1/an-example-offer/index.md",
          "---\nuuid: offer1-uuid\nmine: true\nproximity: 0\nshareToProximity: 1\ntitle: An example offer\n---\nAn offer example\n",
          { encoding: "utf8" }
        )
        .next()
        .put(commitAll({ repoId: "repo1", message: "Creating a new offer" }));
    });
  });
});
