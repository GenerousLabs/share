import Bluebird from "bluebird";
import * as FileSystem from "expo-file-system";
import fs from "expo-fs";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { ENOENT } from "../../shared.constants";
import { join } from "../fs/fs.service";

export const addDirectoryToZipFile = async ({
  zip,
  path,
}: {
  zip: JSZip;
  path: string;
}) => {
  const dirContents = await fs.promises.readdir(path);

  await Bluebird.each(dirContents, async (dirEntry) => {
    const entryPath = join(path, dirEntry);
    const entryStat = await fs.promises.stat(entryPath);

    if (entryStat.isDirectory()) {
      const zipFolderPath = join("/", path, dirEntry);
      const zipFolder = zip.folder(dirEntry) as JSZip;
      await addDirectoryToZipFile({ zip: zipFolder, path: entryPath });
    } else {
      const fileContents = await fs.promises.readFile(entryPath);
      zip.file(dirEntry, fileContents);
    }
  });

  return zip;
};

const uintArrayToBase64 = ({ input }: { input: Uint8Array }) => {
  return Buffer.from(input).toString("base64");
};

export const createZipFile = async ({ path }: { path: string }) => {
  if (path[0] !== "/") {
    throw new Error("createZipFile() called without an absolute path #biQXLl");
  }

  const zip = new JSZip();
  const zipExportFolder = zip.folder("export") as JSZip;

  try {
    const pathStat = await fs.promises.stat(path);

    if (pathStat.isDirectory()) {
      await addDirectoryToZipFile({ zip: zipExportFolder, path });

      const zipContents = await zip.generateAsync({ type: "uint8array" });
      const zipContentsBase64 = uintArrayToBase64({ input: zipContents });

      const zipFileUri = join(FileSystem.cacheDirectory, "/export.zip");

      await FileSystem.writeAsStringAsync(zipFileUri, zipContentsBase64, {
        encoding: "base64",
      });

      return zipFileUri;
    } else {
      throw new Error("createZipFile() path is a file not a directory #bTRtSZ");
    }
  } catch (error) {
    if (error.code === ENOENT) {
      throw new Error("createZipFile() path does not exist #vED2AD");
    }
    throw error;
  }
};

export const createAndShareZipFile = async ({ path }: { path: string }) => {
  const zipUri = await createZipFile({ path });

  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new Error("Sharing not available #WCQEYy");
  }

  await Sharing.shareAsync(zipUri);
};
