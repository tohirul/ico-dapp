"use client";

import { ReactNode } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth requiredRole="user">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
