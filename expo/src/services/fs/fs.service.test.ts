import { describe, it, expect } from "@jest/globals";
import { join } from "./fs.service";

describe("fs.service", () => {
  describe("join()", () => {
    it("joins absolute paths #MC5g5m", () => {
      expect(join("/absolute/", "/path/")).toEqual("/absolute/path/");
    });

    it("joins relative paths #meaJom", () => {
      expect(join("relative/", "/path/")).toEqual("relative/path/");
    });

    it("joins multiple deep paths #6GnTmX", () => {
      expect(
        join("/absolute/leading/directory", "trailing/directories/")
      ).toEqual("/absolute/leading/directory/trailing/directories/");
    });
  });
});
