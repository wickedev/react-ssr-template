import ReactDOM from "react-dom";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { createRelayEnvironment } from "./relay/RelayEnvironment";
import { routes } from "./routes";

const router = createBrowserRouter({
  routes,
});

const relayEnvironment = createRelayEnvironment(window.__PRELOADED_STATE__);

const container = document.getElementById("app");
// ReactDOM.createRoot(container!!).render(<AppRoot router={router} />);
// ReactDOM.hydrateRoot(container!!, <AppRoot router={router} />);
ReactDOM.render(
  <AppRoot router={router} relayEnvironment={relayEnvironment} />,
  container
);
