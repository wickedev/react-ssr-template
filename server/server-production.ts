import fs from "fs";
import { createApp, send } from "h3";
import { createServer } from "http";
import serveStatic from "serve-static";
import { resolveApp } from "./utils";

export async function startProdServer() {
    const app = createApp();
    app.use([
      serveStatic(resolveApp("dist/client"), {
        index: false,
      }),
      serveStatic(resolveApp("public"), {
        index: false,
      })
    ]);
  
    app.use("*", async (req, res, next) => {
      if (!req.headers.accept?.includes("text/html")) {
        return next();
      }
  
      const url = req.url!!;
  
      try {
        const template = fs.readFileSync(
          resolveApp("dist/client/index.html"),
          "utf-8"
        );
        const { render } = await import(
          resolveApp("dist/server/entry-server.js")
        );
        const appHtml = await render(url);
        const html = template.replace(`<!--app-html-->`, appHtml);
        await send(res, html, "text/html");
      } catch (e) {
        console.error(e);
        next(e as Error);
      }
    });
  
    const port = process.env.PORT || 3000;
    createServer(app).listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }