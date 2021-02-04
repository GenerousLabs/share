import Server from "@chmac/node-git-server";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { stat } from "fs/promises";
import {
  CWD,
  ENOENT,
  POSTOFFICE_PATH,
  REPOS_ROOT,
  REPO_TEMPLATE_PATH,
} from "./constants";
import {
  getMessage,
  getReply,
  saveMessageReply,
  saveNewMessage,
} from "./services/postoffice/postoffice.service";
import {
  getIsValidReadToken,
  getIsValidWriteToken,
} from "./services/repos/repos.service";
import logger from "./util/logger";

const PORT = parseInt(process.env.PORT || "8000");

const jsonParser = bodyParser.json();

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
  try {
    const message = await getReply({ id: req.params.boxId });
    res.send({ message });
  } catch (error) {
    if (error.code === ENOENT) {
      res.writeHead(404);
      res.end();
      return;
    }

    logger.error("Caught error in /postoffice/:boxId/reply GET #zCTGN3", {
      error,
    });
    res.writeHead(500);
    res.send();
  }
});

app.get("/postoffice/:boxId", async (req, res) => {
  try {
    const message = await getMessage({ id: req.params.boxId });
    res.send({ message });
  } catch (error) {
    if (error.code === ENOENT) {
      logger.info("Not found postoffice request #4txNq1", {
        boxId: req.params.boxId,
      });
      res.writeHead(404);
      res.end();
      return;
    }

    logger.error("Caught error in /postoffice/:boxId GET #8tV4rq", { error });
  }
});

// Submit a reply to an existing message
app.post("/postoffice/:boxId", jsonParser, async (req, res) => {
  try {
    if (typeof req.body.message !== "string" || req.body.message.length === 0) {
      logger.warn("Invalid /postoffice POST #fHRCJu", { body: req.body });
      res.writeHead(400);
      res.send();
      return;
    }
    await saveMessageReply({
      id: req.params.boxId,
      message: req.body.message,
      timestamp: Date.now(),
    });
    res.send({ replied: true });
  } catch (error) {
    logger.error("Caught error in /postoffice/:boxId POST #1oBt7X", { error });
    res.writeHead(500);
    res.send();
  }
});

// Submit a message to the postoffice
app.post("/postoffice", jsonParser, async (req, res) => {
  try {
    if (typeof req.body.message !== "string" || req.body.message.length === 0) {
      logger.warn("Invalid /postoffice POST #fHRCJu", { body: req.body });
      res.writeHead(400);
      res.send();
      return;
    }
    const timestamp = Date.now();
    const id = await saveNewMessage({ message: req.body.message, timestamp });
    res.send({ id });
  } catch (error) {
    logger.error("Caught error in /postoffice POST #cpyuvA", { error });
    res.writeHead(500);
    res.send();
  }
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
  try {
    (repos as any).handle(req, res);
  } catch (error) {
    logger.error("Git Server.handle() threw #zTawz8", { error });
  }
});

app.listen(PORT, async () => {
  logger.info("Generous share server started #OKzflB", {
    cwd: process.cwd(),
    CWD,
    PORT,
    REPOS_ROOT,
    POSTOFFICE_PATH,
    REPO_TEMPLATE_PATH,
  });

  try {
    const reposRootStat = await stat(REPOS_ROOT);

    if (!reposRootStat.isDirectory()) {
      throw new Error("REPOS_ROOT is not a directory #4xeqcH");
    }

    const postofficeStat = await stat(POSTOFFICE_PATH);
    if (!postofficeStat.isDirectory()) {
      throw new Error("POSTOFFICE_PATH is not a directory #w23eFK");
    }

    const repoTemplatePath = await stat(REPO_TEMPLATE_PATH);

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
