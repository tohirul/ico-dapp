"use client";

import { startTransition, useState } from "react";

interface CopyAddressProps {
  value: string;
  label: string;
}

export function CopyAddress({ value, label }: CopyAddressProps) {
  const [copied, setCopied] = useState(false);
  const normalized = value.trim();
  const disabled = normalized.length === 0;

  async function handleCopy() {
    if (disabled) {
      return;
    }

    await navigator.clipboard.writeText(normalized);

    startTransition(() => {
      setCopied(true);
    });

    window.setTimeout(() => {
      startTransition(() => {
        setCopied(false);
      });
    }, 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:bg-accent/10 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>{label}</span>
      <span className="text-white/55">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
