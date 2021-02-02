const DISALLOWED_REGEX = new RegExp("[^\\w-]", "g");

export const parseTags = (input: string): string[] => {
  const tags = input.split(" ").map((tag) => tag.replace(DISALLOWED_REGEX, ""));
  return tags;
};
