import { customRandom } from "nanoid";
import nolookalikes from "nanoid-dictionary/nolookalikes";
import tweetnacl from "tweetnacl";

export const createPassword = customRandom(
  nolookalikes,
  10,
  tweetnacl.randomBytes
);
