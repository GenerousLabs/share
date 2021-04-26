import Server from "@chmac/node-git-server";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { stat } from "fs/promises";
import { join } from "path";
import {
  CWD,
  ENOENT,
  EXPO_PATH,
  POSTOFFICE_PATH,
  REPOS_ROOT,
  REPO_TEMPLATE_PATH,
  WEBSITE_PATH,
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
import logger, { enableProductionDebugLogger } from "./util/logger";

const PORT = parseInt(process.env.PORT || "8000");
const __DEV__ = process.env.NODE_ENV !== "development";

const jsonParser = bodyParser.json();

const repos = new Server(REPOS_ROOT, {
  repoTemplatePath: REPO_TEMPLATE_PATH,
  // NOTE: This crashes git versions < 2.28, our docker host has an older
  // version of git, so only set this on dev
  initialBranch: __DEV__ ? "master" : undefined,
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

if (enableProductionDebugLogger) {
  app.use((req, res, next) => {
    const { path, params, headers } = req;
    logger.debug("Request incoming #hEjOXS", { path, params, headers });
    next();
  });
}

// Serve the expo content from the subdirectory `/expo`
app.use(
  "/expo",
  async (req, res, next) => {
    logger.debug("/expo request #s73X25", {
      path: req.path,
      params: req.params,
      headers: req.headers,
    });

    if (req.path === "/") {
      if (typeof req.headers["expo-platform"] === "string") {
        const platform = req.headers["expo-platform"];

        return res.redirect(`/expo/${platform}-index.json`);
      }
    }

    next();
  },
  express.static(EXPO_PATH)
);

// Serve the website static content
const indexHtmlPath = join(WEBSITE_PATH, "index.html");
const faviconIcoPath = join(WEBSITE_PATH, "favicon.ico");
const nextPath = join(WEBSITE_PATH, "_next");
const nextStaticPath = join(WEBSITE_PATH, "_static");
app.use([/^\/$/, "/index.html"], (req, res) => {
  return res.sendFile(indexHtmlPath);
});
app.use("/favicon.ico", (req, res) => {
  return res.sendFile(faviconIcoPath);
});
app.use("/_next", express.static(nextPath));
app.use("/_static", express.static(nextStaticPath));

app.get("/postoffice/:boxId/reply", async (req, res) => {
  try {
    const message = await getReply({ id: req.params.boxId });
    return res.send({ message });
  } catch (error) {
    if (error.code === ENOENT) {
      return res.status(404).end();
    }

    logger.error("Caught error in /postoffice/:boxId/reply GET #zCTGN3", {
      error,
    });
    return res.status(500).end();
  }
});

app.get("/postoffice/:boxId", async (req, res) => {
  try {
    const message = await getMessage({ id: req.params.boxId });
    return res.send({ message });
  } catch (error) {
    if (error.code === ENOENT) {
      logger.info("Not found postoffice request #4txNq1", {
        boxId: req.params.boxId,
      });
      return res.status(404).end();
    }

    logger.error("Caught error in /postoffice/:boxId GET #8tV4rq", { error });
  }
});

// Submit a reply to an existing message
app.post("/postoffice/:boxId", jsonParser, async (req, res) => {
  try {
    if (typeof req.body.message !== "string" || req.body.message.length === 0) {
      logger.warn("Invalid /postoffice POST #fHRCJu", { body: req.body });
      return res.status(400).end();
    }
    await saveMessageReply({
      id: req.params.boxId,
      message: req.body.message,
      timestamp: Date.now(),
    });
    return res.send({ replied: true });
  } catch (error) {
    logger.error("Caught error in /postoffice/:boxId POST #1oBt7X", { error });
    return res.status(500).end();
  }
});

// Submit a message to the postoffice
app.post("/postoffice", jsonParser, async (req, res) => {
  try {
    if (typeof req.body.message !== "string" || req.body.message.length === 0) {
      logger.warn("Invalid /postoffice POST #fHRCJu", { body: req.body });
      return res.status(400).end();
    }
    const timestamp = Date.now();
    const id = await saveNewMessage({ message: req.body.message, timestamp });
    return res.send({ id });
  } catch (error) {
    logger.error("Caught error in /postoffice POST #cpyuvA", { error });
    return res.status(500).end();
  }
});

// Catch all `/postoffice` requests not caught above and send a 404 to avoid
// hitting the git handler for anything postoffice related.
app.use("/postoffice", (req, res) => {
  logger.warn("Invalid postoffice request #Wt4LoT", {
    postofficePath: req.path,
    method: req.method,
  });
  return res.status(404).end();
});

// Last step, if none of the other express routes caught this request, then send
// it to our git middleware
app.use((req, res) => {
  // TODO Fix typing here, `.handle()` needs to be added to node-git-server
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    enableProductionDebugLogger,
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
