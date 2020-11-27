import matter from "gray-matter";
import { gitFsHttp } from "../../shared.constants";
import { join } from "../fs/fs.service";

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
export const offerToString = ({ offer }: { offer: Omit<Offer, "id"> }) => {
  // The `repoId` does not get written to the file, it is kept only in our
  // application. It will be defined in the future by whichever repo the offer
  // is loaded from.
  const { repoId, bodyMarkdown, ...frontmatter } = offer;

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

  return { ...data, bodyMarkdown: content } as Omit<Offer, "id" | "repoId">;
};
