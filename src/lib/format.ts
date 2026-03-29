const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return compactFormatter.format(value);
}

export function formatUsd(value: number): string {
  const minimumFractionDigits = value >= 1 ? 2 : 4;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value * 100)}%`;
}

export function shortenAddress(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 14) {
    return normalized || "Not configured";
  }

  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}
