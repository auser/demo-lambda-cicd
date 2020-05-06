const captureWebsite = require("capture-website");
const { width, height } = require("./consts");
const defaultOptions = {
  input: "http://localhost:8000",
  output: "site.png",
  // delay: 3,
  width: width,
  height: height,
  type: "png",
  debug: false,
  launchOptions: {
    product: "chrome",
    headless: true,
    defaultViewPort: {
      width: width,
      height: height,
      isMobile: false,
    },
  },
  removeElements: ["#slideCount"],
  beforeScreenshot: async (page) => {
    const pageUrl = await page.url();
    const rootUrl = pageUrl.split("#")[0];
    const number = parseInt(pageUrl.split("#")[1].replace(/\//, ""));
    await page.goto(`${rootUrl}`, {
      waitUntil: ["domcontentloaded"],
    });
    await page.waitFor(500);
    let promise = Promise.resolve();
    for (let i = 0; i < number; i += 1) {
      await page.keyboard.press("ArrowRight");
    }
    // await page.goto(pageUrl, {
    //   waitUntil: ["domcontentloaded"],
    // });
    await page.waitFor(500);
  },
};

exports.captureSite = async (options = {}) => {
  const opts = {
    ...defaultOptions,
    ...options,
  };

  await captureWebsite.file(opts.input, opts.output, opts);
  return opts.output;
};
