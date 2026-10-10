import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";

// Local QA only. GitHub Pages serves the exported files without a Node server.
const directory = path.resolve(process.env.STATIC_DIRECTORY ?? "out");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.env.PREVIEW_PORT ?? 3001);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      if (basePath && pathname === basePath) {
        response.writeHead(301, { Location: `${basePath}/` });
        response.end();
        return;
      }
      if (basePath && !pathname.startsWith(`${basePath}/`))
        throw new Error("Outside base path");
      let file = path.resolve(directory, `.${pathname.slice(basePath.length)}`);
      if (file !== directory && !file.startsWith(`${directory}${path.sep}`))
        throw new Error("Outside export");
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      const content = await readFile(file);
      const headers = {
        "Content-Type": mime[path.extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
        "Accept-Ranges": "bytes",
        "Content-Length": content.length,
      };
      const range = request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
      if (range) {
        const start = range[1]
          ? Number(range[1])
          : Math.max(0, content.length - Number(range[2]));
        const end =
          range[1] && range[2]
            ? Math.min(Number(range[2]), content.length - 1)
            : content.length - 1;
        if (start > end || start >= content.length) {
          response.writeHead(416, {
            "Content-Range": `bytes */${content.length}`,
          });
          response.end();
          return;
        }
        const slice = content.subarray(start, end + 1);
        response.writeHead(206, {
          ...headers,
          "Content-Range": `bytes ${start}-${end}/${content.length}`,
          "Content-Length": slice.length,
        });
        response.end(request.method === "HEAD" ? undefined : slice);
      } else {
        response.writeHead(200, headers);
        response.end(request.method === "HEAD" ? undefined : content);
      }
    } catch {
      // Match GitHub Pages' static 404 handling during local QA.
      let content;
      try {
        content = await readFile(path.join(directory, "404.html"));
      } catch {
        content = Buffer.from("Not found");
      }
      response.writeHead(404, {
        "Content-Type":
          content[0] === 60 ? "text/html; charset=utf-8" : "text/plain",
        "Cache-Control": "no-store",
        "Content-Length": content.length,
      });
      response.end(request.method === "HEAD" ? undefined : content);
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`),
  );
