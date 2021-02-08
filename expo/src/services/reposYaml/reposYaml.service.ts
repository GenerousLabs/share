import * as yaml from "js-yaml";
import { pick } from "remeda";
import { gitFsHttp, REPOS_PATH } from "../../shared.constants";
import { RepoInRedux, RepoYaml, RepoYamlSchema } from "../../shared.types";
import { doesFileExist, join } from "../fs/fs.service";

/**
 * NAMING
 *
 * The naming of the reposYaml service is wonky.
 *
 * The file is `repos.yaml` which is why it's called the "reposYaml" service.
 * However, a single entity from the file is probably more accurately called a
 * `yamlRepo`. Anyway, it's a mess, and one day could be cleaned up. Alas, not
 * today.
 */

const { fs } = gitFsHttp;
const reposYamlPath = join(REPOS_PATH, "me/repos.yaml");

export const isRepoYaml = (obj: unknown): obj is RepoYaml =>
  RepoYamlSchema.check(obj);

export const loadRepoYaml = async (): Promise<{ repoYamls: RepoYaml[] }> => {
  const reposYamlExists = await doesFileExist({ path: reposYamlPath });

  const yamlString = !reposYamlExists
    ? "repos: []"
    : await fs.promises.readFile(reposYamlPath, {
        encoding: "utf8",
      });
  const { repos } = yaml.safeLoad(yamlString) as { repos: Partial<RepoYaml>[] };

  const reposValidated = repos.filter(isRepoYaml);

  return { repoYamls: reposValidated };
};

export const writeRepoYaml = async ({
  repoYamls,
}: {
  repoYamls: RepoYaml[];
}) => {
  const yamlString = yaml.safeDump({ repos: repoYamls });
  await fs.promises.writeFile(reposYamlPath, yamlString, { encoding: "utf8" });
};

export const addNewRepoToReposYaml = async ({
  repo,
}: {
  repo: RepoInRedux;
}) => {
  const repoYaml: RepoYaml = {
    ...pick(repo, ["id", "type", "name", "remoteUrl", "isReadOnly"]),
  };

  const data = await loadRepoYaml();

  const repoYamls = data.repoYamls.concat(repoYaml);

  await writeRepoYaml({ repoYamls });
};
