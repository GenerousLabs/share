import { describe, it, expect } from "@jest/globals";
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
            proximity: 0,
            shareToProximity: 1,
            title: "An example offer",
            tags: [],
          },
          repoId: "repo1",
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
          "---\nuuid: offer1-uuid\nproximity: 0\nshareToProximity: 1\ntitle: An example offer\ntags: []\n---\nAn offer example\n",
          { encoding: "utf8" }
        )
        .next()
        // .inspect((value) => {
        //   expect((value as any).type).toEqual("PUT");
        //   expect(value).toEqual({ type: "PUT" });
        // })
        .put(commitAll({ repoId: "repo1", message: "Creating a new offer" }))
        .next()
        .isDone();
    });

    it("Terminates with an error for a non existent repoId #dussrU", () => {
      testSaga(
        createNewOfferEffect,
        createNewOffer({
          offer: {
            uuid: "offer1-uuid",
            bodyMarkdown: "An offer example",
            proximity: 0,
            shareToProximity: 1,
            title: "An example offer",
            tags: [],
          },
          repoId: "repo1",
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
