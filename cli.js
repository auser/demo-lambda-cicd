#!/usr/bin/env node --max-old-space-size=8096

const path = require("path");
const { prepare, build, serve, captureSite, createPPTX } = require("./lib");
const deckFile = path.join(__dirname, "src", "deck.mdx");

(async () => {
  let server;
  try {
    await prepare();
    await build(deckFile);
    server = await serve("./public");
    const address = server.address();
    const url = `http://${
      address.address === "::" ? "localhost" : address.address
    }:${address.port}`;
    const images = await captureSite(url, {});
    await createPPTX(images, {});
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
})();
