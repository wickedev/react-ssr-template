import ReactDOM from "react-dom";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { routes } from "./routes";

const router = createBrowserRouter({
  routes,
});

const container = document.getElementById("app");
// ReactDOM.createRoot(container!!).render(<AppRoot router={router} />);
ReactDOM.hydrateRoot(container!!, <AppRoot router={router} />);
//ReactDOM.render(<AppRoot router={router} />, container);
