import fs from "expo-fs";
import slugify from "slugify";
import invariant from "tiny-invariant";
import { call, put, select } from "typed-redux-saga/macro";
import { RootState } from "../../store";
import { join } from "../fs/fs.service";
import { commitAll } from "../repo/repo.actions";
import { selectRepoById } from "../repo/repo.state";
import { createNewOffer } from "./library.actions";
import { offerToString } from "./library.service";

export function* createNewOfferEffect(
  action: ReturnType<typeof createNewOffer>
) {
  const { offer } = action.payload;

  const repo = yield* select(selectRepoById, offer.repoId);
  invariant(repo, `Failed to find repo #NT2f2V ${offer.repoId}`);

  const repoPath = repo.path;

  const offerString = offerToString({ offer });

  const directoryName = slugify(offer.title, { lower: true });
  const directoryPath = join(repoPath, directoryName);
  const offerPath = join(directoryPath, "index.md");

  yield* call(fs.promises.mkdir, directoryPath);
  yield* call(fs.promises.writeFile, offerPath, offerString, {
    encoding: "utf8",
  });

  yield* put(
    commitAll({
      repoId: offer.repoId,
      message: "Creating a new offer",
    })
  );
}
