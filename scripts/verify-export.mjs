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
async function checkAsset(
  url,
  fromFile = path.join(output, "index.html"),
  pageIds = ids,
) {
  if (/^(https?:|data:|mailto:|blob:|\/\/)/.test(url)) return;
  url = url.replace(/&amp;/g, "&");
  if (url.startsWith("#")) {
    assert(pageIds.has(url.slice(1)), `Missing anchor destination: ${url}`);
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
  if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
  assert((await stat(file)).isFile(), `Missing asset: ${url}`);
  verified.add(file);
}
const notFound = await readFile(path.join(output, "404.html"), "utf8");
for (const [name, document] of [
  ["index.html", html],
  ["404.html", notFound],
]) {
  const pageIds = new Set(
    Array.from(document.matchAll(/\bid="([^"]+)"/g), (match) => match[1]),
  );
  for (const tag of document.matchAll(
    /<(?:script|link|img|a|source|audio)\b[^>]*>/g,
  )) {
    if (/rel="(?:preconnect|dns-prefetch)"/.test(tag[0])) continue;
    for (const match of tag[0].matchAll(/\b(?:src|href)="([^"]+)"/g))
      await checkAsset(match[1], path.join(output, name), pageIds);
  }
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith(".css")) {
      const css = await readFile(file, "utf8");
      for (const match of css.matchAll(
        /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/g,
      ))
        await checkAsset(match[1] ?? match[2] ?? match[3], file);
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
  "Wonderwall",
  "Oasis",
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
assert(ids.has("listening"), "Music section missing");
assert(
  html.includes('preload="none"'),
  "Audio must not preload on the initial page",
);
assert(!/<audio\b[^>]*\bautoplay\b/.test(html), "Music must never autoplay");
assert(
  !/<audio\b[^>]*\bcontrols\b/.test(html),
  "The player should use custom controls",
);
if (process.env.NEXT_PUBLIC_SITE_URL)
  assert(
    html.includes(
      `href="${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/"`,
    ),
    "Canonical URL differs from the deployment URL",
  );

// Browser identity must be present in the exported HTML, even without JavaScript.
const metadata = new Map();
for (const tag of html.matchAll(/<meta\b[^>]*>/g)) {
  const attributes = Object.fromEntries(
    Array.from(tag[0].matchAll(/([\w:-]+)="([^"]*)"/g), (match) => [
      match[1],
      match[2],
    ]),
  );
  metadata.set(attributes.name ?? attributes.property, attributes.content);
}
const productionUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://karlmendoo.me"
).replace(/\/$/, "");
assert(
  metadata.get("description")?.includes("Computer Science student"),
  "Factual page description missing",
);
assert(
  metadata.get("og:title")?.includes("Normand Karol Mendoza"),
  "Social title missing",
);
assert.equal(
  metadata.get("og:url"),
  `${productionUrl}/`,
  "Social URL differs from deployment",
);
assert.equal(
  metadata.get("og:image"),
  `${productionUrl}/social-preview.png`,
  "Social image URL differs from deployment",
);
assert.equal(
  metadata.get("twitter:card"),
  "summary_large_image",
  "Large social card missing",
);
assert.equal(
  metadata.get("twitter:image"),
  metadata.get("og:image"),
  "Social images differ",
);
assert.equal(
  metadata.get("theme-color"),
  "#eaf3ff",
  "Permanent pastel browser color missing",
);
const preview = await readFile(path.join(output, "social-preview.png"));
assert.equal(
  preview.subarray(1, 4).toString(),
  "PNG",
  "Social image is not a PNG",
);
assert.equal(preview.readUInt32BE(16), 1200, "Social image width differs");
assert.equal(preview.readUInt32BE(20), 630, "Social image height differs");
assert(ids.has("currently-heading"), "Currently status missing");
assert(
  html.replace(/<!--[\s\S]*?-->/g, "").includes("MANILA —"),
  "Manila metadata missing",
);
const linkedIn = "https://www.linkedin.com/in/normand-karol-mendoza-215826219/";
const professionalLink = Array.from(
  html.matchAll(/<a\b[^>]*>/g),
  (match) => match[0],
).find((tag) => tag.includes(`href="${linkedIn}"`));
assert(
  professionalLink?.includes('target="_blank"') &&
    professionalLink.includes('rel="noopener noreferrer"'),
  "Exact accessible LinkedIn destination missing",
);
assert(/<title>404/.test(notFound), "Custom 404 title missing");
assert(notFound.includes("A small detour."), "Custom 404 content missing");
assert(
  notFound.includes(`href="${prefix}/"`),
  "404 return link does not respect the deployment path",
);
assert(
  /<meta name="robots" content="[^"]*noindex/.test(notFound),
  "404 must not be indexed",
);
console.log(
  `Static export verified: ${verified.size} referenced assets, required content, anchors, social metadata, LinkedIn, 404, canonical URL, and CV. Base path: ${prefix || "/"}`,
);
