import ReactDOM from "react-dom";
import { proxy } from "valtio";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { ClientRequestContext } from "./relay/request-context/ClientRequestContext";
import { createRoutes } from "./routes";
import { Auth } from "./store/ClientAuth";

const requestContext = new ClientRequestContext();
const relayEnvironment = createRelayEnvironment(
  requestContext,
  window.__PRELOADED_STATE__
);

requestContext.scheduledRefresh(relayEnvironment);

const auth = proxy(new Auth(requestContext));

const router = createBrowserRouter({
  routes: createRoutes(requestContext, relayEnvironment),
});

const container = document.getElementById("app");
// ReactDOM.createRoot(container!!).render(<AppRoot router={router} />);
// ReactDOM.hydrateRoot(container!!, <AppRoot router={router} />);
ReactDOM.render(
  <AppRoot router={router} relayEnvironment={relayEnvironment} auth={auth} />,
  container
);
