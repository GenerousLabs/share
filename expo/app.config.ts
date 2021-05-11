import { ExpoConfig, ConfigContext } from "@expo/config";

// NOTE: It seems that `app.config.ts` is not loaded during jest tests

const commitHash = process.env.SHARE_VERSION || "dev";
const hostname = process.env.SHARE_HOSTNAME || "localhost:8000";
const logSagas =
  typeof process.env.LOG_SAGAS === "string" && process.env.LOG_SAGAS === "1"
    ? true
    : false;

const extra = {
  commitHash,
  hostname,
  logSagas,
};

const getAdditionalConfig = () => {
  if (process.env.NODE_ENV === "production") {
    return {
      name: "Generous Share",
      slug: "generous-share",
      extra,
    };
  } else if (process.env.NODE_ENV === "staging") {
    return {
      name: "Generous Share Staging",
      slug: "generous-share-staging",
      extra,
    };
  }
  return {
    name: "Generous Share DEV",
    slug: "generous-share-dev",
    extra,
  };
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const additionalConfig = getAdditionalConfig();

  return {
    ...config,
    ...additionalConfig,
  };
};
