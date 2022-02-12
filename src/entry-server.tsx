import { createElement } from "react";
import { renderToString } from "react-dom/server";
import ssrPrepass from "react-ssr-prepass";
import { createMemoryRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { createRoutes } from "./routes";

export async function render(url: string): Promise<string> {
  const relayEnvironment = createRelayEnvironment({});

  const router = createMemoryRouter(
    {
      routes: createRoutes(relayEnvironment),
    },
    { initialEntries: [url] }
  );

  const element = createElement(AppRoot, { router, relayEnvironment });
  await ssrPrepass(element);

  const relayInitialData = relayEnvironment.getStore().getSource();
  const appHtml = renderToString(element);

  return `${appHtml}<script>window.__PRELOADED_STATE__=${JSON.stringify(
    relayInitialData
  )}</script>`;
}
