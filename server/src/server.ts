import Server from "@chmac/node-git-server";
import { CWD, REPOS_ROOT, REPO_TEMPLATE_PATH } from "./constants";
import {
  getIsValidReadToken,
  getIsValidWriteToken,
} from "./services/repos/repos.service";
import logger from "./util/logger";

const PORT = parseInt(process.env.PORT || "8000");

const repos = new Server(REPOS_ROOT, {
  repoTemplatePath: REPO_TEMPLATE_PATH,
  checkout: true,
  autoCreate: true,
  authenticate: ({ type, repo: repoPath, headers, user }) => {
    return new Promise((resolve, reject) => {
      logger.debug("Auth started. Requesting username & password. #TPQcZG");
      user(async (username, password) => {
        logger.debug("Got username & password. #GFjigq", {
          type,
          repoPath,
          headers,
          username,
          password,
        });

        const token = password;

        try {
          if (type === "push") {
            const isValidWriteToken = await getIsValidWriteToken({
              repoPath,
              token,
            });

            if (isValidWriteToken) {
              return resolve();
            }

            logger.warn("Invalid write token for push request #uDCS0u", {
              repoPath,
              token,
            });

            return reject("Denied #NUyFdV");
          } else if (type === "fetch") {
            const isValidWriteToken = await getIsValidWriteToken({
              repoPath,
              token,
            });

            if (isValidWriteToken) {
              return resolve();
            }

            const isValidReadToken = await getIsValidReadToken({
              repoPath,
              token,
            });

            if (isValidReadToken) {
              return resolve();
            }

            logger.warn(
              "Invalid read / write token for fetch request #m9zh76",
              { repoPath, token }
            );
            return reject("Denied #g1ABKt");
          } else {
            return reject("Unknown error. #sqzN0U");
          }
        } catch (error) {
          logger.error("Error in authenticate() #tOkULE", error);
          return reject(error);
        }
      });
    });
  },
});

/*
repos.on("fetch", async (fetch) => {
  const { repo: repoPath } = fetch;
  checkReadPermissions({ repoPath, token });
  logger.debug("fetch #tgbL2b", fetch);
  fetch.reject();
});

repos.on("head", (head) => {
  head.reject();
});

repos.on("info", (info) => {
  logger.debug("info #lBbbLL");
  info.reject();
});

repos.on("push", (push) => {
  const { repo, commit, branch } = push;
  logger.debug("push #tgbL2b", { a: { repo, commit, branch } });
  push.accept();
});

repos.on("tag", (tag) => {
  const { repo, commit, version } = tag;
  logger.debug("tag #KRCdQs", { a: { repo, commit, version } });
  tag.accept();
});
*/

repos.listen(PORT, { enableCors: true, type: "http" }, () => {
  logger.debug("Generous share server started #OKzflB", {
    cwd: process.cwd(),
    CWD,
    PORT,
    REPOS_ROOT,
    REPO_TEMPLATE_PATH,
  });
});
