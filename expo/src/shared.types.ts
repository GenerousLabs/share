import fs from "fs";

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
  [x: string]: string;
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

/** Each repo contains an index.md file which specifies the following fields. */
export type RepoOnDisk = {
  uuid: string;
  title: string;
  bodyMarkdown: string;
};

export type RepoInRedux = RepoOnDisk & {
  id: string;
  /** The full system path to the repo folder on disk. */
  path: string;
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
