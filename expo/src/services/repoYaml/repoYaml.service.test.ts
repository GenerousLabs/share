import { describe, it, expect } from "@jest/globals";
import { is } from "bluebird";
import {
  isRepoYaml,
  isValidRemote,
  _isOptionalString,
  _isRequiredString,
} from "./repoYaml.service";

describe("repoYaml.service", () => {
  const exmampleKeys = {
    content: "VI1e1NjTfbLaIJ8St1HpIJL0yvITZ/v6vSnVbh0F1P0=",
    filenames: "VI2e1NjTfbLaIJ8St1HpIJL0yvITZ/v6vSnVbh0F1P0=",
    salt: "VI3e1NjTfbLaIJ8St1HpIJL0yvITZ/v6vSnVbh0F1P0=",
  };
  const example = {
    id: "repo-example",
    name: "repo example",
    type: "library",
    remoteUrl: "http://u:token@localhost:8000/user/repo.git",
    isReadOnly: false,
  };

  describe("isRepoYaml()", () => {
    it("Fails for an empty object #haHqU5", () => {
      expect(isRepoYaml({})).toEqual(false);
    });

    it("Succeeds for a minimally valid repo #WCGhjg", () => {
      expect(isRepoYaml(example)).toEqual(true);
    });

    it("Returns false for any additional properties #ZK2Nzy", () => {
      expect(isRepoYaml({ ...example, foo: "bar" })).toEqual(false);
    });

    it("Fails for a missing key #PCwIJs", () => {
      expect(
        isRepoYaml({
          ...example,
          keysContentBase64: exmampleKeys.content,
        })
      ).toEqual(false);
    });

    it("Succeeds with all keys present #LlkSgH", () => {
      expect(
        isRepoYaml({
          ...example,
          keysContentBase64: exmampleKeys.content,
          keysFilenamesBase64: exmampleKeys.filenames,
          keysSaltBase64: exmampleKeys.salt,
        })
      ).toEqual(true);
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
