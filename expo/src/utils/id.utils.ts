import { customAlphabet } from "nanoid/non-secure";
import nolookalikes from "nanoid-dictionary/nolookalikes-safe";

const _generateId = customAlphabet(nolookalikes, 8);
export const generateId = async () => {
  return _generateId();
};
