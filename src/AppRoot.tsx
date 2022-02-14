import { StrictMode } from "react";
import { FilledContext, Helmet, HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import "regenerator-runtime/runtime";
import { Environment } from "relay-runtime/lib/store/RelayStoreTypes";
import { proxy } from "valtio";
import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";
import { Layout } from "./components/Layout";
import "./index.css";
import { IRequestContext, RequestContext } from "./relay/RequestContext";

export function AppRoot({
  router,
  relayEnvironment,
  requestContext,
  helmetContext,
}: {
  router: RouterProps;
  relayEnvironment: Environment;
  requestContext: IRequestContext;
  helmetContext?: FilledContext;
}) {
  return (
    <StrictMode>
      <RequestContext.Provider value={requestContext}>
        <HelmetProvider context={helmetContext}>
          <RelayEnvironmentProvider environment={relayEnvironment}>
            <RouterProvider router={router}>
              <Helmet>
                <title>Hello Relay</title>
              </Helmet>
              <Layout>
                <App />
              </Layout>
            </RouterProvider>
          </RelayEnvironmentProvider>
        </HelmetProvider>
      </RequestContext.Provider>
    </StrictMode>
  );
}
