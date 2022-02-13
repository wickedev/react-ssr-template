import { ReactNode } from "react";

export function Content({ children }: { children: ReactNode }) {
  return <main className="p-4">{children}</main>;
}
