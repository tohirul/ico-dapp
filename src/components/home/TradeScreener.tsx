"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/* ---------------- TYPES ---------------- */

type Asset = {
  id: number;
  name: string;
  fullName: string;
  active: boolean;
  multiplier: number;
};

type ScreenerItem = Asset & {
  price: number;
  change: number;
  volume: number;
};

/* ---------------- MAIN ---------------- */

export function TradeScreener() {
  const [data, setData] = useState<ScreenerItem[]>([]);

  useEffect(() => {
    fetch("https://margex.com/client-payment/api/v1/collateral")
      .then((res) => res.json())
      .then((res) => {
        const enriched = res.data.slice(0, 50).map((item: Asset) => ({
          ...item,
          price: fakePrice(item.multiplier),
          change: fakeChange(),
          volume: fakeVolume(),
        }));

        setData(enriched);
      });
  }, []);

  const loop = [...data, ...data]; // TRUE LOOP

  return (
    <section className="section-shell py-20 overflow-hidden">
      {/* HEADER */}
      <div className="mb-12 px-6">
        <h2 className="text-2xl font-semibold">Market Screener</h2>
        <p className="text-sm text-muted-foreground">
          Live collateral markets overview
        </p>
      </div>

      {/* CAROUSEL */}
      <div className="relative">
        {/* EDGE FADE */}
        <div className="pointer-events-none absolute inset-0 z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />

        <div className="space-y-6">
          <Marquee>
            {loop.map((item, i) => (
              <ScreenerItemCard key={`row1-${i}`} item={item} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */

function Marquee({
  children,
  reverse,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden group py-2",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
      )}
    >
      <div
        className={clsx(
          "flex w-max gap-4 will-change-transform",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */
function ScreenerItemCard({ item }: { item: ScreenerItem }) {
  const isUp = item.change >= 0;

  return (
    <div
      className={clsx(
        "group relative min-w-[280px] px-4 py-3 rounded-xl overflow-hidden",
        "bg-white/[0.025] border border-white/[0.06]",
        "backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.035] hover:-translate-y-[3px]",
        "hover:border-white/20",
        "hover:shadow-[0_0_30px_rgba(0,255,200,0.08)]",
      )}
    >
      {/* 🔥 subtle gradient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 blur-xl" />
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            {item.name}/USDT
          </span>
          <span className="text-[10px] text-muted-foreground">
            {item.fullName}
          </span>
        </div>

        <span
          className={clsx(
            "text-[10px] px-2 py-[2px] rounded-md font-medium",
            "border",
            item.active
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20",
          )}
        >
          {item.active ? "LIVE" : "OFF"}
        </span>
      </div>

      {/* PRICE */}
      <div className="flex items-end justify-between relative z-10">
        <div>
          <div className="text-lg font-semibold tracking-tight">
            ${item.price.toFixed(2)}
          </div>

          {/* CHANGE */}
          <div
            className={clsx(
              "text-xs font-medium mt-[2px]",
              "flex items-center gap-1",
              isUp ? "text-emerald-400" : "text-red-400",
            )}
          >
            <span className="text-[10px]">{isUp ? "▲" : "▼"}</span>
            {Math.abs(item.change).toFixed(2)}%
          </div>
        </div>

        {/* MINI VISUAL BAR (fake momentum indicator) */}
        <div className="w-[40px] h-[20px] flex items-end gap-[2px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={clsx(
                "w-[4px] rounded-sm",
                isUp ? "bg-emerald-400/70" : "bg-red-400/70",
              )}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground relative z-10">
        <span>Vol {formatVolume(item.volume)}</span>

        <span className="opacity-60">x{item.multiplier.toFixed(2)}</span>
      </div>
    </div>
  );
}

/* ---------------- MOCK DATA ---------------- */

function fakePrice(multiplier: number) {
  return Math.random() * (1 / multiplier) * 10;
}

function fakeChange() {
  return (Math.random() - 0.5) * 10;
}

function fakeVolume() {
  return Math.random() * 1_000_000;
}

function formatVolume(v: number) {
  if (v > 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v > 1_000) return (v / 1_000).toFixed(1) + "K";
  return v.toFixed(0);
}
