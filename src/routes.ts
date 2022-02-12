import { Environment, loadQuery } from "react-relay";
import { homePostsQuery } from "./pages/Home";

export function createRoutes(relayEnvironment: Environment) {
  return [
    {
      path: "/about",
      component: async () => {
        const module = await import("./pages/About");
        return module.AboutPage;
      },
    },
    {
      path: "/",
      component: async () => {
        const module = await import("./pages/Home");
        return module.HomePage;
      },
      preload: () => ({
        query: loadQuery(relayEnvironment, homePostsQuery, {}),
      }),
    },
    {
      path: "*",
      component: async () => {
        const module = await import("./pages/NotFound");
        return module.NotFoundPage;
      },
    },
  ];
}
