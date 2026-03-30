"use client";

import { useState } from "react";
import clsx from "clsx";

/* ================= TYPES ================= */

type Token = {
  symbol: string;
};

const TOKENS: Token[] = [{ symbol: "BNB" }, { symbol: "USDT" }];

/* ================= MAIN ================= */

export default function SwapSection() {
  const [payToken, setPayToken] = useState<Token>(TOKENS[0]);
  const receiveToken: Token = { symbol: "OGT" };
  const [amount, setAmount] = useState("");

  const rate = payToken.symbol === "BNB" ? 1200 : 1;

  const estimated =
    amount && !isNaN(Number(amount))
      ? (Number(amount) * rate).toFixed(2)
      : "0.00";

  return (
    <section className="section">
      <div className="container-shell grid lg:grid-cols-2 gap-10 items-center">
        {/* ================= LEFT: SWAP ================= */}
        <div className="glass rounded-[var(--radius)] p-6 glow-ring">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Buy / Sell <span className="aurora-text">OGT</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Seamless on-chain token exchange
            </p>
          </div>

          {/* PAY */}
          <SwapInput
            label="You Pay"
            token={payToken}
            tokens={TOKENS}
            amount={amount}
            onAmountChange={setAmount}
            onTokenChange={setPayToken}
          />

          {/* SWITCH */}
          <div className="flex justify-center my-4">
            <button
              type="button"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center transition-smooth hover:scale-105"
            >
              ⇅
            </button>
          </div>

          {/* RECEIVE */}
          <div className="space-y-2">
            <LabelRow left="You Receive" right="Estimated" />

            <div className="glass-card rounded-xl px-4 py-4 flex items-center">
              <TokenPill symbol={receiveToken.symbol} />

              <div className="ml-auto text-lg font-medium tracking-tight">
                {estimated}
              </div>
            </div>
          </div>

          {/* RATE */}
          <div className="flex justify-between text-xs text-muted-foreground mt-4 px-1">
            <span>Rate</span>
            <span>
              1 {payToken.symbol} ≈ {rate} OGT
            </span>
          </div>

          {/* BUTTON */}
          <div className="w-full flex justify-center items-center">
            <button
              type="button"
              className={clsx(
                "mt-6 w-md mx-auto rounded-full py-3 font-medium transition-all duration-300",
                "bg-accent text-black",

                // base state
                "shadow-[0_0_0px_rgba(0,255,180,0)]",

                // hover neon effect
                "hover:shadow-[0_0_12px_rgba(0,255,180,0.6),0_0_24px_rgba(0,255,180,0.4)]",
                "hover:brightness-110 hover:scale-[1.02]",

                // active press feel
                "active:scale-[0.98]",
              )}
            >
              Swap Now
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Slippage and fees may apply
          </p>
        </div>

        {/* ================= RIGHT: CONTENT ================= */}
        <div className="section-stack">
          <div>
            <h3 className="text-3xl font-display leading-tight">
              Instant OGT Liquidity
            </h3>
            <p className="text-muted-foreground mt-3 max-w-md">
              Trade OGT directly from your wallet with fast execution,
              transparent pricing, and zero custodial risk.
            </p>
          </div>

          <div className="divider" />

          {/* FEATURE BLOCKS */}
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
              desc="Real-time pricing with no hidden fees."
            />

            <FeatureCard
              title="Secure"
              desc="Powered by audited smart contracts."
            />
          </div>

          {/* CTA */}
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-muted-foreground">New to OGT?</p>
            <p className="mt-1">
              Read the whitepaper to understand tokenomics and ecosystem
              utility.
            </p>

            <button className="mt-4 text-sm font-medium text-accent">
              View Whitepaper →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= SUB COMPONENTS ================= */

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
  return (
    <div className="space-y-2">
      <LabelRow left={label} right="Balance: --" />

      <div className="glass-card rounded-xl px-4 py-4 flex items-center gap-3 focus-within:ring-1 focus-within:ring-accent/40">
        {/* TOKENS */}
        <div className="flex gap-2">
          {tokens.map((t) => (
            <button
              key={t.symbol}
              type="button"
              onClick={() => onTokenChange(t)}
              className={clsx(
                "px-3 py-1 rounded-lg text-sm transition-smooth",
                token.symbol === t.symbol
                  ? "bg-white/10"
                  : "text-muted-foreground hover:text-white",
              )}
            >
              {t.symbol}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <input
          type="number"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="ml-auto bg-transparent text-right text-lg outline-none placeholder:text-muted-foreground/40 w-full"
        />
      </div>
    </div>
  );
}

type LabelRowProps = {
  left: string;
  right: string;
};

function LabelRow({ left, right }: LabelRowProps) {
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
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--accent)]/5 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}
