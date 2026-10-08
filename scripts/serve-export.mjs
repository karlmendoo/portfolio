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
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
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
      response.writeHead(200, {
        "Content-Type": mime[path.extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
        "Content-Length": content.length,
      });
      response.end(content);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`),
  );
