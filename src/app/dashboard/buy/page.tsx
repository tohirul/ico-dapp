"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

type PaymentMethod = "usdt" | "binance";

type Package = {
  id: string;
  name: string;
  baseAmount: number;
  price: number;

  bonus?: number;
  discountPercent?: number;

  gifts?: {
    label: string;
    claimAfterDays?: number;
  }[];

  mysteryBox?: {
    enabled: boolean;
    tier: "small" | "medium" | "large";
  };

  popular?: boolean;
};
const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    baseAmount: 100,
    price: 10,
    bonus: 10,
    discountPercent: 5,
    gifts: [
      { label: "5 OGT Airdrop", claimAfterDays: 3 },
      { label: "Exclusive Sticker", claimAfterDays: 7 },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    baseAmount: 500,
    price: 45,
    bonus: 100,
    discountPercent: 15,
    popular: true,
    gifts: [
      { label: "20 OGT Reward", claimAfterDays: 2 },
      { label: "NFT Badge", claimAfterDays: 7 },
    ],
    mysteryBox: { enabled: true, tier: "medium" },
  },
  {
    id: "pro",
    name: "Pro",
    baseAmount: 1500,
    price: 110,
    bonus: 300,
    discountPercent: 25,
    gifts: [
      { label: "50 OGT Bonus", claimAfterDays: 1 },
      { label: "Exclusive NFT", claimAfterDays: 5 },
    ],
    mysteryBox: { enabled: true, tier: "large" },
  },
  {
    id: "whale",
    name: "Whale",
    baseAmount: 5000,
    price: 300,
    bonus: 1500,
    discountPercent: 40,
    gifts: [
      { label: "200 OGT Reward", claimAfterDays: 1 },
      { label: "VIP NFT Pass", claimAfterDays: 3 },
    ],
    mysteryBox: { enabled: true, tier: "large" },
  },
];
export default function BuyPage() {
  const params = useSearchParams();
  const packageId = params.get("packageId");

  const [method, setMethod] = useState<PaymentMethod>("usdt");

  let pkg = packages.find((p) => p.id === packageId);
  if (!pkg) pkg = packages[0];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B0F1A] to-[#06080F] p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold">Buy OGT</h2>
          <p className="text-xs text-muted-foreground">
            Choose your preferred payment method
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-4">
          {["usdt", "binance"].map((type) => (
            <button
              key={type}
              onClick={() => setMethod(type as PaymentMethod)}
              className={clsx(
                "p-4 rounded-xl border text-left transition-all",
                method === type
                  ? "border-green-400 bg-green-400/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  : "border-white/10 hover:border-white/20",
              )}
            >
              <p className="font-medium">
                {type === "usdt" ? "USDT Payment" : "Binance Pay"}
              </p>
              <p className="text-xs text-muted-foreground">
                {type === "usdt"
                  ? "Pay via wallet (On-chain)"
                  : "No gas fees (Off-chain)"}
              </p>
            </button>
          ))}
        </div>

        {/* Neon Divider */}
        <div className="h-[2px] w-full bg-gradient-to-r from-green-400 via-purple-500 to-pink-500 opacity-60" />

        {/* Forms */}
        {method === "usdt" ? <USDTForm pkg={pkg} /> : <BinanceForm pkg={pkg} />}
      </div>
    </div>
  );
}

function USDTForm({ pkg }: { pkg: Package }) {
  const total = pkg.baseAmount + (pkg.bonus || 0);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="space-y-4">
        <div className="glass-card p-5 rounded-xl space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Payment Details</p>

            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/15 text-primary">
              USDT Selected
            </span>
          </div>

          {/* Fields */}
          <div className="space-y-3 text-sm">
            {/* Network */}
            <div>
              <label className="text-xs text-muted-foreground">
                Token / Network
              </label>

              <div className="mt-1 p-2 rounded-md bg-black/40 border border-border flex justify-between">
                <span>BSC / BEP20</span>

                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </div>

              <p className="text-[10px] text-muted-foreground mt-1">
                Make sure to send via BSC network
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs text-muted-foreground">
                Amount to Pay
              </label>

              <div className="mt-1 p-2 rounded-md bg-black/40 border border-border flex justify-between">
                <span>{pkg.price}</span>
                <span className="text-xs text-muted-foreground">USDT</span>
              </div>

              <p className="text-[10px] text-muted-foreground mt-1">
                ≈ ${pkg.price} USD
              </p>
            </div>

            {/* From */}
            <div>
              <label className="text-xs text-muted-foreground">
                From Address
              </label>

              <div className="mt-1 p-2 rounded-md bg-black/40 border border-border flex justify-between items-center">
                <span className="truncate text-xs">0xABC123...def456</span>

                <button className="text-xs text-primary">Copy</button>
              </div>

              <p className="text-[10px] text-muted-foreground mt-1">
                Connected wallet
              </p>
            </div>

            {/* Recipient */}
            <div>
              <label className="text-xs text-muted-foreground">
                Recipient Address
              </label>

              <div className="mt-1 p-2 rounded-md bg-black/40 border border-border flex justify-between items-center">
                <span className="truncate text-xs">0xPLATFORM...xyz</span>

                <button className="text-xs text-primary">Copy</button>
              </div>

              <p className="text-[10px] text-primary">Verified ✓</p>
            </div>

            {/* Slippage + Fee */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">
                  Slippage
                </label>

                <div className="mt-1 p-2 rounded-md bg-black/40 border border-border text-xs">
                  0.5% (Default)
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">
                  Network Fee
                </label>

                <div className="mt-1 p-2 rounded-md bg-black/40 border border-border text-xs">
                  0.0012 USDT
                </div>
              </div>
            </div>

            {/* Referral */}
            <div>
              <label className="text-xs text-muted-foreground">
                Referral Code
              </label>

              <input
                className="mt-1 w-full p-2 rounded-md bg-black/40 border border-border text-xs outline-none focus:border-primary"
                placeholder="Enter referral code..."
              />
            </div>
          </div>

          {/* CTA */}
          <button
            className="mt-4 w-full py-3 rounded-lg 
            bg-gradient-to-r from-primary to-cyan-300 
            text-primary-foreground font-medium 
            shadow-[var(--glow-accent)] transition-smooth hover:opacity-90"
          >
            Preview Purchase →
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">
        <div className="glass-card p-5 rounded-xl">
          {/* Header */}
          <div className="flex justify-between">
            <p className="text-sm font-medium">You Will Receive</p>
            <span className="text-[10px] text-error">● Live Quote</span>
          </div>

          {/* Amount */}
          <p className="text-3xl font-bold text-primary mt-2">{total} OGT</p>

          <p className="text-xs text-muted-foreground">≈ ${pkg.price} USD</p>

          {/* Stats */}
          <div className="mt-4 border-t border-border pt-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Exchange Rate</span>
              <span>1 USDT = X OGT</span>
            </div>

            <div className="flex justify-between">
              <span>Price Impact</span>
              <span className="text-primary">0.35% Low</span>
            </div>

            <div className="flex justify-between">
              <span>Total After Fee</span>
              <span>{total} OGT</span>
            </div>

            <div className="flex justify-between">
              <span>Est. Time</span>
              <span>⚡ 2–3 min</span>
            </div>
          </div>
        </div>

        {/* QR */}
        <div className="glass-card p-4 rounded-xl flex gap-4">
          <div className="w-24 h-24 bg-white/10 rounded flex items-center justify-center text-xs">
            QR
          </div>

          <div className="flex-1 text-xs space-y-1">
            <p>From: 0xABC...6789</p>
            <p>To: 0xPLATFORM...xyz</p>
            <p>Pay: {pkg.price} USDT</p>

            <button className="text-primary">Copy Address</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BinanceForm({ pkg }: { pkg: Package }) {
  const total = pkg.baseAmount + (pkg.bonus || 0);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* LEFT PANEL */}
      <div className="space-y-4">
        {/* PAYMENT CARD */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Binance Pay</p>

            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/15 text-primary">
              Instant
            </span>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center justify-center py-3">
            <div className="w-40 h-40 rounded-lg bg-black/40 border border-border flex items-center justify-center text-xs">
              QR CODE
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Scan with Binance App
            </p>

            <p className="text-[10px] text-muted-foreground mt-1">
              Expires in <span className="text-primary">09:32</span>
            </p>
          </div>

          {/* Payment Info */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{pkg.price} USDT</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="truncate max-w-[140px]">PAY_82HGS72</span>
            </div>

            <button className="text-primary text-xs hover:underline">
              Copy Payment ID
            </button>
          </div>

          {/* Info Banner */}
          <div className="p-2 rounded-md bg-primary/10 text-[11px] text-primary">
            Use Binance Pay → Scan QR → Confirm payment
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="glass-card p-4 rounded-xl text-xs space-y-2">
          <p className="font-medium">How to Pay</p>

          <ul className="space-y-1 text-muted-foreground">
            <li>1. Open Binance App</li>
            <li>2. Navigate to Pay → Scan</li>
            <li>3. Scan the QR code</li>
            <li>4. Confirm transaction</li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-4">
        {/* RECEIVE BLOCK */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">You Will Receive</p>

            <span className="text-[10px] text-error">● Awaiting Payment</span>
          </div>

          <p className="text-3xl font-bold text-primary mt-2">{total} OGT</p>

          <p className="text-xs text-muted-foreground">≈ ${pkg.price} USD</p>

          {/* STATS */}
          <div className="mt-4 border-t border-border pt-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Rate</span>
              <span>1 USDT = X OGT</span>
            </div>

            <div className="flex justify-between">
              <span>Fee</span>
              <span className="text-primary">0 USDT</span>
            </div>

            <div className="flex justify-between">
              <span>Processing</span>
              <span>Instant</span>
            </div>
          </div>
        </div>

        {/* TRANSACTION SUMMARY */}
        <div className="glass-card p-4 rounded-xl flex gap-4">
          {/* QR mini */}
          <div className="w-24 h-24 bg-black/40 border border-border rounded flex items-center justify-center text-xs">
            QR
          </div>

          <div className="flex-1 text-xs space-y-1">
            <p>From: 0xABC...6789</p>
            <p>To: Binance Pay</p>
            <p>Pay: {pkg.price} USDT</p>

            <button className="text-primary">Copy Details</button>
          </div>
        </div>

        {/* STATUS + ACTION */}
        <div className="glass-card p-4 rounded-xl space-y-3">
          <div className="text-xs text-muted-foreground">
            Waiting for payment confirmation...
          </div>

          {/* PRIMARY CTA */}
          <button
            className="w-full py-3 rounded-lg 
            bg-gradient-to-r from-primary to-cyan-300 
            text-primary-foreground font-medium 
            shadow-[var(--glow-accent)] transition-smooth"
          >
            I’ve Paid
          </button>

          {/* SECONDARY */}
          <button className="w-full py-2 rounded-lg bg-white/5 text-xs hover:bg-white/10">
            Cancel Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
