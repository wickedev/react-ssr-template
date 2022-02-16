import { Suspense } from "react";
import { RouteRenderer } from "yarr";
import { Navbar } from "./components/Navbar";
import { Progress } from "./components/Progress";

export function App() {
  return (
    <Suspense fallback={<Progress />}>
      <RouteRenderer
        pendingIndicator={<p>...pending loading </p>}
        routeWrapper={({ Route }) => (
          <>
            <Navbar />
            <Suspense fallback={<Progress />}>{Route}</Suspense>
          </>
        )}
      />
    </Suspense>
  );
}
