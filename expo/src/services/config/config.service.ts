import fs from "expo-fs";

export type Config = {
  remote: {
    protocol: string;
    host: string;
    username: string;
    token: string;
  };
};

const CONFIG_PATH = "/repos/config.json";

export const getConfigFromFilesystem = async () => {
  const configJson = (await fs.promises.readFile(CONFIG_PATH, {
    encoding: "utf8",
  })) as string;
  const config: Config = JSON.parse(configJson);
  return config;
};

export const writeConfigToFilesystem = async ({
  config,
}: {
  config: Config;
}) => {
  const configJson = JSON.stringify(config);
  await fs.promises.writeFile(CONFIG_PATH, configJson, { encoding: "utf8" });
};
