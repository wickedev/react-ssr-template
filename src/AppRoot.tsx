import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";

export function AppRoot({ router }: { router: RouterProps }) {
  return (
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  );
}
