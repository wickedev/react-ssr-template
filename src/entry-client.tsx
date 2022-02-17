import ReactDOM from "react-dom";
import { proxy } from "valtio";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./lib/RelayEnvironment";
import { ClientRequestContext } from "./lib/request-context/ClientRequestContext";
import { createRoutes } from "./routes";
import { AuthStore } from "./store/AuthStore";

const requestContext = new ClientRequestContext();
const relayEnvironment = createRelayEnvironment(
  requestContext,
  window.__PRELOADED_STATE__
);

requestContext.scheduledRefresh(relayEnvironment);

const auth = proxy(new AuthStore(requestContext));

const router = createBrowserRouter({
  routes: createRoutes(auth, relayEnvironment),
  awaitComponent: true,
});

const container = document.getElementById("app");
/* ReactDOM.createRoot(container!!).render(
  <AppRoot router={router} relayEnvironment={relayEnvironment} auth={auth} />
); */
ReactDOM.hydrateRoot(
  container!!,
  <AppRoot router={router} relayEnvironment={relayEnvironment} auth={auth} />
);
/* ReactDOM.render(
  <AppRoot router={router} relayEnvironment={relayEnvironment} auth={auth} />,
  container
) */
