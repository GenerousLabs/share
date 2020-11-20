import { trim, trimStart, trimEnd } from "lodash";
import { PATH_SEPARATOR } from "../../shared.constants";

export const getDirectories = async () => {};

export const join = (...pathPieces: string[]) => {
  // Trim any leading / trailing slashes except from the beginning or the end of
  // the entire path.
  return pathPieces
    .map((part, i, pieces) => {
      if (i === 0) {
        return trimEnd(part, PATH_SEPARATOR);
      } else if (i + 1 === pieces.length) {
        return trimStart(part, PATH_SEPARATOR);
      }
      return trim(part, PATH_SEPARATOR);
    })
    .join(PATH_SEPARATOR);
};
