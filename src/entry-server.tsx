import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { FilledContext } from "react-helmet-async";
import ssrPrepass from "react-ssr-prepass";
import { createMemoryRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { createRoutes } from "./routes";

export async function render(
  url: string,
  helmetContext: FilledContext
): Promise<string> {
  const relayEnvironment = createRelayEnvironment({});

  const router = createMemoryRouter(
    {
      routes: createRoutes(relayEnvironment),
    },
    { initialEntries: [url] }
  );

  const element = createElement(AppRoot, {
    router,
    relayEnvironment,
    helmetContext,
  });
  await ssrPrepass(element);

  const relayInitialData = relayEnvironment.getStore().getSource();
  const appHtml = renderToString(element);
  const preloadedState = `<script>window.__PRELOADED_STATE__=${JSON.stringify(
    relayInitialData
  )}</script>`;

  return `${appHtml}${preloadedState}`;
}
