import { describe, it, expect } from "@jest/globals";
import { hashifyTags, parseTags } from "./tags.utils";

describe("tag.utils", () => {
  describe("parseTags()", () => {
    it("Parses tags #7XzswM", () => {
      expect(parseTags("#foo, bar baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("Strips extraneous characters #pcOgbf", () => {
      expect(parseTags("#foo@#% bar")).toEqual(["foo", "bar"]);
    });

    it("Ignores leading and trailing whitespace #0fGph0", () => {
      expect(parseTags(" foo   bar     ")).toEqual(["foo", "bar"]);
    });

    it("Returns empty array for only invalid characters #H7H3Wk", () => {
      expect(parseTags("   , $ *  ")).toEqual([]);
    });

    it("Ignores tags made of only - or _ #nQV9o3", () => {
      expect(parseTags(" - -- _____ -_-__ 3one")).toEqual(["3one"]);
    });

    it("Only accepts - or _ in the middle of tags #DPBYiu", () => {
      expect(parseTags(" -- -_foo-_  bar-bar baz_baz_")).toEqual([
        "foo",
        "bar-bar",
        "baz_baz",
      ]);
    });
  });

  describe("hashifyTags()", () => {
    it("Returns empty string for no tags #JpTmsA", () => {
      expect(hashifyTags([])).toEqual("");
    });

    it("Returns hashed tags #jjWF6w", () => {
      expect(hashifyTags(["foo", "bar", "baz"])).toEqual("#foo, #bar, #baz");
    });
  });
});
