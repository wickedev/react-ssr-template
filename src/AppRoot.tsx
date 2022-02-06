import { RouterProps, RouterProvider } from "yarr";
import { App } from "./App";
import "./style.css";

export function AppRoot({ router }: { router: RouterProps }) {
  return (
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  );
}
