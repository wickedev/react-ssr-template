import fs from "fs";
import { createApp, send } from "h3";
import { createServer } from "http";
import { FilledContext } from "react-helmet-async";
import serveStatic from "serve-static";
import { isNotSupport, proxyMiddleware, resolveApp } from "./utils";

export async function startProdServer() {
  const app = createApp();
  app.use([
    serveStatic(resolveApp("dist/client"), {
      index: false,
    }),
    serveStatic(resolveApp("public"), {
      index: false,
    }),
  ]);

  app.use("/graphql", (req, res, next) => {
    proxyMiddleware(req, res, () => {
      // no op
    });
  });

  app.use("*", async (req, res, next) => {
    if (isNotSupport(req)) {
      return next();
    }

    const url = req.url!!;

    if (/^\/(api|graphql)/.test(url)) {
      return next();
    }

    try {
      const template = fs.readFileSync(
        resolveApp("dist/client/index.html"),
        "utf-8"
      );
      const { render } = await import(
        resolveApp("dist/server/entry-server.js")
      );

      const helmetContext = {} as FilledContext;
      const appHtml = await render(url, helmetContext);
      const { helmet } = helmetContext;
      const html = template
        .replace(`</head>`, `${helmet.title.toString()}</head>`)
        .replace(`</head>`, `${helmet.link.toString()}</head>`)
        .replace(`</head>`, `${helmet.meta.toString()}</head>`)
        .replace(`<!--app-html-->`, appHtml);
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
