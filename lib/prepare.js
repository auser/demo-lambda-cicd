const path = require("path");
const fs = require("fs-extra");
const util = require("util");

const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const stat = util.promisify(fs.stat);

exports.prepare = async () => {
  const tmpDir = path.join("/tmp", "images");

  try {
    await fs.access(tmpDir, fs.constants.O_DIRECTORY);
  } catch (err) {
    await mkdir(tmpDir);
  }
};
