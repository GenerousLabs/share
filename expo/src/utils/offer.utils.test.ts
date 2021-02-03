import { describe, it, expect } from "@jest/globals";
import { OfferPlusRepoAndConnection } from "../selectors/selectAllOffersPlusRepoAndConnection.selector";
import { OfferMine } from "../shared.types";
import { getOfferSharingText } from "./offer.utils";

describe("offer.utils", () => {
  describe("getOfferSharingText()", () => {
    it("Returns you are looking #XIIRCW", () => {
      expect(
        getOfferSharingText({ mine: true, isSeeking: true } as OfferMine)
      ).toEqual("You are looking for");
    });

    it("Returns you share #jvJVQS", () => {
      expect(
        getOfferSharingText({ mine: true, isSeeking: false } as OfferMine)
      ).toEqual("You share");
    });

    it("Returns Alice is looking for #ckuvTo", () => {
      expect(
        getOfferSharingText({
          mine: false,
          isSeeking: true,
          proximity: 0,
          connection: { name: "Alice" },
        } as OfferPlusRepoAndConnection)
      ).toEqual("Alice is looking for");
    });

    it("Returns Alice shares #r3bj4k", () => {
      expect(
        getOfferSharingText({
          mine: false,
          isSeeking: false,
          proximity: 0,
          connection: { name: "Alice" },
        } as OfferPlusRepoAndConnection)
      ).toEqual("Alice shares");
    });

    it("Returns Alice's friend is looking for #e5Zvlh", () => {
      expect(
        getOfferSharingText({
          mine: false,
          isSeeking: true,
          proximity: 1,
          connection: { name: "Alice" },
        } as OfferPlusRepoAndConnection)
      ).toEqual("Alice's friend is looking for");
    });

    it("Returns Alice's friend shares #otLUjR", () => {
      expect(
        getOfferSharingText({
          mine: false,
          isSeeking: false,
          proximity: 1,
          connection: { name: "Alice" },
        } as OfferPlusRepoAndConnection)
      ).toEqual("Alice's friend shares");
    });
  });
});
