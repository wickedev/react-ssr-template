import ReactDOM from "react-dom";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { createRoutes } from "./routes";


const relayEnvironment = createRelayEnvironment(window.__PRELOADED_STATE__);

const router = createBrowserRouter({
  routes:createRoutes(relayEnvironment),
});

const container = document.getElementById("app");
// ReactDOM.createRoot(container!!).render(<AppRoot router={router} />);
// ReactDOM.hydrateRoot(container!!, <AppRoot router={router} />);
ReactDOM.render(
  <AppRoot router={router} relayEnvironment={relayEnvironment} />,
  container
);
