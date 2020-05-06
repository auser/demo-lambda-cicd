const puppeteer = require("puppeteer");
const tempy = require("tempy");
const path = require("path");
const fs = require("fs-extra");
const { width, height } = require("./consts");
const { captureSite } = require("./capture-site");

const browserHelper = async (url) => {
  // captureSite
  const gotoRoot = async (pageNumber = 0) => {
    let page = await browser.newPage();
    page.emulate({
      viewport: {
        width,
        height,
      },
      userAgent: "x-converter",
    });

    await page.goto(`${url}/#${pageNumber}`, {
      waitUntil: ["domcontentloaded"],
    });
    await page.waitFor("#slideCount");
    await page.waitFor(500);
    await page.emulateMediaType("screen");
    return page;
  };

  const browser = await puppeteer.launch({
    product: "chrome",
    headless: true,
  });

  return { browser, gotoRoot };
};

exports.captureSite = async (url, opts = {}) => {
  let browser;
  let gotoRoot;
  try {
    const helper = await browserHelper(url);
    browser = helper.browser;
    gotoRoot = helper.gotoRoot;

    let page = await gotoRoot();
    const pages = await page.$eval("#slideCount", (el) =>
      parseInt(el.innerText)
    );
    page.close();

    let promise = Promise.resolve();
    let files = [];
    for (let idx = 0; idx < pages; idx += 1) {
      promise = promise.then(async () => {
        const output = `/tmp/images/${idx}.png`;
        if (fs.existsSync(output)) {
          fs.removeSync(output);
        }
        await captureSite({
          ...opts,
          input: `${url}/#${idx}`,
          output,
        });
        files.push(output);
      });
    }

    await promise;
    return files;
  } catch (err) {
    console.log("error in captureSite ->", err);
  } finally {
    browser.close();
  }
};

exports.browser = async (url) => {
  const browser = await puppeteer.launch({
    product: "chrome",
    headless: true,
  });

  try {
    // await page.exposeFunction("onHashChange", (url) =>
    //   page.emit("hashchange", url)
    // );
    // await page.evaluateOnNewDocument(() => {
    //   addEventListener("hashchange", (e) => onHashChange(location.href));
    // });

    const gotoRoot = async (pageNumber = 0) => {
      let page = await browser.newPage();
      page.emulate({
        viewport: {
          width,
          height,
        },
        userAgent: "x-converter",
      });

      await page.goto(`${url}/#${pageNumber}`, {
        waitUntil: ["domcontentloaded"],
      });
      await page.waitFor("#slideCount");
      await page.waitFor(500);
      await page.emulateMediaType("print");
      return page;
    };

    // Listen for hashchange events in node Puppeteer code.
    // page.on("hashchange", (url) =>
    //   console.log("hashchange event:", new URL(url).hash)
    // );

    let page = await gotoRoot();
    const pages = await page.$eval("#slideCount", (el) =>
      parseInt(el.innerText)
    );
    page.close();

    const screenshot = async (pageNumber = 0) => {
      // let curr = 0;

      let page = await gotoRoot(pageNumber);
      const filePath = await tempy.file({
        name: `${pageNumber}.png`,
      });

      await page.screenshot({ path: filePath, fullPage: true });
      page.close();
      return filePath;
    };

    let promise = Promise.resolve();
    let files = [];
    for (let idx = 0; idx < pages; idx += 1) {
      promise = promise.then(async () => {
        const filePath = await screenshot(idx);
        fs.copyFileSync(filePath, `/tmp/images/${path.basename(filePath)}`);
        files.push(filePath);
      });
    }

    await promise;
    return files;
  } catch (err) {
    console.log("error ->", err);
  } finally {
    browser.close();
  }
};
