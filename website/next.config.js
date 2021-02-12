const hostname =
  typeof process.env.SHARE_HOSTNAME === "string" &&
  process.env.SHARE_HOSTNAME.length > 0
    ? process.env.SHARE_HOSTNAME
    : "localhost";
const version =
  typeof process.env.SHARE_VERSION === "string"
    ? process.env.SHARE_VERSION
    : "dev";

module.exports = {
  tralingSlash: true,
  env: {
    hostname,
    version,
  },
};
