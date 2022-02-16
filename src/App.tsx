import { Suspense } from "react";
import { RouteRenderer } from "yarr";
import { Navbar } from "./components/Navbar";

export function App() {
  return (
    <Suspense fallback={"...loading"}>
      <RouteRenderer
        pendingIndicator={<p>...pending loading </p>}
        routeWrapper={({ Route }) => (
          <>
            <Navbar />
            {Route}
          </>
        )}
      />
    </Suspense>
  );
}
