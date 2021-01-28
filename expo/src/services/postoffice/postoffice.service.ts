import "react-native-get-random-values";
import { customRandom } from "nanoid";
import nolookalikes from "nanoid-dictionary/nolookalikes";
import tweetnacl from "tweetnacl";
import { encode as utf8Encode, decode as utf8Decode } from "@stablelib/utf8";
import {
  decode as base64Decode,
  encode as base64Encode,
} from "@stablelib/base64";
import { scrypt } from "scrypt-js";
import fetch from "cross-fetch";
import { getConfigFromFilesystem } from "../config/config.service";
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

export const encryptMessage = async ({ code }: { code: string }) => {
  const password = await createPassword();
  const passwordBuffer = utf8Encode(password);
  const scryptSalt = tweetnacl.randomBytes(24);
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

  return { message: outputAsString, password };
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
