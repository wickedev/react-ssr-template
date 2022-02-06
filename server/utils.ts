import fs from "fs";
import path from "path";

export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);
export const root = resolveApp(".");
