import * as zod from "zod";
import { KeysBase64 } from "git-encrypted";
import * as yaml from "js-yaml";
import { gitFsHttp, INVITE_PREFIX, RepoType } from "../../shared.constants";
import {
  ConnectionInRedux,
  ConnectionOnDisk,
  ConnectionSchema,
  RepoInRedux,
} from "../../shared.types";
import { getFileContents, join } from "../fs/fs.service";
import { getRepoPath } from "../repo/repo.service";
import { createRemoteUrlForSharedRepo } from "../remote/remote.service";
import { getKeysIfEncryptedRepo } from "../../utils/key.utils";

export enum ConnectionCodeType {
  INVITE = "INVITE",
  CONFIRM = "CONFIRM",
  SHARING = "SHARING",
}

export const base64ToString = (input: string) => {
  return globalThis.atob(input);
};

export const stringToBase64 = (input: string) => {
  return globalThis.btoa(input);
};

export const createConnectionCode = ({
  myKeysBase64,
  myRemoteUrl,
  type,
}: {
  myRemoteUrl: string;
  myKeysBase64: KeysBase64;
  type: ConnectionCodeType;
}) => {
  const dataString = JSON.stringify({
    u: myRemoteUrl,
    k: {
      c: myKeysBase64.content,
      f: myKeysBase64.filename,
      s: myKeysBase64.salt,
    },
  });
  const dataBase64 = stringToBase64(dataString);
  return `${type}_${dataBase64}`;
};

const DecodeSchema = zod.object({
  u: zod.string().url().nonempty(),
  k: zod.object({
    c: zod.string().nonempty(),
    f: zod.string().nonempty(),
    s: zod.string().nonempty(),
  }),
});

export const parseInviteCode = ({
  code,
  type,
}: {
  code: string;
  type: ConnectionCodeType;
}): {
  theirRemoteUrl: string;
  theirKeysBase64: KeysBase64;
} => {
  if (!code.startsWith(`${type}_`)) {
    throw new Error(`Invalid code. Must begin ${type}. #Ic2bYT`);
  }
  const base64 = code.substr(type.length + 1);
  console.log("connection.service parseInviteCode #iL1GII", base64);
  const jsonString = base64ToString(base64);
  const data = JSON.parse(jsonString);
  const validData = DecodeSchema.parse(data);

  return {
    theirRemoteUrl: validData.u,
    theirKeysBase64: {
      content: validData.k.c,
      filename: validData.k.f,
      salt: validData.k.s,
    },
  };
};

export const parseYaml = (input: string): ConnectionOnDisk[] => {
  const unvalidated = yaml.safeLoad(input) as {
    connections?: ConnectionOnDisk[];
  };
  if (
    typeof unvalidated === "undefined" ||
    typeof unvalidated.connections === "undefined"
  ) {
    return [];
  }

  const connections = unvalidated.connections.filter(ConnectionSchema.check);

  return connections;
};

export const yamlStringifyConnections = (connections: ConnectionOnDisk[]) => {
  // NOTE: The file contains one key `connections:` which wraps the array
  return yaml.safeDump({ connections });
};

export const getConnectionsYamlPath = () => {
  const meRepoPath = getRepoPath({ type: RepoType.me });
  const connectionsYamlPath = join(meRepoPath, "connections.yaml");
  return connectionsYamlPath;
};

export const loadConnectionsFromConnectionsYaml = async () => {
  const connectionsYamlPath = getConnectionsYamlPath();
  const yamlString = await getFileContents({
    filepath: connectionsYamlPath,
    createParentDir: false,
  });
  const connections = parseYaml(yamlString);
  return connections;
};

export const saveConnectionToConnectionsYaml = async (
  connection: ConnectionInRedux
) => {
  const { fs } = gitFsHttp;
  const connectionsYamlPath = getConnectionsYamlPath();
  const connections = await loadConnectionsFromConnectionsYaml();
  const existingConnection = connections.find((c) => c.id === connection.id);
  if (typeof existingConnection !== "undefined") {
    // TODO: Do we want to make this call idempotent?
    throw new Error("Trying to add existing connection #0pzUCs");
  }
  const writeConnections = connections.concat(connection);
  const yamlString = yamlStringifyConnections(writeConnections);
  await fs.promises.writeFile(connectionsYamlPath, yamlString, {
    encoding: "utf8",
  });
};

export const getConnectionCode = async ({
  connection,
  repo,
  type,
}: {
  connection: ConnectionInRedux;
  repo: RepoInRedux;
  type: ConnectionCodeType;
}) => {
  const { url } = await createRemoteUrlForSharedRepo({
    repo,
    token: connection.token,
  });
  // TODO Figure out how to better handle adding `encrypted::` to the url
  const myRemoteUrl = `encrypted::${url}`;

  // TODO Get the token for the new repo
  const myKeysBase64 = await getKeysIfEncryptedRepo({ repo });
  if (typeof myKeysBase64 === "undefined") {
    throw new Error("Cannot get keys for invite repo #v9vvan");
  }

  const code = createConnectionCode({ type, myRemoteUrl, myKeysBase64 });

  return code;
};
