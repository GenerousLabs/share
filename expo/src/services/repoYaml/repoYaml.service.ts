import { RepoYaml, RepoYamlSchema } from "../../shared.types";

export const isRepoYaml = (obj: unknown): obj is RepoYaml =>
  RepoYamlSchema.check(obj);
