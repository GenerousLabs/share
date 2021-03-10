import { ExpoConfig, ConfigContext } from "@expo/config";

const __DEV__ = process.env.NODE_ENV !== "production";
const commitHash = process.env.SHARE_VERSION || "dev";
const hostname = process.env.SHARE_HOSTNAME || "localhost:8000";
const logSagas =
  typeof process.env.LOG_SAGAS === "string" && process.env.LOG_SAGAS === "1"
    ? true
    : false;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: __DEV__ ? "Generous Share DEV" : "Generous Share",
    slug: __DEV__ ? "generous-share-dev" : "generous-share",
    extra: {
      commitHash,
      hostname,
      logSagas,
    },
  };
};
