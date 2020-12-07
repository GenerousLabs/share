import Bluebird from "bluebird";
import * as FileSystem from "expo-file-system";
import { groupBy } from "remeda";
import { superpathjoin } from "superpathjoin";
import { ALL_PATHS, ENOENT, gitFsHttp } from "../../shared.constants";

export const join = superpathjoin;

export const dirname = (path: string) => {
  const last = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  if (last === -1) return ".";
  if (last === 0) return "/";
  return path.slice(0, last);
};

export const mkdirp = async ({ path }: { path: string }) => {
  // We can use FileSystem directly, which has its own `mkdir -p` equivalent
  await FileSystem.makeDirectoryAsync(
    join(FileSystem.documentDirectory, path),
    { intermediates: true }
  );
};

export const prependDocumentDirectoryIfNecessary = (path: string) => {
  if (path.startsWith("file://")) {
    return path;
  }
  return join(FileSystem.documentDirectory, path);
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

export const DANGEROUS_deleteEverything = async () => {
  await Bluebird.each(ALL_PATHS, async (path) => {
    await FileSystem.deleteAsync(join(FileSystem.documentDirectory, path), {
      idempotent: true,
    });
  });
};

/**
 * Get the contents of a file as a string, or an empty string if the file does
 * not exist. Does not throw if file does not exist.
 */
export const getFileContents = async ({
  filepath,
  createParentDir = true,
}: {
  filepath: string;
  createParentDir: boolean;
}) => {
  const path = prependDocumentDirectoryIfNecessary(filepath);
  try {
    // NOTE: We need the `await` here for this catch block to catch
    return await FileSystem.readAsStringAsync(path, {
      encoding: "utf8",
    });
  } catch (error) {
    // In the event of any error (expo's error codes are impossible to discern),
    // check if the file exists, and if not, return an empty string, otherwise
    // re throw whatever error we caught.
    const stats = await FileSystem.getInfoAsync(path);
    if (!stats.exists) {
      // If the file does not exist, check to make sure that its containing
      // directory does exist
      if (createParentDir) {
        const dirpath = dirname(path);
        const dirStats = await FileSystem.getInfoAsync(dirpath);
        if (!dirStats.isDirectory) {
          await FileSystem.makeDirectoryAsync(dirpath);
        }
      }

      return "";
    }
    throw error;
  }
};

export const appendLineTofile = async ({
  filepath,
  line,
}: {
  filepath: string;
  /** The line to append, without any newlines */
  line: string;
}) => {
  const path = prependDocumentDirectoryIfNecessary(filepath);

  const existingContents = await getFileContents({
    filepath: path,
    createParentDir: true,
  });

  // If the file is already empty, do not add a newline
  const newContents =
    existingContents === "" ? line : `${existingContents}\n${line}`;

  await FileSystem.writeAsStringAsync(path, newContents, {
    encoding: "utf8",
  });
};
