import { describe, expect, it } from "@jest/globals";
import { EnhancedOffer } from "../shared.types";
import { getOfferSharingText } from "./offer.utils";

describe("offer.utils", () => {
  describe("getOfferSharingText()", () => {
    it("Returns you are looking #XIIRCW", () => {
      expect(
        getOfferSharingText({
          offer: { mine: true, isSeeking: true },
        } as EnhancedOffer)
      ).toEqual("You are looking for");
    });

    it("Returns you share #jvJVQS", () => {
      expect(
        getOfferSharingText({
          offer: { mine: true, isSeeking: false },
        } as EnhancedOffer)
      ).toEqual("You share");
    });

    it("Returns Alice is looking for #ckuvTo", () => {
      expect(
        getOfferSharingText({
          offer: { mine: false, isSeeking: true, proximity: 0 },
          connection: { name: "Alice" },
        } as EnhancedOffer)
      ).toEqual("Alice is looking for");
    });

    it("Returns Alice shares #r3bj4k", () => {
      expect(
        getOfferSharingText({
          offer: { mine: false, isSeeking: false, proximity: 0 },
          connection: { name: "Alice" },
        } as EnhancedOffer)
      ).toEqual("Alice shares");
    });

    it("Returns Alice's friend is looking for #e5Zvlh", () => {
      expect(
        getOfferSharingText({
          offer: { mine: false, isSeeking: true, proximity: 1 },
          connection: { name: "Alice" },
        } as EnhancedOffer)
      ).toEqual("Alice's friend is looking for");
    });

    it("Returns Alice's friend shares #otLUjR", () => {
      expect(
        getOfferSharingText({
          offer: { mine: false, isSeeking: false, proximity: 1 },
          connection: { name: "Alice" },
        } as EnhancedOffer)
      ).toEqual("Alice's friend shares");
    });
  });
});
