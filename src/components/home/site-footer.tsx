import Link from "next/link";

interface SiteFooterProps {
  tokenName: string;
  explorerUrl: string;
}

export function SiteFooter({ tokenName, explorerUrl }: SiteFooterProps) {
  return (
    <footer className="mt-12 border-t border-white/6 bg-[rgba(3,7,18,0.7)]">
      <div className="content-shell flex flex-col gap-4 py-8 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-white">{tokenName}</p>
          <p className="mt-1">Modernized with Next.js App Router, TypeScript, and Tailwind CSS v4.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <Link href="/dashboard" className="transition hover:text-accent">
            Dashboard
          </Link>
          <Link href="/lightchain-whitepaper.pdf" className="transition hover:text-accent">
            Whitepaper
          </Link>
          <Link href={explorerUrl || "/dashboard"} className="transition hover:text-accent">
            Explorer
          </Link>
        </div>
      </div>
    </footer>
  );
}
