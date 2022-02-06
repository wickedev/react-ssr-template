import { startDevServer } from "./server-develop";
import { startProdServer } from "./server-production";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  startProdServer();
} else {
  startDevServer();
}
