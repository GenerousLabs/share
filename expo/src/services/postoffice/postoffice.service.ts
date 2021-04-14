import {
  decode as base64Decode,
  encode as base64Encode,
} from "@stablelib/base64";
import { decode as utf8Decode, encode as utf8Encode } from "@stablelib/utf8";
import fetch from "cross-fetch";
import Constants from "expo-constants";
import "react-native-get-random-values";
import { scrypt } from "scrypt-js";
import tweetnacl from "tweetnacl";
import { CONFIG, POSTOFFICE_SEPARATOR } from "../../shared.constants";
import { PostofficeReply } from "../../shared.types";
import { createPassword } from "../../utils/password.utils";
import { getPostofficeCodeParams } from "./postoffice.utils";

// TODO TODOCONFIG Move this out to an .env or app build config file
const [devHost] =
  typeof Constants.manifest.debuggerHost === "string"
    ? Constants.manifest.debuggerHost.split(":")
    : ":";
const devUrl =
  devHost.length > 0
    ? `http://${devHost}:8000/postoffice`
    : CONFIG.postofficeUrl;
const POSTOFFICE_URL = __DEV__ ? devUrl : CONFIG.postofficeUrl;

const SCRYPT_N = 1024;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

export const getPostofficeUrl = async (
  {
    id,
    reply,
  }: {
    id?: string;
    reply?: boolean;
  } = { reply: false }
) => {
  const idSection = typeof id === "string" && id.length > 0 ? `/${id}` : "";
  const replySection = reply ? "/reply" : "";
  const url = `${POSTOFFICE_URL}${idSection}${replySection}`;
  return url;
};

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

  return { encryptedMessage: outputAsString, password: actualPassword };
};

export const getMessageFromPostoffice = async ({
  postofficeCode,
  getReply,
  returnEmptyStringOn404,
}: {
  postofficeCode: string;
  getReply?: boolean;
  /** If set to `true` instead of throwing on 404 an empty string will be returned */
  returnEmptyStringOn404?: boolean;
}) => {
  const { id, password } = getPostofficeCodeParams(postofficeCode);

  const url = await getPostofficeUrl({
    id,
    reply: typeof getReply === "boolean" ? getReply : false,
  });
  const result = await fetch(url);

  if (result.status === 404) {
    if (returnEmptyStringOn404) {
      return "";
    }
    throw new Error("Message does not exist. #GISvL4");
  }

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

export const sendMessageToPostoffice = async ({
  message,
}: {
  message: string;
}) => {
  const { encryptedMessage, password } = await encryptMessage({
    code: message,
  });
  const url = await getPostofficeUrl();

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ message: encryptedMessage }),

    headers: {
      "Content-Type": "application/json",
    },
  });
  const { id }: { id: string } = await response.json();
  return `${id}${POSTOFFICE_SEPARATOR}${password}`;
};

export const sendReplyToPostoffice = async ({
  message,
  replyToPostofficeCode,
}: PostofficeReply) => {
  const { id, password } = getPostofficeCodeParams(replyToPostofficeCode);

  const { encryptedMessage } = await encryptMessage({
    code: message,
    password,
  });

  // NOTE: A reply is POST'd to the mailbox URL, so we do not specify
  // `reply: true` in the `getPostofficeUrl()` call here as we do not want the
  // `/reply` URL.
  const url = await getPostofficeUrl({ id });

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({ message: encryptedMessage }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
