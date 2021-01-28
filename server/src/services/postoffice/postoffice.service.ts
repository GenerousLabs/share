import { writeFile } from "fs/promises";
import humanId from "human-id";
import { join } from "path";
import { POSTOFFICE_PATH } from "../../constants";

export const _generateId = (): string =>
  humanId({ separator: "-", capitalize: false });

// This is noop for now, can be implemented later
export const _assertIdIsUnique = ({}: { id: string }): void => {
  return;
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

export const _assertBoxIdExists = ({}: { id: string }): Promise<void> => {
  // TODO Implement a real check here
  return;
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
