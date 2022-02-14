import ReactDOM from "react-dom";
import { proxy } from "valtio";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { ClientRequestContext } from "./relay/RequestContext";
import { createRoutes } from "./routes";

const requestContext = proxy(new ClientRequestContext());
const relayEnvironment = createRelayEnvironment(
  requestContext,
  window.__PRELOADED_STATE__
);

const router = createBrowserRouter({
  routes: createRoutes(requestContext, relayEnvironment),
});

const container = document.getElementById("app");
// ReactDOM.createRoot(container!!).render(<AppRoot router={router} />);
// ReactDOM.hydrateRoot(container!!, <AppRoot router={router} />);
ReactDOM.render(
  <AppRoot
    router={router}
    relayEnvironment={relayEnvironment}
    requestContext={requestContext}
  />,
  container
);
