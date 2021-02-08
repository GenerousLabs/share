import * as yaml from "js-yaml";
import { gitFsHttp, RepoType } from "../../shared.constants";
import {
  ConnectionInRedux,
  ConnectionOnDisk,
  ConnectionSchema,
  Invitation,
} from "../../shared.types";
import { getFileContents, join } from "../fs/fs.service";
import { getRepoPath } from "../repo/repo.service";

export const base64ToString = (input: string) => {
  return globalThis.atob(input);
};

export const stringToBase64 = (input: string) => {
  return globalThis.btoa(input);
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

export const createInvitationMessage = ({
  connectionRepoRemoteUrl,
  libraryRemoteUrl,
}: {
  connectionRepoRemoteUrl: string;
  libraryRemoteUrl: string;
}) => {
  const messageContent: Invitation = {
    connectionRepoRemoteUrl,
    libraryRemoteUrl,
  };

  const message = JSON.stringify(messageContent);

  return message;
};
