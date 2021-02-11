const hostname =
  typeof process.env.SHARE_HOSTNAME === "string" &&
  process.env.SHARE_HOSTNAME.length > 0
    ? process.env.SHARE_HOSTNAME
    : "localhost";

module.exports = {
  tralingSlash: true,
  env: {
    hostname,
  },
};
