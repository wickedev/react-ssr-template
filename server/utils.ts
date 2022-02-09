import fs from "fs";
import type { IncomingMessage } from "http";
import { isMatch } from "matcher";
import path from "path";

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
