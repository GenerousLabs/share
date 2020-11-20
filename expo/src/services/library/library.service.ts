import { gitFsHttp } from "../../shared.constants";
import { join } from "../fs/fs.service";
import matter from "gray-matter";
import { Library } from "./library.state";

export type Offer = {
  id: string;
  uuid: string;
  repoId: string;
  /** Is this an offer which I own, which means I can edit it */
  mine: boolean;
  /** How close to me is this offer? 0 = mine, 1 = a friend of mine, etc. */
  proximity: number;
  /** How far is this to be shared? 1 = my friends, 2 = their friends, etc */
  shareToProximity: number;
  title: string;
  bodyMarkdown: string;
};

/**
 * Given an offer, convert it to a markdown & frontmatter string
 */
export const offerToString = ({ offer }: { offer: Offer }) => {
  const { repoId, id, bodyMarkdown, ...frontmatter } = offer;

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

  return { ...data, bodyMarkdown: content } as Omit<Offer, "repoId">;
};
