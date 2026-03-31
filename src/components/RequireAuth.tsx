"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, Role } from "@/context/AuthContext";

interface RequireAuthProps {
  requiredRole?: Role | Role[]; // if omitted, any authenticated user passes
  children: React.ReactNode;
}

export const RequireAuth = ({ requiredRole, children }: RequireAuthProps) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // No user → go to sign‑in
    if (!user) {
      router.replace("/signin");
      return;
    }
    // Role check if provided
    if (requiredRole) {
      const allowed = Array.isArray(requiredRole)
        ? requiredRole.includes(user.role)
        : user.role === requiredRole;
      if (!allowed) {
        // redirect to a generic fallback – home for now
        router.replace("/");
        return;
      }
    }
    // else everything is fine
  }, [user, isLoading, requiredRole, router]);

  // Show nothing while loading
  if (isLoading) return null;

  // Render children only when the auth check passed
  if (!user) return null;
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
    if (!allowed) return null;
  }
  return <>{children}</>;
};
