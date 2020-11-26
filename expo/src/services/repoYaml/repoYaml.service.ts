import { isArray, isObject } from "lodash";
import { first } from "remeda";

export type RepoYaml = {
  name: string;
  remotes: {
    url: string;
    headers?: {
      [name: string]: string;
    };
    keys?: {
      content: string;
      filenames: string;
      salt: string;
    };
    keyPassword?: string;
  }[];
  id: string;
  slug: string;
};

export const _isRequiredString = (input: any): input is string => {
  if (typeof input === "string" && input.length > 0) {
    return true;
  }
  return false;
};

export const _isOptionalString = (input: any): input is string => {
  if (typeof input === "string" && input.length === 0) {
    return false;
  }
  return true;
};

export const isValidRemote = (remote: any) => {
  if (!isObject(remote) as boolean) {
    return false;
  }

  if (!_isRequiredString(remote.url)) {
    return false;
  }

  // If `.headers` exists every value must be a string
  if (isObject(remote.headers)) {
    const firstNonString = Object.values(remote.headers).find(
      (value) => !_isRequiredString(value)
    );
    if (typeof firstNonString !== "undefined") {
      return false;
    }
  }

  // If `.keys` exists, all its properties must exist and be strings
  if (isObject(remote.keys)) {
    if (
      !_isRequiredString(remote.keys.content) ||
      !_isRequiredString(remote.keys.filenames) ||
      !_isRequiredString(remote.keys.salt)
    ) {
      return false;
    }
  }

  if (!_isOptionalString(remote.keyPassword)) {
    return false;
  }

  return true;
};

export const isRepoYaml = (obj: any): obj is RepoYaml => {
  // NOTE: We need to cast the result to `boolean` here otherwise typescript
  // will say that `obj` is now of type `object` and then all the following
  // properties will be considered invalid.
  if (!isObject(obj) as boolean) {
    return false;
  }

  if (
    !_isRequiredString(obj.name) ||
    !_isRequiredString(obj.id) ||
    !_isRequiredString(obj.slug)
  ) {
    return false;
  }

  // NOTE: For now fail if `remotes` is more than 1 element long
  if (!isArray(obj.remotes) || obj.remotes.length !== 1) {
    return false;
  }

  const [firstRemote] = obj.remotes;

  if (!isValidRemote(firstRemote)) {
    return false;
  }

  return true;
};
