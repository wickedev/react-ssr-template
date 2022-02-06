import ReactDOM from "react-dom";
import { createBrowserRouter } from "yarr";
import { AppRoot } from "./AppRoot";
import { routes } from "./routes";

const router = createBrowserRouter({
  routes,
});

const container = document.getElementById("app");
container && ReactDOM.hydrateRoot(container, <AppRoot router={router} />);
