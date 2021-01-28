const { getDefaultConfig } = require("@expo/metro-config");
const nodelibs = require("node-libs-react-native");

// Do not shim the crypto module
// https://github.com/parshap/node-libs-react-native/issues/23#issuecomment-569808488
nodelibs.crypto = null;

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    extraNodeModules: nodelibs,
    sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
  },
};
