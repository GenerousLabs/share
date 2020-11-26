import { describe, it, expect } from "@jest/globals";
import { is } from "bluebird";
import {
  isRepoYaml,
  isValidRemote,
  _isOptionalString,
  _isRequiredString,
} from "./repoYaml.service";

describe("repoYaml.service", () => {
  const exampleHeaders = {
    Authorization: "Bearer exampletoken",
  };
  const exmampleKeys = {
    content: "VI1e1NjTfbLaIJ8St1HpIJL0yvITZ/v6vSnVbh0F1P0=",
    filenames: "VI2e1NjTfbLaIJ8St1HpIJL0yvITZ/v6vSnVbh0F1P0=",
    salt: "VI3e1NjTfbLaIJ8St1HpIJL0yvITZ/v6vSnVbh0F1P0=",
  };
  const exampleRemote = {
    url: "https://example.tld/user/repo.git",
  };
  const example = {
    name: "repo example",
    remotes: [exampleRemote],
    id: "repo-example",
    slug: "repo-example",
  };

  describe("_isRequiredString()", () => {
    it("Returns false for undefined #OnQsck", () => {
      expect(_isRequiredString(undefined)).toEqual(false);
    });

    it("Returns false for an empty string #HohERD", () => {
      expect(_isRequiredString("")).toEqual(false);
    });

    it("Returns true for a string of 1 character #uPAoUx", () => {
      expect(_isRequiredString("a")).toEqual(true);
    });
  });

  describe("_isOptionalString()", () => {
    it("Returns true for undefined #0JyPrw", () => {
      expect(_isOptionalString(undefined)).toEqual(true);
    });

    it("Returns false for an empty string #qFSxyS", () => {
      expect(_isOptionalString("")).toEqual(false);
    });

    it("Returns true for a string of 1 character #FTJhV5", () => {
      expect(_isOptionalString("a")).toEqual(true);
    });
  });

  describe("isValidRemote()", () => {
    it("Returns true for a minimally valid remote #ToYjVh", () => {
      expect(isValidRemote(exampleRemote)).toEqual(true);
    });

    it("Returns true for a valid remote with all properties #7F9t47", () => {
      expect(
        isValidRemote({
          ...exampleRemote,
          keys: exmampleKeys,
          headers: exampleHeaders,
          keyPassword: "example",
        })
      ).toEqual(true);
    });

    it("Returns false for a remote missing one key #wyh76b", () => {
      const { content } = exmampleKeys;
      expect(isValidRemote({ ...exampleRemote, keys: { content } })).toEqual(
        false
      );
    });
  });

  describe("isRepoYaml()", () => {
    it("Fails for an empty object #haHqU5", () => {
      expect(isRepoYaml({})).toEqual(false);
    });

    it("Succeeds for a minimally valid repo #WCGhjg", () => {
      expect(isRepoYaml(example)).toEqual(true);
    });

    it("Fails for a missing key #PCwIJs", () => {
      expect(
        isRepoYaml({
          ...example,
          remotes: [
            {
              ...exampleRemote,
              keys: {
                content: exmampleKeys.content,
              },
            },
          ],
        })
      ).toEqual(false);
    });

    it("Fails for an entry missing id #ZrpRAg", () => {
      expect(
        isRepoYaml({
          ...example,
          id: undefined,
        })
      ).toEqual(false);
    });
  });
});
