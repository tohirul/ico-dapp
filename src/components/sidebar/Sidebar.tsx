"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // Simple navigation based on role – you can extend this as needed
  const commonLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
  ];

  const adminLinks = [{ href: "/admin", label: "Admin Panel" }];

  const links = user?.role === "admin" ? commonLinks.concat(adminLinks) : commonLinks;

  return (
    <aside className="w-64 h-screen bg-[#111] border-r border-border/30 flex flex-col p-4">
      <div className="flex-1 space-y-2">
        {links.map((ln) => (
          <Link
            key={ln.href}
            href={ln.href}
            className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-smooth"
          >
            {ln.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 w-full py-2 rounded-lg bg-accent hover:bg-accent/80 transition-smooth"
      >
        Logout ({user?.name})
      </button>
    </aside>
  );
};
