import { Environment, loadQuery } from "react-relay";
import { RouteConfig, RouteParameters, RouteProps, RoutesConfig } from "yarr";
import { homePostsQuery } from "./pages/Home";
import { postQuery } from "./pages/Post";

export interface PreloadQueryRouteProps extends RouteProps<string> {
  preloaded: any;
}
export function createRoutes(relayEnvironment: Environment): RoutesConfig {
  return (<RouteConfig<string, string, PreloadQueryRouteProps>[]>[
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
      path: "/about",
      component: async () => {
        const module = await import("./pages/About");
        return module.AboutPage;
      },
    },
    {
      path: "/post/:id",
      component: async () => {
        const module = await import("./pages/Post");
        return module.PostPage;
      },
      preload: (routeParameters: RouteParameters<"/post/:id">) => {
        return {
          query: loadQuery(relayEnvironment, postQuery, {
            id: routeParameters.id,
          }),
        };
      },
    },
    {
      path: "*",
      component: async () => {
        const module = await import("./pages/NotFound");
        return module.NotFoundPage;
      },
    },
  ]) as any;
}
