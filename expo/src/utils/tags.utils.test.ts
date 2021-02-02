import { describe, it, expect } from "@jest/globals";
import { parseTags } from "./tags.utils";

describe("tag.utils", () => {
  describe("parseTags()", () => {
    it("Parses tags #7XzswM", () => {
      expect(parseTags("#foo, bar baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("Strips extraneous characters #pcOgbf", () => {
      expect(parseTags("#foo@#% bar")).toEqual(["foo", "bar"]);
    });
  });
});
