const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Direct Puppeteer to store and find Chrome inside the backend project folder
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
