import { splitRepo } from "./repoNames";

describe("repoNames.utils", () => {
  describe("splitRepo()", () => {
    it("Correctly parses foo/bar #6tIBxE", () => {
      expect(splitRepo("foo/bar")).toEqual({ org: "foo", repo: "bar" });
    });

    it("Throws with 2 slashes #w8X75v", () => {
      expect(() => splitRepo("foo/bar/baz")).toThrow();
    });

    it("Throws with 0 slashes #4wrw5v", () => {
      expect(() => splitRepo("foobarbaz")).toThrow();
    });

    it("Throws with empty repo name #NmRDsR", () => {
      expect(() => splitRepo("foo/")).toThrow();
    });

    it("Throws with empty string #2qvnMe", () => {
      expect(() => splitRepo("")).toThrow();
    });

    it("Throws with empty org name #RXrsWm", () => {
      expect(() => splitRepo("/bar")).toThrow();
    });

    it("Throws with single slash only #wXePck", () => {
      expect(() => splitRepo("/")).toThrow();
    });
  });
});
