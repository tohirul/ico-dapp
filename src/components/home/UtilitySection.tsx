"use client";

import {
  Globe,
  ShoppingCart,
  Home,
  Plane,
  Truck,
  Store,
  Building2,
  Hotel,
  LucideProps,
} from "lucide-react";
import clsx from "clsx";
import { ForwardRefExoticComponent, RefAttributes } from "react";
export type UtilityItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >; // icon name or image path
  category:
    | "platform"
    | "commerce"
    | "real_estate"
    | "travel"
    | "distribution"
    | "retail"
    | "hospitality";
};

export const utilitiesData: UtilityItem[] = [
  {
    id: "og-global",
    title: "OG Global",
    subtitle: "International Standard Core Platform",
    description:
      "A unified global infrastructure layer powering all OG ecosystem services with standardized protocols and interoperability.",
    icon: Globe,
    category: "platform",
  },
  {
    id: "og-emart",
    title: "OG E-Mart",
    subtitle: "Smart & Modern E-Commerce Solution",
    description:
      "A scalable digital commerce platform enabling seamless transactions, vendor onboarding, and integrated payment systems.",
    icon: ShoppingCart,
    category: "commerce",
  },
  {
    id: "og-housing",
    title: "OG Housing",
    subtitle: "Modern Real Estate Development",
    description:
      "End-to-end real estate solutions including smart housing, property investment, and urban infrastructure development.",
    icon: Home,
    category: "real_estate",
  },
  {
    id: "og-tours",
    title: "OG Tours & Travels",
    subtitle: "Trusted Travel & Tour Management",
    description:
      "Comprehensive travel services covering booking, logistics, guided tours, and international travel experiences.",
    icon: Plane,
    category: "travel",
  },
  {
    id: "og-paikari",
    title: "OG Paikari Market",
    subtitle: "Wholesale & Distribution Network",
    description:
      "A high-efficiency distribution ecosystem connecting suppliers, wholesalers, and retailers with optimized logistics.",
    icon: Truck,
    category: "distribution",
  },
  {
    id: "og-retail-chain",
    title: "OG Retail Chain Shop",
    subtitle: "Nationwide Retail Business System",
    description:
      "A standardized retail network delivering consistent customer experiences across multiple physical store locations.",
    icon: Store,
    category: "retail",
  },
  {
    id: "og-retail-franchise",
    title: "OG Retail Expansion",
    subtitle: "Franchise & Multi-Location Growth",
    description:
      "A scalable retail expansion model enabling franchise operations and multi-branch growth across regions.",
    icon: Building2,
    category: "retail",
  },
  {
    id: "og-hotel",
    title: "OG Hotel & Resort",
    subtitle: "Premium Hospitality Business",
    description:
      "Luxury hospitality services including resorts, hotels, and premium tourism experiences in prime destinations.",
    icon: Hotel,
    category: "hospitality",
  },
];

export default function UtilitiesSection() {
  return (
    <section className="relative py-20">
      {/* background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />

      <div className="content-shell">
        {/* header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/40">
            Ecosystem
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mt-2">
            OG Business Utilities
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            One vision powering multiple sectors across a unified ecosystem.
          </p>
        </div>

        {/* grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {utilitiesData.map((item) => (
            <UtilityCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
function UtilityCard({ item }: { item: UtilityItem }) {
  const Icon = item.icon;

  return (
    <div className="relative group">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-xl" />
      </div>
      {/* 🌈 GRADIENT BORDER (ALWAYS VISIBLE) */}
      <div className="absolute -inset-[1px] rounded-xl">
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent opacity-70" />
      </div>

      {/* CARD */}
      <div
        className={clsx(
          "relative rounded-xl p-5",
          "bg-[rgba(3,7,18,0.7)] backdrop-blur-xl",
          "border border-white/10",
          "hover:scale-[1.01] hover:border-white/20",
          "overflow-hidden transition-all ease-in-out duration-300",
        )}
      >
        {/* 💡 INNER RADIAL GLOW (ALWAYS ON) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),transparent_60%)]" />
        </div>

        {/* ✨ EDGE LIGHT */}
        <div className="pointer-events-none absolute inset-0 rounded-xl">
          <div className="absolute inset-[1px] rounded-xl border border-white/5" />
        </div>

        {/* 🌫 SUBTLE BOTTOM GLOW */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/5 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col h-full">
          {/* TOP */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white/80" />
            </div>

            <span className="text-[10px] uppercase tracking-wider text-cyan-300/70">
              {item.category.replace("_", " ")}
            </span>
          </div>

          {/* TITLE */}
          <div className="mb-2">
            <p className="font-semibold text-white leading-tight">
              {item.title}
            </p>
            <p className="text-xs text-white/50 mt-1">{item.subtitle}</p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-white/40 leading-relaxed mt-2 line-clamp-3">
            {item.description}
          </p>

          <div className="flex-1" />

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-white/60 group-hover:text-white transition">
              Explore
            </span>

            <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center border border-white/10 group-hover:bg-white/[0.1] transition">
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
