import { isObject } from "lodash";
import { RepoYaml, RepoYamlSchema } from "../../shared.types";

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

export const isRepoYaml = (obj: unknown): obj is RepoYaml =>
  RepoYamlSchema.check(obj);
