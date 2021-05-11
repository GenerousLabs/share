import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjsBase, { Dayjs } from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import debug from "debug";
import * as FileSystem from "expo-file-system";
import { ensureDirectoryExists } from "git-encrypted";
import { Alert } from "react-native";
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
} from "react-native-logs";
import { gitFsHttp, LOGS_PATH } from "../../shared.constants";
import { getFileContents, join } from "../fs/fs.service";

const ENABLED_STORAGE_KEY = "__enabledLogExtensions";
const DEBUG_STORAGE_KEY = "__DEBUG";

const ensureLogDirExists = async () => {
  await ensureDirectoryExists({ fs: gitFsHttp.fs, path: LOGS_PATH });
};

const loadEnabledLogger = async () => {
  // Disable it for now
  // return;
  // NOTE: This is a little wacky. It's async but we start sync. That means the
  // settings are loaded AFTER the first sagas are invoked, etc. It's also ugly,
  // pushing and popping from arrays and so on. But, it'll have to do for now...
  try {
    const result = await AsyncStorage.getItem(ENABLED_STORAGE_KEY);
    if (typeof result === "string" && result.length > 0) {
      const enabled = result.split(",");
      enabled.forEach((extension) => rootLogger.enable(extension));
    }
  } catch (error) {
    console.error("Error during log level enable #G5rcJj", error);
  }
};

export const enableAllLogExtensions = async () => {
  const extensions = rootLogger.getExtensions();
  extensions.forEach(rootLogger.enable);
  const enabled = extensions.join(",");
  await AsyncStorage.setItem(ENABLED_STORAGE_KEY, enabled);
};

export const disableAllLogExtensions = async () => {
  const extensions = rootLogger.getExtensions();
  extensions.forEach(rootLogger.disable);
  await AsyncStorage.setItem(ENABLED_STORAGE_KEY, "");
};

export const setDebug = async (debugString: string) => {
  try {
    await AsyncStorage.setItem(DEBUG_STORAGE_KEY, debugString);
    debug.enable(debugString);
  } catch (error) {
    Alert.alert("Error #YWEs8I", error.message);
  }
};

export const debugEverything = async () => {
  await setDebug("*");
};

export const debugNothing = async () => {
  await setDebug("");
};

const loadDebugSettings = async () => {
  try {
    const debugFromStorage = await AsyncStorage.getItem(DEBUG_STORAGE_KEY);
    if (typeof debugFromStorage === "string") {
      debug.enable(debugFromStorage);
    }
  } catch (error) {
    console.error("Error during log init #a6zeoO", error);
  }
};

// NOTE: This is called only one time per app load.  It is not called on hot
// reload in development.  The redux sagas are only started AFTER this
// completes, but all node_modules will be loaded before this.
export const initLogger = async () => {
  await Promise.all([
    ensureLogDirExists(),
    loadEnabledLogger(),
    loadDebugSettings(),
  ]);
};

(globalThis as any).setLogLevels = (levels = "*,-expo-fs") => {
  AsyncStorage.setItem(DEBUG_STORAGE_KEY, levels);
};

const dayjsUtc = dayjsBase.extend(utcPlugin);
const dayjs = dayjsUtc.utc();

export const _getFileName = (dayjs: Dayjs) => {
  return `${dayjs.format("YYYY-MM-DD")}.log`;
};

export const _getFilePath = (filename: string) => join(LOGS_PATH, filename);

export const rootLogger = logger.createLogger({
  transport: (props) => {
    console.log("transport #RmbEGG");
    if (__DEV__) {
      consoleTransport(props);
    }
    fileAsyncTransport(props);
  },
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    FS: FileSystem,
    fileName: _getFilePath(_getFileName(dayjs)),
  },
});

export const getLogs = async ({ skipDays = 0 }: { skipDays?: number } = {}) => {
  const filepath = _getFilePath(_getFileName(dayjs));
  const l = await getFileContents({
    filepath,
    createParentDir: false,
  });
  debugger;
  return l;
  return await getFileContents({ filepath, createParentDir: false });
};
