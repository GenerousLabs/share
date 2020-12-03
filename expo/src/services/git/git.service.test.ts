import { describe, expect, it, jest } from "@jest/globals";
import git from "isomorphic-git";
import { Volume } from "memfs";
import { gitFsHttp } from "../../shared.constants";
import { FS } from "../../shared.types";
import { gitSetEncryptedExtraHeaders } from "./git.service";

const mockGetNewGitConfigFS = () => {
  const vol = Volume.fromJSON({
    "/repo/.git/config": ``,
    "/repo/.git/encrypted/.git/config": ``,
  });
  return vol as typeof vol & FS;
};

describe("git.service", () => {
  describe("isomorphic-git", () => {
    describe("git.setConfig()", () => {
      it('Supports [http "http://host"] sections #oNYCQ8', async () => {
        const fs = mockGetNewGitConfigFS();
        await git.setConfig({
          fs,
          gitdir: "/repo/.git/",
          path: "http.http://localhost:8000.extraHeader",
          value: "Authorization: Bearer abc123",
        });
        expect(fs.readFileSync("/repo/.git/config", "utf8")).toEqual(
          `\n[http "http://localhost:8000"]\n\textraHeader = Authorization: Bearer abc123`
        );
      });
    });
  });
});
