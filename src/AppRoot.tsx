import { StrictMode } from "react";
import { FilledContext, Helmet, HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import "regenerator-runtime/runtime";
import { Environment } from "relay-runtime/lib/store/RelayStoreTypes";
import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";
import { Layout } from "./components/Layout";
import "./index.css";

export function AppRoot({
  router,
  relayEnvironment,
  helmetContext,
}: {
  router: RouterProps;
  relayEnvironment: Environment;
  helmetContext?: FilledContext;
}) {
  return (
    <StrictMode>
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
    </StrictMode>
  );
}
