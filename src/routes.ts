import { Environment, loadQuery } from "react-relay";
import { RouteConfig, RouteParameters, RouteProps, RoutesConfig } from "yarr";
import { homePostsQuery } from "./pages/Home";
import { postQuery } from "./pages/Post";
import { RequestContext } from "./relay/request-context/RequestContext";

export interface PreloadQueryRouteProps extends RouteProps<string> {
  preloaded: any;
}
export function createRoutes(
  requestContext: RequestContext,
  relayEnvironment: Environment
): RoutesConfig {
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
      path: "/login",
      component: async () => {
        const module = await import("./pages/Login");
        return module.LoginPage;
      },
      redirectRules: () => {
        return requestContext.accessToken ? "/" : null;
      },
    },
    {
      path: "/sign-up",
      component: async () => {
        const module = await import("./pages/SignUp");
        return module.SignUpPage;
      },
    },
    {
      path: "/post/new",
      component: async () => {
        const module = await import("./pages/NewPost");
        return module.NewPostPage;
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
