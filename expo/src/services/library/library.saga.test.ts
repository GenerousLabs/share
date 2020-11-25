import { describe, it } from "@jest/globals";
import fs from "expo-fs";
import { testSaga } from "redux-saga-test-plan";
import { commitAll, selectRepoById } from "../repo/repo.state";
import { createNewOfferEffect } from "./library.saga";
import { createNewOffer, createNewOfferError } from "./library.state";

describe("library.saga", () => {
  describe("createNewOfferEffect()", () => {
    it("Creates a new offer #nsn5S8", () => {
      testSaga(
        createNewOfferEffect,
        createNewOffer({
          offer: {
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
        .put(commitAll({ repoId: "repo1", message: "Creating a new offer" }))
        .next()
        .isDone();
    });

    it("Throws for a non existent repoId #dussrU", () => {
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
        .next()
        .put(
          createNewOfferError({
            message: "Repo does not exist #xJeqQd",
            meta: { repoId: "repo1" },
          })
        )
        .next()
        .isDone();
    });
  });
});
