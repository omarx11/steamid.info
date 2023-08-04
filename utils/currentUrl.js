const development =
  `http://127.0.0.1:${process.env.PORT}` || "http://127.0.0.1:5000";
const production = "https://steamid.info";
const currentUrl = process.env.NODE_ENV ? production : development;

module.exports = currentUrl;
