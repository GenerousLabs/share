/**
 * The `debug` library reads `process.env.DEBUG` for its settings, there's no
 * other easy way to set debugging flags across all nested packages
 * unfortunately.
 */
import Constants from "expo-constants";

process.env = {
  // When running under testing, `app.config.ts` doesn't seem to be parsed, so
  // therefore `extra` is undefined.  But in development and in production, it
  // will be set, and `extra.environment` will be `development` or `production`
  // respectively.
  NODE_ENV: Constants.manifest.extra?.environment || "test",
  DEBUG: Constants.manifest.extra?.debug || "",
};

import "./patch-FileReader";
import "node-libs-react-native/globals";
import "react-native-get-random-values";

// import { Buffer } from "buffer";
// (globalThis as any).Buffer = Buffer;
