const { build } = require("./build");
const { serve } = require("./serve");
const { browser, captureSite } = require("./browser");
const { createPPTX } = require("./pptx");
const { prepare } = require("./prepare");

module.exports = {
  build,
  serve,
  browser,
  createPPTX,
  captureSite,
  prepare,
};
