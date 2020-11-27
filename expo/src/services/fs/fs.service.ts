import Bluebird from "bluebird";
import * as FileSystem from "expo-file-system";
import { trim, trimEnd, trimStart } from "lodash";
import { groupBy } from "remeda";
import { ENOENT, gitFsHttp, PATH_SEPARATOR } from "../../shared.constants";

export const getDirectories = async () => {};

export const join = (...pathPieces: (string | undefined | null)[]) => {
  // Trim any leading / trailing slashes except from the beginning or the end of
  // the entire path.
  return pathPieces
    .filter((val): val is string => typeof val === "string")
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

export const mkdirp = async ({ path }: { path: string }) => {
  // We can use FileSystem directly, which has its own `mkdir -p` equivalent
  await FileSystem.makeDirectoryAsync(
    join(FileSystem.documentDirectory, path),
    { intermediates: true }
  );
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

  const { directories = [], files = [] } = groupBy(stats, (entry) => {
    return entry.stat.isDirectory() ? "directories" : "files";
  });

  return { directories, files };
};

export const doesDirectoryExist = async ({ path }: { path: string }) => {
  const { fs } = gitFsHttp;

  return fs.promises.stat(path).then(
    (stat) => {
      return stat.isDirectory();
    },
    (error) => {
      if (error.code === ENOENT) {
        return false;
      }
      throw error;
    }
  );
};

export const doesFileExist = async ({ path }: { path: string }) => {
  const { fs } = gitFsHttp;

  return await fs.promises.stat(path).then(
    (stat) => {
      return stat.isFile();
    },
    (error) => {
      if (error.code === ENOENT) {
        return false;
      }
      throw error;
    }
  );
};
