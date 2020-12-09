/**
 * The `debug` library reads `process.env.DEBUG` for its settings, there's no
 * other easy way to set debugging flags across all nested packages
 * unfortunately.
 */
// TODO Remove this for production somehow
process.env = {
  NODE_ENV: "development",
  DEBUG: "*",
};

import "./patch-FileReader";
import "node-libs-react-native/globals";
import "react-native-get-random-values";
// import { Buffer } from "buffer";

// (globalThis as any).Buffer = Buffer;
