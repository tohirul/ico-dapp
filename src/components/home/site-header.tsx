import Image from "next/image";
import Link from "next/link";

import type { NavItem } from "@/lib/site-config";

interface SiteHeaderProps {
  tokenName: string;
  navItems: NavItem[];
}

export function SiteHeader({ tokenName, navItems }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 pt-4 sm:pt-6">
      <div className="content-shell">
        <div className="flex items-center justify-between gap-6 rounded-full border border-white/8 bg-[rgba(3,7,18,0.76)] px-4 py-3 backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="glow-ring flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]">
              <Image src="/logo.png" alt={tokenName} width={28} height={28} />
            </div>
            <div>
              <p className="font-display text-lg leading-none text-white">
                {tokenName}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">
                Launch control
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/58 transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
