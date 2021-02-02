import trimChars from "lodash/fp/trimChars";

const DISALLOWED_REGEX = new RegExp("[^\\w-]", "g");

const trimLeadingAndTrailingDashesAndUnderscores = trimChars("-_");

export const parseTags = (input: string): string[] => {
  const tags = input
    .split(" ")
    .map((tag) => tag.replace(DISALLOWED_REGEX, ""))
    .map(trimLeadingAndTrailingDashesAndUnderscores)
    .filter((tag) => tag.length > 0);
  return tags;
};

export const hashifyTags = (tags: string[]): string => {
  if (tags.length === 0) {
    return "";
  }
  return `#${tags.join(", #")}`;
};
