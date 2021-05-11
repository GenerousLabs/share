import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjsBase, { Dayjs } from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import debug from "debug";
import * as FileSystem from "expo-file-system";
import { ensureDirectoryExists } from "git-encrypted";
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
} from "react-native-logs";
import { gitFsHttp, LOGS_PATH } from "../../shared.constants";
import { getFileContents, join } from "../fs/fs.service";

export const DEFAULT_SEVERITY = __DEV__ ? "debug" : "error";

const LOG_SEVERITY_KEY = "__appLogSeverity";

const ensureLogDirExists = async () => {
  await ensureDirectoryExists({ fs: gitFsHttp.fs, path: LOGS_PATH });
};

// `react-native-logs` disables new extensions by default, which makes no sense.
// We enable them all on startup every time to workaround this until the next
// version comes out which changes this.
export const enableAllLogExtensions = async () => {
  const extensions = rootLogger.getExtensions();
  extensions.forEach(rootLogger.enable);
};

const dayjsUtc = dayjsBase.extend(utcPlugin);
const dayjs = dayjsUtc.utc();

export const _getFileName = (dayjs: Dayjs) => {
  return `${dayjs.format("YYYY-MM-DD")}.log`;
};

export const _getFilePath = (filename: string) => join(LOGS_PATH, filename);

export const rootLogger = logger.createLogger({
  transport: (props) => {
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

export const setLogSeverity = async (severity?: string) => {
  if (typeof severity === "undefined") {
    const savedSeverity = await AsyncStorage.getItem(LOG_SEVERITY_KEY);

    rootLogger.setSeverity(savedSeverity || DEFAULT_SEVERITY);
    return;
  }

  rootLogger.setSeverity(severity);
  await AsyncStorage.setItem(LOG_SEVERITY_KEY, severity);
};

// NOTE: This is called only one time per app load.  It is not called on hot
// reload in development.  The redux sagas are only started AFTER this
// completes, but all node_modules will be loaded before this.
export const initLogger = async () => {
  await Promise.all([
    ensureLogDirExists(),
    enableAllLogExtensions(),
    setLogSeverity(),
  ]);
};

export const getLogs = async ({ skipDays = 0 }: { skipDays?: number } = {}) => {
  const filepath = _getFilePath(_getFileName(dayjs));
  const l = await getFileContents({
    filepath,
    createParentDir: false,
  });
  debugger;
  return l;
};
