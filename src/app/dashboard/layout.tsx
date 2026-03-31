"use client";
import { RequireAuth } from "@/components/RequireAuth";
import { Sidebar } from "@/components/sidebar/Sidebar";
import clsx from "clsx";

import { ReactNode, useState } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <RequireAuth requiredRole="user">
      <div className="flex">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        <main
          className={clsx(
            "flex-1 transition-all duration-300",
            expanded ? "ml-[280px]" : "ml-[88px]",
          )}
        >
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
