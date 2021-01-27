const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    extraNodeModules: require("node-libs-react-native"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
  },
};
