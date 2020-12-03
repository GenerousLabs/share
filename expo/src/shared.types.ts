import fs from "fs";
import * as zod from "zod";
import { RepoType } from "./shared.constants";

export type FS = {
  promises: {
    readFile: typeof fs.promises.readFile;
    writeFile: typeof fs.promises.writeFile;
    unlink: typeof fs.promises.unlink;
    readdir: typeof fs.promises.readdir;
    mkdir: typeof fs.promises.mkdir;
    rmdir: typeof fs.promises.rmdir;
    stat: typeof fs.promises.stat;
    lstat: typeof fs.promises.lstat;
    readlink?: typeof fs.promises.readlink;
    symlink?: typeof fs.promises.symlink;
    chmod?: typeof fs.promises.chmod;
  };
};

export type Headers = {
  [name: string]: string;
};

export type GitParams = {
  // fs: FS;
  // http: HttpClient;
  headers?: Headers;
  dir: string;
  author?: {
    name: string;
    email?: string;
  };
};

export type LibraryInRedux = {
  id: string;
  name: string;
  url: string;
  basename: string;
};

export type RepoOnDiskFrontMatter = {
  uuid: string;
  type: RepoType;
  title: string;
};

/** Each repo contains an index.md file which specifies the following fields. */
export type RepoOnDisk = RepoOnDiskFrontMatter & {
  bodyMarkdown: string;
};

export const RepoYamlKeysSchema = zod.object({
  keysContentBase64: zod.string(),
  keysFilenamesBase64: zod.string(),
  keysSaltBase64: zod.string(),
});
export const RepoYamlBaseSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  type: zod.nativeEnum(RepoType),
  remoteUrl: zod.string(),
  isReadOnly: zod.boolean(),
});
export const RepoYamlBaseWithKeysSchema = RepoYamlBaseSchema.merge(
  RepoYamlKeysSchema
);
export const RepoYamlSchema = zod.union([
  RepoYamlBaseSchema,
  RepoYamlBaseWithKeysSchema,
]);
// .refine((obj) => {
//   // If any 1 key is present, they must all be present
//   if (
//     "keysContentBase64" in obj ||
//     "keysFilenamesBase64" in obj ||
//     "keysSaltBase64" in obj
//   ) {
//     const { keysContentBase64, keysFilenamesBase64, keysSaltBase64 } = obj;
//     return RepoYamlKeysSchema.check({
//       keysContentBase64,
//       keysFilenamesBase64,
//       keysSaltBase64,
//     });
//   }
//   return true;
// });
export type RepoYaml = zod.infer<typeof RepoYamlSchema>;
export type RepoYamlWithoutKeys = Omit<
  RepoYaml,
  "keysContentBase64" | "keysFilenamesBase64" | "keysSaltBase64"
>;

export type RepoGitMetadata = {
  /** Our latest commit. */
  headCommitObjectId?: string;
  /** When did we last fetch. Undefined until we have fetched at least once. */
  lastFetchTimestamp?: number;
  /**
   * How many commits do we have locally that have not been pushed to the origin
   * remote. Can be undefined if unknown. */
  commitsAheadOfOrigin?: number;
  /**
   * If our upstream origin branch is ahead, we can track that here. In theory
   * this should never happen as we always pull rather than fetch, but... */
  commitsBehindOrigin?: number;
};

export type RepoInRedux = RepoOnDisk & RepoYamlWithoutKeys & RepoGitMetadata;

/**
 * These properties are stored in the markdown file.
 */
export type OfferOnDisk = {
  /** The uuid specified by the offer itself */
  uuid: string;
  /** The title of this offer */
  title: string;
  /** A set of tags, each a single string (no leading #, etc) */
  tags: string[];
  /** How close to me is this offer? 0 = mine, 1 = a friend of mine, etc. */
  proximity: number;
  /** How far is this to be shared? 1 = my friends, 2 = their friends, etc */
  shareToProximity: number;
  /** A markdown string that describes this offer */
  bodyMarkdown: string;
};

/**
 * This type expands on what is stored in the file itself, and adds some
 * metadata that we calculate after reading the offer from disk.
 */
export type OfferInRedux = OfferOnDisk & {
  /** This ID is generated locally */
  id: string;
  /**
   * Each offer is contained in a repo, this tracks the ID of that repo (not the
   * uuid)
   */
  repoId: string;
  /** Is this an offer which I own, which means I can edit it */
  mine: boolean;
};

export type ConnectionInRedux = {
  /** The id that I refer to this connection by */
  id: string;
  /** The name that I assign to this connection */
  name: string;
  /** Any private notes that I keep in relation to this connection */
  notes: string;
  /** The ID of the "mine" repo, my half of the connection channel */
  myRepoId: string;
  /**
   * The ID of their repo, their half of the connection channel. Undefined if it
   * has not been set (which means I've sent an invitation and am awaiting a
   * response.) */
  theirRepoId?: string;
};
