import matter from "gray-matter";
import { gitFsHttp } from "../../shared.constants";
import { OfferInRedux, OfferOnDisk, RepoInRedux } from "../../shared.types";
import { join } from "../fs/fs.service";
import { log } from "./library.log";

/**
 * Given an offer, convert it to a markdown & frontmatter string
 */
export const offerToString = ({ offer }: { offer: OfferOnDisk }) => {
  // The `repoId` does not get written to the file, it is kept only in our
  // application. It will be defined in the future by whichever repo the offer
  // is loaded from.
  const { bodyMarkdown, ...frontmatter } = offer;

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
