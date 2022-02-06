import { createElement } from "react";
import { renderToString } from "react-dom/server";
import ssrPrepass from "react-ssr-prepass";
import { createMemoryRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { routes } from "./routes";

export async function render(url: string): Promise<string> {
  const router = createMemoryRouter(
    {
      routes,
    },
    { initialEntries: [url] }
  );

  const element = createElement(AppRoot, { router });
  await ssrPrepass(element);
  return renderToString(element);
}
