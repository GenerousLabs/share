import { readFile, writeFile } from "fs/promises";
import humanId from "human-id";
import { join } from "path";
import { MINIMUM_POSTOFFICE_ID_LENGTH, POSTOFFICE_PATH } from "../../constants";

type MessageData = {
  message: string;
  timestamp: number;
};

export const _generateId = (): string =>
  humanId({ separator: "-", capitalize: false });

export const assertIdIsValid = ({ id }: { id: string }): Promise<void> => {
  if (typeof id !== "string") {
    throw new Error("Invalid box ID #rpGY6T");
  }
  if (id.length < MINIMUM_POSTOFFICE_ID_LENGTH) {
    throw new Error("Invaoid box ID #xkzG9V");
  }
  return;
};

// This is noop for now, can be implemented later
export const _assertIdIsUnique = ({}: { id: string }): void => {
  return;
};

export const _assertBoxIdExists = ({}: { id: string }): Promise<void> => {
  // TODO Implement a real check here
  return;
};

export const _readMessage = async ({
  path,
}: {
  path: string;
}): Promise<string> => {
  const dataAsJson = await readFile(path, { encoding: "utf8" });
  const data = JSON.parse(dataAsJson) as MessageData;
  const { message } = data;
  // TODO Apply some checks to the timestmap here
  // Expire messages and delete them after expiry
  return message;
};

export const getMessage = async ({ id }: { id: string }): Promise<string> => {
  await assertIdIsValid({ id });
  const path = join(POSTOFFICE_PATH, id);
  return _readMessage({ path });
};

export const getReply = async ({ id }: { id: string }): Promise<string> => {
  await assertIdIsValid({ id });
  const path = join(POSTOFFICE_PATH, `${id}.reply`);
  return _readMessage({ path });
};

export const _writeMessage = async ({
  path,
  message,
  timestamp,
}: {
  path: string;
  message: string;
  timestamp: number;
}): Promise<void> => {
  const data = { message, timestamp };
  const dataAsJson = JSON.stringify(data);
  await writeFile(path, dataAsJson, { encoding: "utf8" });
};

export const saveNewMessage = async ({
  message,
  timestamp,
}: {
  message: string;
  timestamp: number;
}): Promise<string> => {
  const id = _generateId();
  _assertIdIsUnique({ id });

  const path = join(POSTOFFICE_PATH, id);

  await _writeMessage({ path, message, timestamp });

  return id;
};

export const saveMessageReply = async ({
  id,
  message,
  timestamp,
}: {
  id: string;
  message: string;
  timestamp: number;
}): Promise<void> => {
  _assertBoxIdExists({ id });

  const path = join(POSTOFFICE_PATH, `${id}.reply`);

  await _writeMessage({ path, message, timestamp });
};
