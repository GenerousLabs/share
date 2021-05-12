import matter from "gray-matter";
import { pick } from "remeda";
import slugify from "slugify";
import { gitFsHttp } from "../../shared.constants";
import {
  OfferInRedux,
  OfferOnDisk,
  OfferOnDiskFrontmatterSchema,
  RepoInRedux,
} from "../../shared.types";
import { join } from "../fs/fs.service";
import { getRepoPath } from "../repo/repo.service";
import { log } from "./library.log";

const FRONTMATTER_KEYS = Object.keys(
  OfferOnDiskFrontmatterSchema.shape
) as (keyof OfferOnDisk)[];

/**
 * Given an offer, convert it to a markdown & frontmatter string
 */
export const offerToString = ({
  offer,
}: {
  offer: OfferOnDisk | OfferInRedux;
}) => {
  const { bodyMarkdown } = offer;

  const frontmatter = pick(offer, FRONTMATTER_KEYS);

  // In addition to picking just the frontmatter keys we also validate with the
  // schema as it can perform more detailed checks.
  OfferOnDiskFrontmatterSchema.parse(frontmatter);

  const output = matter.stringify(bodyMarkdown, frontmatter);

  return output;
};

export const readOfferFromDisk = async ({
  directoryPath,
}: {
  directoryPath: string;
}) => {
  const { fs } = gitFsHttp;

  const indexPath = join(directoryPath, "index.md");

  const markdownWithFrontmatter = await fs.promises.readFile(indexPath, {
    encoding: "utf8",
  });

  const { content, data } = matter(markdownWithFrontmatter as string);

  return { ...data, bodyMarkdown: content } as Omit<
    OfferInRedux,
    "id" | "repoId"
  >;
};

export const getOfferFilesystemParams = ({
  offer,
  repo,
}: {
  offer: OfferInRedux;
  repo: RepoInRedux;
}) => {
  const repoPath = getRepoPath(repo);

  const directoryName = slugify(offer.title, { lower: true });
  const directoryPath = join(repoPath, directoryName);
  const filePath = join(directoryPath, "index.md");

  return {
    directoryPath,
    filePath,
  };
};

export const getLibrarySharingCode = async ({
  repo,
}: {
  repo: Pick<RepoInRedux, "uuid" | "type">;
}) => {
  // const {url:myRemoteUrl} = createRemoteUrlForSharedRepo({repo, token})
  // const code = createConnectionCode({myKeysBase64, myRemoteUrl, type: ConnectionCodeType.SHARING})
  log.error("getLibrarySharingCode() needs implementation #kutQik");
  return "SHARING_testtoken";
};
