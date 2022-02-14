import cx from "classnames";
import { ReactNode } from "react";

interface ContentProps {
  className?: string;
  children: ReactNode;
}

export function Content({ children, className }: ContentProps) {
  return (
    <main className={cx(className, "flex flex-col items-center p-4")}>
      {children}
    </main>
  );
}
