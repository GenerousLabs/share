import { getKeysFromDisk, keysToBase64 } from "git-encrypted";
import { getIsEncryptedRemoteUrl } from "isomorphic-git-remote-encrypted";
import * as yaml from "js-yaml";
import { pick } from "remeda";
import { gitFsHttp, REPOS_PATH } from "../../shared.constants";
import { RepoInRedux, RepoYaml, RepoYamlSchema } from "../../shared.types";
import { doesFileExist, join } from "../fs/fs.service";
import { getRepoPath } from "../repo/repo.service";

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

export const getYamlKeysIfEncryptedRepo = async ({
  repo,
}: {
  repo: RepoInRedux;
}) => {
  const { isEncryptedRemote } = getIsEncryptedRemoteUrl(repo.remoteUrl);

  if (!isEncryptedRemote) {
    return;
    return {};
  }
  const repoPath = getRepoPath({ id: repo.id, type: repo.type });
  const gitdir = join(repoPath, ".git");
  // NOTE: Not all repos are encrypted, almost all, but not quite all
  const keys = await getKeysFromDisk({ fs, gitdir });
  const keysBase64 = keysToBase64({ keys });
  return {
    keysContentBase64: keysBase64.content,
    keysFilenamesBase64: keysBase64.filename,
    keysSaltBase64: keysBase64.salt,
  };
};

export const addNewRepoToReposYaml = async ({
  repo,
}: {
  repo: RepoInRedux;
}) => {
  const yamlKeys = await getYamlKeysIfEncryptedRepo({ repo });

  const repoYaml: RepoYaml = {
    ...pick(repo, ["id", "type", "name", "remoteUrl", "isReadOnly"]),
    ...yamlKeys,
  };

  const data = await loadRepoYaml();

  const repoYamls = data.repoYamls.concat(repoYaml);

  await writeRepoYaml({ repoYamls });
};
