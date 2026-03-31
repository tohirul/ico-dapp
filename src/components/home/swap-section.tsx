"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import { Button } from "../library/button";
import Link from "next/link";

/* ================= CONFIG ================= */

type Token = {
  symbol: string;
};

const TOKENS: Token[] = [{ symbol: "BNB" }, { symbol: "USDT" }];

const RECEIVE_TOKEN: Token = { symbol: "OGT" };

const RATE = 5; // 1 token = 5 OGT
const GAS_FEE = 0.002; // generic fee

/* ================= MAIN ================= */

export default function SwapSection() {
  const [payToken, setPayToken] = useState<Token>(TOKENS[0]);
  const [amount, setAmount] = useState("");

  const numericAmount = useMemo(() => Number(amount), [amount]);

  const estimated = useMemo(() => {
    if (!numericAmount || isNaN(numericAmount)) return "0.00";

    const gross = numericAmount * RATE;
    const net = Math.max(gross - GAS_FEE, 0);

    return net.toFixed(2);
  }, [numericAmount]);

  return (
    <section
      id="earn"
      className="section h-screen flex items-center justify-center"
    >
      <div className="container-shell grid lg:grid-cols-2 gap-12 items-center">
        {/* ================= LEFT ================= */}
        <SwapCard
          payToken={payToken}
          onTokenChange={setPayToken}
          amount={amount}
          onAmountChange={setAmount}
          estimated={estimated}
        />

        {/* ================= RIGHT ================= */}
        <SwapInfo />
      </div>
    </section>
  );
}

/* ================= SWAP CARD ================= */

type SwapCardProps = {
  payToken: Token;
  onTokenChange: (t: Token) => void;
  amount: string;
  onAmountChange: (v: string) => void;
  estimated: string;
};

function SwapCard({
  payToken,
  onTokenChange,
  amount,
  onAmountChange,
  estimated,
}: SwapCardProps) {
  return (
    <div className="glass rounded-[var(--radius)] p-6 glow-ring">
      <Header />

      <SwapInput
        label="You Pay"
        token={payToken}
        tokens={TOKENS}
        amount={amount}
        onAmountChange={onAmountChange}
        onTokenChange={onTokenChange}
      />

      <ReceiveBlock estimated={estimated} />

      <PricingInfo payToken={payToken} />

      <Action />

      <FooterNote />
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function Header() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">
        Buy / Sell <span className="aurora-text">OGT</span>
      </h2>
      <p className="text-muted-foreground text-sm mt-1">
        Seamless on-chain token exchange
      </p>
    </div>
  );
}

/* ---------- INPUT ---------- */

type SwapInputProps = {
  label: string;
  token: Token;
  tokens: Token[];
  amount: string;
  onAmountChange: (v: string) => void;
  onTokenChange: (t: Token) => void;
};
function SwapInput({
  label,
  token,
  tokens,
  amount,
  onAmountChange,
  onTokenChange,
}: SwapInputProps) {
  const handleChange = (value: string) => {
    // Allow only valid decimal numbers
    if (/^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="space-y-2">
      {/* HEADER */}
      <div className="flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground px-1">
        <span>{label}</span>

        <button
          type="button"
          className="hover:text-white transition"
          onClick={() => onAmountChange("100")} // mock max
        >
          Balance: -- <span className="ml-1 text-accent">MAX</span>
        </button>
      </div>

      {/* INPUT CONTAINER */}
      <div className="glass-card rounded-xl px-4 py-3 flex flex-col gap-3 focus-within:ring-1 focus-within:ring-accent/40 transition">
        {/* TOP: TOKEN SELECT */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {tokens.map((t) => (
              <button
                key={t.symbol}
                onClick={() => onTokenChange(t)}
                className={clsx(
                  "px-3 py-1 rounded-lg text-xs font-medium transition",
                  token.symbol === t.symbol
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                {t.symbol}
              </button>
            ))}
          </div>

          {/* PRICE (optional placeholder) */}
          <span className="text-xs text-muted-foreground">≈ $0.00</span>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-white/5" />

        {/* INPUT ROW */}
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => handleChange(e.target.value)}
            className="
              w-full
              bg-transparent
              text-2xl font-semibold
              outline-none
              placeholder:text-muted-foreground/30
              tracking-tight
            "
          />

          {/* QUICK ACTIONS */}
          <div className="flex gap-2 ml-2">
            <QuickBtn label="25" onClick={() => onAmountChange("25")} />
            <QuickBtn label="50" onClick={() => onAmountChange("50")} />
            <QuickBtn label="75" onClick={() => onAmountChange("75")} />
            <QuickBtn label="100" onClick={() => onAmountChange("100")} />
            <QuickBtn label="MAX" onClick={() => onAmountChange("500")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        px-2 py-1 text-[10px]
        rounded-md
        bg-white/5
        hover:bg-white/10
        text-muted-foreground
        hover:text-white
        transition
      "
    >
      {label}
    </button>
  );
}

/* ---------- RECEIVE ---------- */

function ReceiveBlock({ estimated }: { estimated: string }) {
  return (
    <div className="space-y-2 mt-4">
      <LabelRow left="You Receive" right="Estimated" />

      <div className="glass-card rounded-xl px-4 py-4 flex items-center">
        <TokenPill symbol={RECEIVE_TOKEN.symbol} />

        <div className="ml-auto text-lg font-medium tracking-tight">
          {estimated}
        </div>
      </div>
    </div>
  );
}

/* ---------- PRICING ---------- */

function PricingInfo({ payToken }: { payToken: Token }) {
  return (
    <div className="mt-4 px-1 text-xs text-muted-foreground space-y-1">
      <div className="flex justify-between">
        <span>Rate</span>
        <span>
          1 {payToken.symbol} = {RATE} OGT
        </span>
      </div>

      <div className="flex justify-between">
        <span>Network Fee</span>
        <span>
          ~ {GAS_FEE} {payToken.symbol}
        </span>
      </div>
    </div>
  );
}

/* ---------- ACTION ---------- */

function Action() {
  return (
    <Link href="/dashboard/swap" className="w-full">
      <div className="w-full pt-6 flex justify-center">
        <Button
          variant="neon"
          magnetic={false}
          size="lg"
          radius="full"
          className="w-lg mx-auto"
        >
          Buy Now
        </Button>
      </div>
    </Link>
  );
}

/* ---------- FOOTER ---------- */

function FooterNote() {
  return (
    <p className="text-center text-xs text-muted-foreground mt-4">
      Includes estimated network (gas) fees. Final amount may vary slightly.
    </p>
  );
}

/* ---------- SHARED ---------- */

function LabelRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground px-1">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function TokenPill({ symbol }: { symbol: string }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-white/10 text-sm">{symbol}</div>
  );
}

/* ================= RIGHT SIDE ================= */

function SwapInfo() {
  return (
    <div className="section-stack">
      <div>
        <h3 className="text-3xl font-display leading-tight">
          Instant OGT Liquidity
        </h3>
        <p className="text-muted-foreground mt-3 max-w-md">
          Trade OGT directly from your wallet with fast execution, transparent
          pricing, and zero custodial risk.
        </p>
      </div>

      <div className="divider" />

      <div className="grid gap-2 sm:grid-cols-2">
        <FeatureCard
          title="Non-Custodial"
          desc="Your assets stay in your wallet at all times."
        />
        <FeatureCard
          title="Fast Execution"
          desc="Optimized routing for minimal slippage."
        />
        <FeatureCard
          title="Transparent Rates"
          desc="Clear pricing with predictable fees."
        />
        <FeatureCard
          title="Secure"
          desc="Powered by audited smart contracts."
        />
      </div>

      <div className="glass-card rounded-xl p-5">
        <p className="text-sm text-muted-foreground">New to OGT?</p>
        <p className="mt-1">
          Read the whitepaper to understand tokenomics and ecosystem utility.
        </p>

        <button className="mt-4 text-sm font-medium text-accent">
          View Whitepaper →
        </button>
      </div>
    </div>
  );
}

/* ---------- FEATURE CARD ---------- */

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative glass-card rounded-xl p-4 overflow-hidden">
      {/* 🌈 PRIMARY BACKLIGHT */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_20%_10%,var(--accent),transparent_45%),
                radial-gradient(circle_at_80%_90%,var(--secondary),transparent_55%)]
          "
        />
      </div>

      {/* 💡 SECONDARY SOFT GLOW (center fill) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_70%)]" />
      </div>

      {/* ✨ EDGE LIGHT (glass depth) */}
      <div className="pointer-events-none absolute inset-0 rounded-xl">
        <div className="absolute inset-[1px] rounded-xl border border-white/5" />
      </div>

      {/* 🌫 BOTTOM AMBIENT GLOW */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[var(--accent)]/5 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}
