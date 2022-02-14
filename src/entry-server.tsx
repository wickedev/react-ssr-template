import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { FilledContext } from "react-helmet-async";
import ssrPrepass from "react-ssr-prepass";
import { proxy } from "valtio";
import { createMemoryRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { ServerRequestContext } from "./relay/RequestContext";
import { createRoutes } from "./routes";

export async function render(
  url: string,
  helmetContext: FilledContext,
  cookies: Record<string, string>
): Promise<string> {
  const requestContext = proxy(new ServerRequestContext(cookies));

  const relayEnvironment = createRelayEnvironment(requestContext, {});

  const router = createMemoryRouter(
    {
      routes: createRoutes(requestContext, relayEnvironment),
    },
    { initialEntries: [url] }
  );

  const element = createElement(AppRoot, {
    router,
    relayEnvironment,
    requestContext,
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
