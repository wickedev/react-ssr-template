import { ComponentType, memo } from "react";
import { Environment, loadQuery } from "react-relay";
import { RouteConfig, RouteParameters, RouteProps, RoutesConfig } from "yarr";
import { RequestContext } from "./lib/request-context/RequestContext";
import { homePostsQuery } from "./pages/Home";
import { postQuery } from "./pages/Post";

export interface PreloadQueryRouteProps extends RouteProps<string> {
  preloaded: any;
}

function page<Props>(
  factory: () => Promise<{ default: ComponentType<Props> }>
): () => Promise<ComponentType<Props>> {
  return async () => {
    const Component = (await factory()).default;
    return memo(Component) as unknown as ComponentType<Props>;
  };
}
export function createRoutes(
  requestContext: RequestContext,
  relayEnvironment: Environment
): RoutesConfig {
  return (<RouteConfig<string, string, PreloadQueryRouteProps>[]>[
    {
      path: "/",
      component: page(() => import("./pages/Home")),
      preload: () => ({
        query: loadQuery(relayEnvironment, homePostsQuery, {}),
      }),
    },
    {
      path: "/about",
      component: page(() => import("./pages/About")),
    },
    {
      path: "/login",
      component: page(() => import("./pages/Login")),
      redirectRules: () => {
        return requestContext.accessToken ? "/" : null;
      },
    },
    {
      path: "/sign-up",
      component: page(() => import("./pages/SignUP")),
    },
    {
      path: "/post/new",
      component: page(() => import("./pages/NewPost")),
    },
    {
      path: "/post/:id",
      component: page(() => import("./pages/Post")),
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
      component: page(() => import("./pages/NotFound")),
    },
  ]) as any;
}
