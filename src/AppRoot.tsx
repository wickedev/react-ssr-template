import { StrictMode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import "regenerator-runtime/runtime";
import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";
import { relayEnvironment } from "./relay/RelayEnvironment";
import "./style.css";

export function AppRoot({ router }: { router: RouterProps }) {
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
