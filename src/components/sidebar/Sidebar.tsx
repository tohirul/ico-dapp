"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import clsx from "clsx";

import {
  LayoutDashboard,
  Coins,
  ArrowLeftRight,
  Gift,
  Image as ImageIcon,
  BarChart3,
  History,
  Settings,
  LifeBuoy,
  Shield,
  Users,
  Activity,
  CreditCard,
  LogOut,
  ChevronLeft,
  LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= CONFIG ================= */

type NavItem = {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const USER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/staking", label: "Staking", icon: Coins },
  { href: "/dashboard/swap", label: "Buy / Sell", icon: ArrowLeftRight },
  { href: "/dashboard/rewards", label: "Rewards", icon: Gift },
  { href: "/dashboard/nft", label: "NFT Marketplace", icon: ImageIcon },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: BarChart3 },
  { href: "/dashboard/transactions", label: "Transactions", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/transactions", label: "Transactions", icon: Activity },
  { href: "/admin/ogt", label: "OGT Control", icon: Shield },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

/* ================= ROOT ================= */

export const Sidebar = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="fixed left-0 top-0 h-screen z-40">
      {/* ================= SIDEBAR ================= */}
      <motion.aside
        layout
        animate={{ width: expanded ? 280 : 88 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="relative h-full p-3"
      >
        <div className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
          <SidebarHeader expanded={expanded} />

          <SidebarNav
            expanded={expanded}
            pathname={pathname}
            role={user?.role}
          />

          <SidebarFooter expanded={expanded} onLogout={handleLogout} />
        </div>
      </motion.aside>

      {/* ================= FLOATING TOGGLE ================= */}
      <SidebarToggle expanded={expanded} setExpanded={setExpanded} />
    </div>
  );
};

/* ================= HEADER ================= */

function SidebarHeader({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-4 border-b border-white/10">
      <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
        <Image
          src="/logo-02.png"
          alt="OGT"
          width={128}
          height={128}
          className="object-cover relative z-10 scale-190"
        />
        <div className="absolute inset-0 bg-primary/20 blur-md opacity-70" />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className="font-semibold tracking-tight"
          >
            OGT COIN
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= NAV ================= */

function SidebarNav({
  expanded,
  pathname,
  role,
}: {
  expanded: boolean;
  pathname: string;
  role?: string;
}) {
  return (
    <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
      <NavSection
        title="User"
        items={USER_NAV}
        expanded={expanded}
        pathname={pathname}
      />

      {role === "admin" && (
        <NavSection
          title="Admin"
          items={ADMIN_NAV}
          expanded={expanded}
          pathname={pathname}
        />
      )}
    </nav>
  );
}

/* ================= SECTION ================= */

function NavSection({
  title,
  items,
  expanded,
  pathname,
}: {
  title: string;
  items: NavItem[];
  expanded: boolean;
  pathname: string;
}) {
  return (
    <div className="space-y-1">
      {expanded && (
        <p className="px-3 pt-2 pb-1 text-xs text-white/30 uppercase tracking-wider">
          {title}
        </p>
      )}

      {items.map((item) => (
        <NavItemRow
          key={item.href}
          item={item}
          expanded={expanded}
          active={pathname.startsWith(item.href)}
        />
      ))}
    </div>
  );
}

/* ================= ITEM ================= */

function NavItemRow({
  item,
  expanded,
  active,
}: {
  item: NavItem;
  expanded: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link href={item.href}>
      <motion.div
        layout
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl"
      >
        {/* active background */}
        {active && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 rounded-xl bg-white/10 border border-white/20"
          />
        )}

        <Icon size={18} className={active ? "text-white" : "text-white/60"} />

        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className={clsx(
                "text-sm font-medium",
                active ? "text-white" : "text-white/60",
              )}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

/* ================= FOOTER ================= */

function SidebarFooter({
  expanded,
  onLogout,
}: {
  expanded: boolean;
  onLogout: () => void;
}) {
  return (
    <div className="p-2 border-t border-white/10">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl"
      >
        <LogOut size={18} className="text-red-400" />

        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="text-sm text-red-400"
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 rounded-xl bg-red-500/10 opacity-0 hover:opacity-100 transition" />
      </motion.button>
    </div>
  );
}

/* ================= TOGGLE ================= */

function SidebarToggle({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  return (
    <motion.button
      onClick={() => setExpanded(!expanded)}
      animate={{
        left: expanded ? 260 : 68,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "absolute top-6 z-50 w-8 h-8 flex items-center justify-center rounded-full",
        "bg-white/10 backdrop-blur-md border border-white/20",
        " hover:bg-white/20",
        expanded ? "-ml-2" : "",
      )}
    >
      <motion.div
        animate={{ rotate: expanded ? 0 : 180 }}
        transition={{ duration: 0.25 }}
      >
        <ChevronLeft size={16} />
      </motion.div>

      <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-70" />
    </motion.button>
  );
}
