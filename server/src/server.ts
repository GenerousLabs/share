import Server from "@chmac/node-git-server";
import cors from "cors";
import express from "express";
import fs from "fs";
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

const app = express();

// Add CORS headers to all incoming requests
app.use(cors());

app.get("/postoffice/:boxId/reply", async (req, res) => {
  logger.debug("Reply pickup #YgV1nQ", {
    boxId: req.params.boxId,
  });
  res.send({ replyPickup: true });
});

app.get("/postoffice/:boxId", async (req, res) => {
  logger.debug("Post office pickup requested #pWlMVU", {
    boxId: req.params.boxId,
  });
  res.send({ pickup: true });
});

app.post("/postoffice/:boxId", async (req, res) => {
  logger.debug("Reply to box submitted #ncCoCO", {
    boxId: req.params.boxId,
  });
  res.send({ replied: true });
});

app.post("/postoffice", async (req, res) => {
  logger.debug("New postoffice POST #5OaHTP");
  res.send({ sent: true });
});

// Catch all `/postoffice` requests not caught above and send a 404 to avoid
// hitting the git handler for anything postoffice related.
app.use("/postoffice", (req, res) => {
  logger.warn("Invalid postoffice request #Wt4LoT", {
    postofficePath: req.path,
    method: req.method,
  });
  res.writeHead(404);
  res.send();
});

// Last step, if none of the other express routes caught this request, then send
// it to our git middleware
app.use((req, res) => {
  // TODO Fix typing here, `.handle()` needs to be added to node-git-server
  (repos as any).handle(req, res);
});

app.listen(PORT, async () => {
  logger.info("Generous share server started #OKzflB", {
    cwd: process.cwd(),
    CWD,
    PORT,
    REPOS_ROOT,
    REPO_TEMPLATE_PATH,
  });

  try {
    const reposRootStat = await fs.promises.stat(REPOS_ROOT);

    if (!reposRootStat.isDirectory()) {
      throw new Error("REPOS_ROOT is not a directory #4xeqcH");
    }

    const repoTemplatePath = await fs.promises.stat(REPO_TEMPLATE_PATH);

    if (!repoTemplatePath.isDirectory()) {
      throw new Error("REPO_TEMPLATE_PATH is not a directory #mVK3A4");
    }
  } catch (error) {
    logger.error("Error during post startup checks. #gYP4Re", error);
    process.exit();
  }
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
