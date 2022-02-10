import fs from "fs";
import { Middleware } from "h3";
import type { IncomingMessage } from "http";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { isMatch } from "matcher";
import path from "path";
import { ModuleNode } from "vite";

const REMOTE_SERVER = process.env.REMOTE_SERVER || "http://localhost:8080";

export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);
export const root = resolveApp(".");

export function isNotSupport(req: IncomingMessage): boolean {
  return (
    req.headers.accept == null ||
    !(
      isMatch("text/html", req.headers.accept) ||
      req.headers.accept.includes("text/html")
    )
  );
}

export const proxyMiddleware = proxy({
  target: REMOTE_SERVER,
  changeOrigin: true,
  autoRewrite: true,
  logLevel: "debug",
  pathRewrite: {
    "^/api/graphql": "/graphql",
  },
}) as Middleware;

export function collectCssUrls(
  mods: Set<ModuleNode>,
  styles: Map<string, string> = new Map(),
  cache: Set<string> = new Set()
): string {
  for (const mod of mods) {
    if (mod.id && cache.has(mod.id)) {
      continue;
    }

    if (mod.ssrModule && mod.file && mod.id) {
      if (mod.file.endsWith(".css") || /\?vue&type=style/.test(mod.id)) {
        styles.set(mod.url, mod.ssrModule.default);
      }
    }

    mod.id && cache.add(mod.id);

    if (mod.importedModules.size > 0) {
      collectCssUrls(mod.importedModules, styles, cache);
    }
  }

  return `<style>${[...styles.values()].join("")}</style>`;
}
