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
  id,
  message,
  timestamp,
}: {
  id: string;
  message: string;
  timestamp: number;
}): Promise<void> => {
  const path = join(POSTOFFICE_PATH, id);
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

  await _writeMessage({ id, message, timestamp });

  return id;
};
