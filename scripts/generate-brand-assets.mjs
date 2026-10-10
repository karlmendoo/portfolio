// Rebuild the static brand assets with existing project dependencies:
// node scripts/generate-brand-assets.mjs
// No image generation runs on the deployed GitHub Pages site.
import { readFile, writeFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/og");
const root = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = path.join(root, "public");
const ink = "#172b40";
const paper = "#eaf3ff";
const mark =
  '<path d="M16 47V17h7l18 20V17h7v30h-7L23 27v20z" fill="#172b40"/>';
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${paper}"/>${mark}</svg>\n`;
const touchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${paper}"/>${mark}</svg>`;

await writeFile(path.join(publicDirectory, "favicon.svg"), faviconSvg);
const iconFrames = await Promise.all(
  [16, 32].map((size) =>
    sharp(Buffer.from(faviconSvg))
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);
await writeFile(path.join(publicDirectory, "favicon-32.png"), iconFrames[1]);
await sharp(Buffer.from(touchSvg))
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDirectory, "apple-touch-icon.png"));

// ICO permits lossless PNG frames; retain both native small sizes so the
// browser never needs to downsample a large image for the tab icon.
const icoHeader = Buffer.alloc(6 + iconFrames.length * 16);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(iconFrames.length, 4);
let offset = icoHeader.length;
for (const [index, frame] of iconFrames.entries()) {
  const entry = 6 + index * 16;
  const size = index === 0 ? 16 : 32;
  icoHeader[entry] = size;
  icoHeader[entry + 1] = size;
  icoHeader.writeUInt16LE(1, entry + 4);
  icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(frame.length, entry + 8);
  icoHeader.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
}
await writeFile(
  path.join(publicDirectory, "favicon.ico"),
  Buffer.concat([icoHeader, ...iconFrames]),
);

const fonts = await Promise.all(
  [
    ["DM Sans", "dm-sans", "dm-sans-latin-400-normal.woff", 400, "normal"],
    ["DM Sans", "dm-sans", "dm-sans-latin-500-normal.woff", 500, "normal"],
    [
      "Instrument Serif",
      "instrument-serif",
      "instrument-serif-latin-400-italic.woff",
      400,
      "italic",
    ],
  ].map(async ([name, packageName, fileName, weight, style]) => ({
    name,
    data: await readFile(
      path.join(
        root,
        "node_modules",
        "@fontsource",
        packageName,
        "files",
        fileName,
      ),
    ),
    weight,
    style,
  })),
);

const element = React.createElement;
const line = (top) =>
  element("div", {
    style: {
      position: "absolute",
      left: 72,
      right: 72,
      top,
      height: 1,
      background: "rgba(23, 43, 64, 0.22)",
    },
  });
const poster = element(
  "div",
  {
    style: {
      width: 1200,
      height: 630,
      display: "flex",
      position: "relative",
      color: ink,
      fontFamily: "DM Sans",
      backgroundColor: paper,
      backgroundImage:
        "radial-gradient(ellipse at 88% 65%, #bdd7ef 0%, #d4e8fb 30%, #eaf3ff 74%)",
    },
  },
  element(
    "div",
    {
      style: {
        position: "absolute",
        left: 72,
        right: 72,
        top: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
    element(
      "div",
      { style: { fontSize: 31, fontWeight: 500, letterSpacing: -1.6 } },
      "nkm.",
    ),
    element(
      "div",
      {
        style: { fontSize: 16, letterSpacing: 2.2, color: "#506579" },
      },
      "PERSONAL PORTFOLIO",
    ),
  ),
  line(118),
  element(
    "div",
    {
      style: {
        position: "absolute",
        left: 72,
        top: 175,
        display: "flex",
        flexDirection: "column",
      },
    },
    element(
      "div",
      {
        style: {
          fontSize: 84,
          fontWeight: 400,
          lineHeight: 1.12,
          letterSpacing: -4.4,
        },
      },
      "Normand Karol",
    ),
    element(
      "div",
      {
        style: {
          fontFamily: "Instrument Serif",
          fontStyle: "italic",
          fontSize: 151,
          fontWeight: 400,
          lineHeight: 1.0,
          letterSpacing: -4.4,
        },
      },
      "Mendoza",
    ),
  ),
  line(519),
  element(
    "div",
    {
      style: {
        position: "absolute",
        left: 72,
        right: 72,
        top: 553,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
    element(
      "div",
      {
        style: { fontSize: 23, fontWeight: 400 },
      },
      "Computer Science student at UST",
    ),
    element(
      "div",
      {
        style: { fontSize: 14, letterSpacing: 1.4, color: "#506579" },
      },
      "COMPUTER SCIENCE / WEB DEVELOPMENT",
    ),
  ),
);

const response = new ImageResponse(poster, { width: 1200, height: 630, fonts });
const png = Buffer.from(await response.arrayBuffer());
await sharp(png)
  .png({ compressionLevel: 9, palette: true, colours: 256, dither: 0.5 })
  .toFile(path.join(publicDirectory, "social-preview.png"));

for (const filename of [
  "favicon.svg",
  "favicon.ico",
  "favicon-32.png",
  "apple-touch-icon.png",
  "social-preview.png",
]) {
  const { size } = await stat(path.join(publicDirectory, filename));
  console.log(`${filename}: ${size.toLocaleString("en-US")} bytes`);
}
