import Bluebird from "bluebird";
import { trim, trimStart, trimEnd } from "lodash";
import { gitFsHttp, PATH_SEPARATOR } from "../../shared.constants";
import { groupBy } from "remeda";

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

export const getDirectoryContents = async ({ path }: { path: string }) => {
  const { fs } = gitFsHttp;

  const names = await fs.promises.readdir(path);

  const entries = names.filter((name) => {
    // Ignore all filenames beginning with `.`
    if (name[0] === ".") {
      return false;
    }
    return true;
  });

  const stats = await Bluebird.map(entries, async (entry) => {
    const entryPath = join(path, entry);
    const stat = await fs.promises.stat(entryPath);
    return { name: entry, path: entryPath, stat };
  });

  const { directories, files } = groupBy(stats, (entry) => {
    return entry.stat.isDirectory() ? "directories" : "files";
  });

  return { directories, files };
};
