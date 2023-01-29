import http from "node:http";
import { readFileSync } from "node:fs";

http
  .createServer((req, res) => {
    const path = req.url.slice(1);
    if (!path) {
      res.setHeader("Content-Type", "text/html");
      res.end(readFileSync("index.html"));
    } else if (path === "vite.svg") {
      res.setHeader("Content-Type", "image/svg+xml");
      res.end(readFileSync("public/vite.svg"));
    } else {
      res.setHeader("Content-Type", "text/javascript");
      res.end(readFileSync(path));
    }
  })
  .listen(4000);
