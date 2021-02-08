import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjsBase, { Dayjs } from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import * as FileSystem from "expo-file-system";
import { ensureDirectoryExists } from "git-encrypted";
import { gitFsHttp, LOGS_PATH } from "../../shared.constants";
import { appendLineTofile, getFileContents, join } from "../fs/fs.service";

const DISABLED_NAMESPACES: string[] = [];

const DISABLED_STORAGE_KEY = "__disabledLogNamespaces";

const LINE_PART_SEPARATOR = " " as const;
const NAMESPACE_DELIMITER = ":" as const;

export const initLogger = async () => {
  await Promise.all([
    async () => {
      await ensureDirectoryExists({ fs: gitFsHttp.fs, path: LOGS_PATH });
    },
    async () => {
      // NOTE: This is a little wacky. It's async but we start sync. That means the
      // settings are loaded AFTER the first sagas are invoked, etc. It's also ugly,
      // pushing and popping from arrays and so on. But, it'll have to do for now...
      try {
        const result = await AsyncStorage.getItem(DISABLED_STORAGE_KEY);
        if (typeof result === "string" && result.length > 0) {
          const namespaces = result.split(",");
          DISABLED_NAMESPACES.push(...namespaces);
        }
      } catch (error) {
        console.error("Error setting disabled log namespaces #a6zeoO", error);
      }
    },
  ]);
};

const logLevels = ["debug", "info", "warn", "error"] as const;
export type LogLevel = typeof logLevels[number];
const logLevelMap = Object.fromEntries(
  logLevels.map((level, index) => [level, index])
) as Record<LogLevel, number>;

type LogLevelFunction = (message: string, ...meta: any[]) => void;

type LogFunction = (
  level: LogLevel,
  ...rest: Parameters<LogLevelFunction>
) => void;
type LogBase = LogFunction & Record<LogLevel, LogLevelFunction>;
type Log = LogBase & {
  extend: (namespace: string) => Log;
};

const dayjsUtc = dayjsBase.extend(utcPlugin);

const logDirPath = FileSystem.documentDirectory + LOGS_PATH;

export const _getFilePath = (filename: string) => join(logDirPath, filename);

export const _metaToString = (meta: any[]): string => {
  if (meta.length === 1) {
    return JSON.stringify(meta[0]);
  }
  return JSON.stringify(meta);
};

export const buildLogLine = ({
  date,
  level,
  message,
  namespace,
  meta,
}: {
  date: string;
  level: LogLevel;
  message: string;
  namespace: string;
  meta?: any[];
}) => {
  const dateLevel = [date, level];
  const withNamespace =
    namespace.length > 0 ? dateLevel.concat(namespace) : dateLevel;
  const lineBase = withNamespace.concat(message);
  if (typeof meta === "undefined") {
    return lineBase.join(LINE_PART_SEPARATOR);
  }
  const metaString = _metaToString(meta);
  return lineBase.concat(metaString).join(LINE_PART_SEPARATOR);
};

export const _getDateString = (dayjs: Dayjs) => {
  return dayjs.format("YYYY-MM-DD_HH:mm:ss");
};

export const _getFileName = (dayjs: Dayjs) => {
  return `${dayjs.format("YYYY-MM-DD")}.log`;
};

export const _isNamespaceDisabled = (namespace: string) => {
  // NOTE: `namespace` here is joined by the separator
  const namespaces = namespace.split(NAMESPACE_DELIMITER);
  for (const disabledNamespace of DISABLED_NAMESPACES) {
    if (namespaces.indexOf(disabledNamespace) !== -1) {
      return true;
    }
  }
  return false;
};

export const _logFunctionFactory = (namespace: string): LogFunction => (
  level,
  message,
  meta
) => {
  if (_isNamespaceDisabled(namespace)) {
    return;
  }

  const dayjs = dayjsUtc.utc();
  const date = _getDateString(dayjs);
  const filename = _getFileName(dayjs);
  const line = buildLogLine({
    date,
    level,
    message,
    namespace,
    meta,
  });

  try {
    if (__DEV__) {
      if (typeof console !== "undefined") {
        const consoleString = `${namespace} ${message}`;
        const args =
          typeof meta === "undefined" ? [consoleString] : [consoleString, meta];
        if (level in console) {
          console[level](...args);
        } else {
          console.log(...args);
        }
      }
    }
  } catch (error) {
    // Silently ignore console fail errors
  }

  // TODO TODOLOGS - Fix race condition here
  /**
   * During app boot, there can be many calls to this in sequence, each one
   * checks if the logs directory exists, and then each one finds it does not,
   * then each one tries to create it, all in parallel, creating a wonderful
   * race condition. This is partially addressed by ensuring the logs directory
   * exists before the app loads, but not really because logging starts
   * immediately.
   */

  // NOTE: We don't await here, we want `_log()` to return instantly
  const filepath = _getFilePath(filename);
  appendLineTofile({ filepath, line }).catch((error) => {
    // NOTE: We need to use the `console` here as this is a logger error
    try {
      if (typeof console !== "undefined" && "error" in console) {
        console.error("log.service _log threw #X1YVjd", error);
      }
    } catch (error) {
      // Silently swallow logging errors if the console is not available
    }
  });
};

export const _logFactory = (namespaces: string[] = []) => {
  const namespace = namespaces.join(NAMESPACE_DELIMITER);
  const logFn = _logFunctionFactory(namespace) as Log;
  logLevels.forEach((level) => {
    logFn[level] = logFn.bind(null, level);
  });
  logFn.extend = (newNamespace: string) =>
    _logFactory(namespaces.concat(newNamespace));
  return logFn;
};

export const rootLogger = _logFactory();

export const getLogs = async ({ skipDays = 0 }: { skipDays?: number } = {}) => {
  const dayjs = dayjsUtc.utc().subtract(skipDays, "day");
  const filename = _getFileName(dayjs);
  const filepath = _getFilePath(filename);
  return await getFileContents({ filepath, createParentDir: false });
};

export const deleteLogs = async ({
  skipDays = 0,
}: { skipDays?: number } = {}) => {
  // TODO Implement deleteLogs()
  throw new Error("Yet to be implemented. #rCOtsm");
  const filenames = await FileSystem.readDirectoryAsync(logDirPath);
};

export const disable = (namespace: string) => {
  if (DISABLED_NAMESPACES.indexOf(namespace) !== -1) {
    return;
  }
  DISABLED_NAMESPACES.push(namespace);
  AsyncStorage.setItem(DISABLED_STORAGE_KEY, DISABLED_NAMESPACES.join(","));
};

export const enable = (namespace: string) => {
  const foundIndex = DISABLED_NAMESPACES.findIndex(
    (entry) => entry === namespace
  );
  DISABLED_NAMESPACES.splice(foundIndex, 1);
  AsyncStorage.setItem(DISABLED_STORAGE_KEY, DISABLED_NAMESPACES.join(","));
};

if (__DEV__) {
  (globalThis as any).enableLogNamespace = enable;
  (globalThis as any).disableLogNamespace = disable;
}
