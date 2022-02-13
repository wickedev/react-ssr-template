import { Suspense } from "react";
import { RouteRenderer } from "yarr";
import { Layout } from "./components/Layout";
import { Navbar } from "./components/Navbar";

export function App() {
  return (
    <Suspense fallback={"...loading"}>
      <RouteRenderer
        pendingIndicator={<p>...pending loading </p>}
        routeWrapper={({ Route }) => (
          <>
            <Navbar />
            <main className="pt-16 h-full">{Route}</main>
          </>
        )}
      />
    </Suspense>
  );
}
