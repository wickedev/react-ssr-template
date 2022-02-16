import type { ServerResponse } from "http";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { FilledContext } from "react-helmet-async";
import ssrPrepass from "react-ssr-prepass";
import { proxy } from "valtio";
import { createMemoryRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./lib/RelayEnvironment";
import { ServerRequestContext } from "./lib/request-context/ServerRequestContext";
import { createRoutes } from "./routes";
import { Auth } from "./store/ClientAuth";

export async function render(
  url: string,
  helmetContext: FilledContext,
  cookies: Record<string, string>,
  res: ServerResponse
): Promise<string> {
  const requestContext = new ServerRequestContext(cookies, res);

  const relayEnvironment = createRelayEnvironment(requestContext, {});

  await requestContext.refresh(relayEnvironment);

  const auth = proxy(new Auth(requestContext));

  const router = createMemoryRouter(
    {
      routes: createRoutes(requestContext, relayEnvironment),
    },
    { initialEntries: [url] }
  );

  const element = createElement(AppRoot, {
    router,
    relayEnvironment,
    auth,
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
