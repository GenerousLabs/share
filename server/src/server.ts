import Server from "@chmac/node-git-server";
import path from "path";
import {
  checkReadPermissions,
  checkWritePermissions,
} from "./services/repos/repos.service";
import logger from "./util/logger";

const PORT = parseInt(process.env.PORT || "8000");

const repos = new Server(path.join(__dirname, "../data/repos"), {
  repoTemplatePath: path.join(__dirname, "..", "templates", "empty-repo"),
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
            const allowed = await checkWritePermissions({ repoPath, token });
            if (allowed) {
              return resolve();
            }
            return reject();
          } else if (type === "fetch") {
            const allowed = await checkReadPermissions({ repoPath, token });
            if (allowed) {
              return resolve();
            }
            return reject();
          } else {
            return reject("Unknown error. #ftvkPh");
          }
        } catch (error) {
          logger.error("Error in authenticate() #OeGBID", error);
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
  logger.debug(`Listening on :${PORT}`);
});
