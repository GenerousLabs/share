import { customAlphabet } from "nanoid/non-secure";
import nolookalikes from "nanoid-dictionary/nolookalikes-safe";

const _generateId = customAlphabet(nolookalikes, 8);
const _generateUuid = customAlphabet(nolookalikes, 24);
export const generateId = async () => {
  return _generateId();
};

export const generateUuid = () => {
  return _generateId();
};
