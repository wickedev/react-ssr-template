import { ReactNode } from "react";

export function Content({ children }: { children: ReactNode }) {
  return <main className="flex justify-center p-4">{children}</main>;
}
