"use client";
import Image from "next/image";
import Link from "next/link";

import type { NavigationConfig } from "@/lib/site-config";
import Container from "../shared/container";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../library/button";

interface SiteHeaderProps {
  tokenName: string;
  navigation: NavigationConfig;
}

export function SiteHeader({ tokenName, navigation }: SiteHeaderProps) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30">
      <Container>
        <div className="content-shell">
          <div className="flex items-center justify-between gap-6 rounded-full border border-white/8 bg-[rgba(3,7,18,0.76)] px-4 py-3 backdrop-blur-xl sm:px-6">
            {/* 🔷 LEFT: LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.15),transparent_70%)] blur-md" />

                <Image
                  src="/logo-02.png"
                  alt={tokenName}
                  fill
                  sizes="width: 48px; height: 48px;"
                  className="object-contain relative z-10  scale-230"
                />
              </div>
              <div>
                <p className="font-display text-md leading-none text-white">
                  OGT COIN
                </p>
                <p className="text-[10px] font-semibold hidden lg:block uppercase tracking-[0.30em] text-white/38">
                  optivision global technologies
                </p>
              </div>
            </Link>

            {/* 🔷 CENTER: NAV LINKS */}
            <nav className="hidden items-center gap-6 md:flex">
              {navigation?.items?.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-md font-medium text-white/58 transition hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* 🔷 RIGHT: ACTIONS */}
            <div className="hidden items-center gap-3 md:flex">
              {navigation.ctas
                .filter((cta) => {
                  if (cta.label === "Sign In") return !user;
                  if (cta.label === "Dashboard") return !!user;
                  if (cta.label === "Logout") return !!user;
                  return true;
                })
                .map((cta) => {
                  const base =
                    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition";

                  return (
                    <Button
                      key={cta.label}
                      variant={cta?.variant}
                      radius="full"
                      size="sm"
                      onClick={(e) => {
                        if (cta.label === "Logout") {
                          e.preventDefault();
                          logout();
                        }
                      }}
                    >
                      {cta.label !== "Logout" ? (
                        <Link
                          href={cta.href}
                          target={cta.external ? "_blank" : undefined}
                          className={`${base}`}
                        >
                          {cta.label}
                        </Link>
                      ) : (
                        cta.label
                      )}
                    </Button>
                  );
                })}
            </div>

            {/* 🔷 MOBILE MENU BUTTON (placeholder) */}
            <button className="md:hidden text-white/70">☰</button>
          </div>
        </div>
      </Container>
    </header>
  );
}
