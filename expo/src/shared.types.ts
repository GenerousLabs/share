import fs from "fs";
import * as zod from "zod";
import { RepoType } from "./shared.constants";

export type RootDrawerParamList = {
  Home: undefined;
  Browse: undefined;
  YourStuff: undefined;
  Connections: undefined;
  Libraries: undefined;
  Offers: undefined;
  Settings: undefined;
  BrowseFileSystem: undefined;
  Log: undefined;
  NotFound: undefined;
};

export type SetupDrawerParamList = {
  Setup: undefined;
  Settings: undefined;
};

export type ConnectionsStackParameterList = {
  ConnectionsHome: undefined;
  ConnectionsInvite: undefined;
  ConnectionsAccept?: { inviteCode?: string; senderName?: string };
  ConnectionsSingle: { connectionId: string };
};

export type YourStuffStackParameterList = {
  YourStuffList: undefined;
  OfferForm: undefined;
};

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

export const RepoYamlSchema = zod.object({
  id: zod.string().nonempty(),
  // Connection repos will not have a name, the connection has its own name
  name: zod.string().nonempty().optional(),
  type: zod.nativeEnum(RepoType),
  remoteUrl: zod.string().nonempty(),
  isReadOnly: zod.boolean(),
  // If a repo does not have a connectionId then it is mine
  connectionId: zod.string().nonempty().optional(),
});

export type RepoYaml = zod.infer<typeof RepoYamlSchema>;

export type RepoOnDiskFrontMatter = {
  uuid: string;
  type: RepoType;
  title: string;
};

/** Each repo contains an index.md file which specifies the following fields. */
export type RepoOnDisk = RepoOnDiskFrontMatter & {
  bodyMarkdown: string;
};

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

export type RepoInRedux = RepoOnDisk & RepoYaml & RepoGitMetadata;

/**
 * An offer which is mine.
 *
 * This means it does not have a connection (friend), because its connected to
 * me.
 */
export type OfferMine = OfferInRedux & {
  mine: true;
};

export const OfferOnDiskFrontmatterSchema = zod.object({
  uuid: zod.string(),
  title: zod.string(),
  tags: zod.string().array(),
  isSeeking: zod.boolean().optional(),
  proximity: zod.number().int(),
  shareToProximity: zod.number().int(),
  createdAt: zod.number().int(),
  updatedAt: zod.number().int(),
  archivedAt: zod.number().int().optional(),
});

export type OfferOnDiskFrontmatter = zod.infer<
  typeof OfferOnDiskFrontmatterSchema
>;

export type OfferOnDisk = OfferOnDiskFrontmatter & {
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

export type EnhancedOfferInRedux = OfferInRedux & {
  repoIds: string[];
};

export const ConnectionSchema = zod.object({
  id: zod.string().nonempty(),
  name: zod.string().nonempty(),
  notes: zod.string().nonempty(),
  myRepoId: zod.string().nonempty(),
  token: zod.string().nonempty(),
  /** Their repo ID in our repo collection */
  theirRepoId: zod.string().optional(),
});

export type ConnectionOnDisk = zod.infer<typeof ConnectionSchema>;

/**
 * PROBLEM
 *
 * We want to stop users trying to add the same postoffice code multiple times.
 *
 * Do we want to put that code on disk, or only in redux?
 */

export type ConnectionInRedux = ConnectionOnDisk & {
  /** If we created a postoffice code, it is stored here */
  postofficeCode?: string;
  /** If we received an invite, then the postoffice code is stored here */
  receivedPostofficeCode?: string;
};

export const RepoShareSchema = zod.object({
  id: zod.string().nonempty(),
  repoId: zod.string().nonempty(),
  connectionId: zod.string().nonempty(),
  token: zod.string().nonempty(),
});
export type RepoShareInRedux = zod.infer<typeof RepoShareSchema>;

export const InvitationSchema = zod.object({
  connectionRepoRemoteUrl: zod.string().nonempty(),
  libraryRemoteUrl: zod.string().nonempty(),
});

export type Invitation = zod.infer<typeof InvitationSchema>;

export const PostofficeReplySchema = zod.object({
  message: zod.string().nonempty(),
  replyToPostofficeCode: zod.string().nonempty(),
});

export type PostofficeReply = zod.infer<typeof PostofficeReplySchema>;

/**
 * An offer will always have a repo, and may have a connection. Each offer may
 * be duplicated. The same rules apply to those duplicates.
 */
export type EnhancedOffer = {
  offer: OfferInRedux;
  repo: RepoInRedux;
  connection?: ConnectionInRedux;
};

export type EnhancedOfferWithAlternates = EnhancedOffer & {
  alternates?: EnhancedOffer[];
};
