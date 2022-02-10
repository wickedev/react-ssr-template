import { StrictMode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import "regenerator-runtime/runtime";
import { Environment } from "relay-runtime/lib/store/RelayStoreTypes";
import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";
import "./style.css";

export function AppRoot({
  router,
  relayEnvironment,
}: {
  router: RouterProps;
  relayEnvironment: Environment;
}) {
  return (
    <StrictMode>
      <RelayEnvironmentProvider environment={relayEnvironment}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </RelayEnvironmentProvider>
    </StrictMode>
  );
}
