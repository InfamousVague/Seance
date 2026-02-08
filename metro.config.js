const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, "../Wisp")];

config.resolver.extraNodeModules = {
  "@wisp/ui": path.resolve(__dirname, "../Wisp/src"),
};

module.exports = config;
