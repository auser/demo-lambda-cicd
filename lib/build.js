const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");

exports.build = async (filePath) => {
  process.env.__SRC__ = path.resolve(filePath);

  const gatsby = async (...args) => {
    await execa("gatsby", ["clean"], {
      stdio: "inherit",
      preferLocal: true,
    });
    return execa("gatsby", args.filter(Boolean), {
      stdio: "inherit",
      preferLocal: true,
    });
  };
  await gatsby("build", filePath).then(() => {
    const public = path.join(__dirname, "..", "public");
    const dist = path.join(process.cwd(), "public");
    if (public === dist) return;
    fs.copySync(public, dist);
  });
};
