import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

// Check the shipped HTML/CSS and files, rather than the development server.
const output = path.resolve("out");
const prefix = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const html = await readFile(path.join(output, "index.html"), "utf8");
const ids = new Set(
  Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]),
);
const verified = new Set();
async function checkAsset(url, fromFile = path.join(output, "index.html")) {
  if (/^(https?:|data:|mailto:|blob:|\/\/)/.test(url)) return;
  url = url.replace(/&amp;/g, "&");
  if (url.startsWith("#")) {
    assert(ids.has(url.slice(1)), `Missing anchor destination: ${url}`);
    return;
  }
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  let file;
  if (clean.startsWith("/")) {
    assert(
      !prefix || clean === prefix || clean.startsWith(`${prefix}/`),
      `Asset escapes deployment subpath: ${url}`,
    );
    file = path.join(output, clean.slice(prefix.length));
  } else file = path.resolve(path.dirname(fromFile), clean);
  assert(
    file.startsWith(`${output}${path.sep}`) || file === output,
    `Asset escapes export: ${url}`,
  );
  assert(
    (await stat(file)).isFile() || file === output,
    `Missing asset: ${url}`,
  );
  verified.add(file);
}
for (const tag of html.matchAll(/<(?:script|link|img|a|source)\b[^>]*>/g)) {
  if (/rel="(?:preconnect|dns-prefetch)"/.test(tag[0])) continue;
  for (const match of tag[0].matchAll(/\b(?:src|href)="([^"]+)"/g))
    await checkAsset(match[1]);
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith(".css")) {
      const css = await readFile(file, "utf8");
      for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g))
        await checkAsset(match[1], file);
    }
  }
}
await walk(output);
for (const fact of [
  "Java",
  "HTML",
  "CSS",
  "MongoDB",
  "Docker",
  "Linux",
  "FlyRank AI",
  "University of Santo Tomas",
  "Notre Dame of Greater Manila",
  "BayLayn 2024",
  "Communication",
  "Leadership",
  "Coordination",
  "Adaptability",
])
  assert(html.includes(fact), `Required portfolio fact missing: ${fact}`);
for (const url of [
  "https://github.com/karlmendoo",
  "https://github.com/karlmendoo/mc-gpt",
  "https://github.com/karlmendoo/spoticraft",
])
  assert(
    html.includes(`href="${url}"`),
    `Required GitHub link missing: ${url}`,
  );
assert(
  !html.includes('href="https://github.com/karlmendoo/uni-chat"'),
  "Unrequested project is featured",
);
const cv = await readFile(path.join(output, "normand-karol-mendoza-cv.pdf"));
assert(cv.subarray(0, 4).toString() === "%PDF", "Download is not a PDF");
assert((await stat(path.join(output, ".nojekyll"))).isFile());
if (process.env.NEXT_PUBLIC_SITE_URL)
  assert(
    html.includes(
      `href="${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/"`,
    ),
    "Canonical URL differs from the deployment URL",
  );
console.log(
  `Static export verified: ${verified.size} referenced assets, required content, anchors, GitHub links, canonical URL, and CV. Base path: ${prefix || "/"}`,
);
