const pptxgen = require("pptxgenjs");
const { presentation } = require("../package.json");
const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const { width, widthInch, heightInch, height } = require("./consts");

const readFile = util.promisify(fs.readFile);
const removeFile = util.promisify(fs.remove);

const defaultOptions = {
  height,
  width,
  layoutName: `${width}x${height}`,
  output: path.resolve(process.cwd(), `deck.pptx`),
  ...presentation,
};
exports.createPPTX = async (imageFiles, options = {}) => {
  const opts = {
    ...defaultOptions,
    ...options,
  };
  const { layoutName, height, width } = opts;

  const pptx = new pptxgen();

  if (opts.author) pptx.author = opts.author;
  if (opts.description) pptx.description = opts.description;

  // pptx.defineLayout({
  //   name: layoutName,
  //   width: width,
  //   height: height,
  // });

  pptx.layout = "LAYOUT_16x9";

  let page = 0;
  for (const imageFile of imageFiles) {
    page += 1;
    const slide = pptx.addSlide();
    // const buffer = await readFile(imageFile);
    // const data = `data:image/png;base64,${buffer.toString("base64")}`;
    await slide.addImage({
      path: imageFile,
      x: 0,
      y: 0,
      w: widthInch,
      h: heightInch,
    });

    // const [img] = slide.relsMedia;
    // slide.bkgImgRid = img.rId;
    // slide.data = [];

    // const notes = tpl.rendered.comments[page - 1].join("\n\n");
    // if (notes) slide.addNotes(notes);
  }

  if (fs.existsSync(opts.output)) {
    await removeFile(opts.output);
  }
  await pptx.writeFile(opts.output);
  return opts.output;
};
