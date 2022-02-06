import { createElement } from "react";
import { renderToString } from "react-dom/server";
import ssrPrepass from "react-ssr-prepass";
import { createMemoryRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { routes } from "./routes";

const router = createMemoryRouter({
  routes,
});

export async function render(url: string): Promise<string> {
  const element = createElement(AppRoot, { router });
  await ssrPrepass(element);
  return renderToString(element);
}
