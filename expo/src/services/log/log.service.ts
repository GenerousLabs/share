/**
 * TODO
 *
 * - [ ] Add the option to disable / enable log levels
 *   - Where do we store the value?
 */
import dayjsBase, { Dayjs } from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import * as FileSystem from "expo-file-system";
import { LOGS_PATH } from "../../shared.constants";
import { join } from "../fs/fs.service";

const LINE_PART_SEPARATOR = " " as const;
const NAMESPACE_DELIMITER = ":" as const;

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

const _getExistingFileContents = async (filepath: string) => {
  try {
    // NOTE: We need the `await` here for this catch block to catch
    return await FileSystem.readAsStringAsync(filepath, {
      encoding: "utf8",
    });
  } catch (error) {
    // In the event of any error (expo's error codes are impossible to discern),
    // check if the file exists, and if not, return an empty string, otherwise
    // re throw whatever error we caught.
    const stats = await FileSystem.getInfoAsync(filepath);
    if (!stats.exists) {
      // If the file does not exist, check to make sure that its containing
      // directory does exist
      const dirStats = await FileSystem.getInfoAsync(logDirPath);
      if (!dirStats.isDirectory) {
        await FileSystem.makeDirectoryAsync(logDirPath);
      }

      return "";
    }
    throw error;
  }
};

export const _appendLineToLogFile = async ({
  filename,
  line,
}: {
  filename: string;
  line: string;
}) => {
  const filepath = _getFilePath(filename);
  const existingContents = await _getExistingFileContents(filepath);
  const newContents = `${existingContents}\n${line}`;
  await FileSystem.writeAsStringAsync(filepath, newContents, {
    encoding: "utf8",
  });
};

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

export const _logFunctionFactory = (namespace: string): LogFunction => (
  level,
  message,
  meta
) => {
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

  // NOTE: We don't await here, we want `_log()` to return instantly
  _appendLineToLogFile({ filename, line }).catch((error) => {
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
  return await _getExistingFileContents(filepath);
};

export const deleteLogs = async ({
  skipDays = 0,
}: { skipDays?: number } = {}) => {
  // TODO Implement deleteLogs()
  throw new Error("Yet to be implemented. #rCOtsm");
  const filenames = await FileSystem.readDirectoryAsync(logDirPath);
};
