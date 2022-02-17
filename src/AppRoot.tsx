import { ErrorBoundary } from "react-error-boundary";
import { FilledContext, Helmet, HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import "regenerator-runtime/runtime";
import { Environment } from "relay-runtime/lib/store/RelayStoreTypes";
import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";
import { Layout } from "./components/Layout";
import "./index.css";
import { Auth } from "./store/Auth";
import { AuthContext } from "./store/AuthContext";

export function AppRoot({
  router,
  relayEnvironment,
  auth,
  helmetContext,
}: {
  router: RouterProps;
  relayEnvironment: Environment;
  auth: Auth;
  helmetContext?: FilledContext;
}) {
  return (
      <AuthContext.Provider value={auth}>
        <HelmetProvider context={helmetContext}>
          <RelayEnvironmentProvider environment={relayEnvironment}>
            <ErrorBoundary fallbackRender={(props) => <pre>{JSON.stringify(props.error, null, 4)}</pre>}>
              <RouterProvider router={router}>
                <Helmet>
                  <title>Hello Relay</title>
                </Helmet>
                <Layout>
                  <App />
                </Layout>
              </RouterProvider>
            </ErrorBoundary>
          </RelayEnvironmentProvider>
        </HelmetProvider>
      </AuthContext.Provider>
  );
}
