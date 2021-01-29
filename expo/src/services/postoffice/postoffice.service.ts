import {
  decode as base64Decode,
  encode as base64Encode,
} from "@stablelib/base64";
import { decode as utf8Decode, encode as utf8Encode } from "@stablelib/utf8";
import fetch from "cross-fetch";
import { customRandom } from "nanoid";
import nolookalikes from "nanoid-dictionary/nolookalikes";
import "react-native-get-random-values";
import { scrypt } from "scrypt-js";
import tweetnacl from "tweetnacl";
import { getPostofficeUrl } from "../remote/remote.service";

const SCRYPT_N = 1024;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

const createPassword = customRandom(nolookalikes, 10, tweetnacl.randomBytes);

export const concat = (a: Uint8Array, b: Uint8Array) => {
  const length = a.length + b.length;
  const result = new Uint8Array(length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
};

export const split = (combined: Uint8Array, length: number) => {
  const a = combined.slice(0, length);
  const b = combined.slice(length);
  return [a, b];
};

export const encryptMessage = async ({
  code,
  password,
}: {
  code: string;
  password?: string;
}) => {
  const actualPassword =
    typeof password === "string" ? password : await createPassword();
  const passwordBuffer = utf8Encode(actualPassword);
  const scryptSalt = tweetnacl.randomBytes(tweetnacl.box.nonceLength);
  const key = await scrypt(
    passwordBuffer,
    scryptSalt,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    tweetnacl.secretbox.keyLength
  );
  const nonce = tweetnacl.randomBytes(tweetnacl.box.nonceLength);
  const message = utf8Encode(code);
  const encrypted = tweetnacl.secretbox(message, nonce, key);

  const noncePlusEncryptedMessage = concat(nonce, encrypted);

  const saltPlusNoncePlusEncryptedMessage = concat(
    scryptSalt,
    noncePlusEncryptedMessage
  );

  const outputAsString = base64Encode(saltPlusNoncePlusEncryptedMessage);

  return { message: outputAsString, password: actualPassword };
};

export const getCodeFromPostoffice = async ({
  postofficeCode,
  getReply,
}: {
  postofficeCode: string;
  getReply?: boolean;
}) => {
  const parts = postofficeCode.split("#");
  // TODO Better validation here
  if (parts.length !== 2) {
    throw new Error("Invalid postofficeCode. #YdEHir");
  }
  const [id, password] = parts;

  const url = await getPostofficeUrl({
    id,
    reply: typeof getReply === "boolean" ? getReply : false,
  });
  const result = await fetch(url);
  const body: { message: string } = await result.json();
  if (typeof body.message !== "string") {
    throw new Error("Failed to fetch postoffice message. #KOjU1O");
  }

  const encrypted = base64Decode(body.message);

  const [scryptSalt, noncePlusEncryptedMessage] = split(
    encrypted,
    tweetnacl.secretbox.nonceLength
  );
  const [nonce, encryptedCode] = split(
    noncePlusEncryptedMessage,
    tweetnacl.secretbox.nonceLength
  );

  const passwordBuffer = utf8Encode(password);

  const key = await scrypt(
    passwordBuffer,
    scryptSalt,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    tweetnacl.secretbox.keyLength
  );

  const codeArray = tweetnacl.secretbox.open(encryptedCode, nonce, key);
  if (codeArray === null) {
    throw new Error("Failed to decrypt postoffice message. #QcDN07");
  }
  const code = utf8Decode(codeArray);

  return code;
};

export const sendCodeToPostoffice = async ({ code }: { code: string }) => {
  const { message, password } = await encryptMessage({ code });
  const url = await getPostofficeUrl();
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { id }: { id: string } = await response.json();
  return `${id}#${password}`;
};

export const sendReplyToPostoffice = async ({
  code,
  replyToPostofficeCode,
}: {
  code: string;
  replyToPostofficeCode: string;
}) => {
  const parts = replyToPostofficeCode.split("#");
  // TODO Better validation here
  if (parts.length !== 2) {
    throw new Error("Invalid postofficeCode. #eechOc");
  }
  const [id, password] = parts;

  const { message } = await encryptMessage({ code, password });

  const url = await getPostofficeUrl({ id });
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
