import clsx from "clsx";
import Link from "next/link";

interface SiteFooterProps {
  tokenName: string;
  explorerUrl: string;
}

export function SiteFooter({ tokenName, explorerUrl }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-white/6 bg-[rgba(3,7,18,0.7)]">
      <div
        className={clsx(
          // responsive container
          "mx-auto w-full px-[clamp(1rem,2.4vw,2rem)]",
          "max-w-[82rem] 2xl:max-w-[96rem] 3xl:max-w-[110rem]",
        )}
      >
        <div className="content-shell py-12">
          {/* 🔷 TOP GRID */}
          <div className="grid gap-10 md:grid-cols-3">
            {/* 🔹 BRAND */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{tokenName}</h3>

              <p className="text-sm text-white/50 leading-relaxed">
                {tokenName} is a blockchain-powered presale platform designed
                for secure token distribution, transparent economics, and
                scalable on-chain participation.
              </p>

              <div className="space-y-2 text-sm text-white/40">
                <p>support@{tokenName.toLowerCase()}.io</p>
                <p>partnerships@{tokenName.toLowerCase()}.io</p>
              </div>
            </div>

            {/* 🔹 QUICK LINKS */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Quick Links
              </h4>

              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="/"
                  className="hover:text-accent transition text-white/50"
                >
                  Home
                </Link>
                <Link
                  href="/earn"
                  className="hover:text-accent transition text-white/50"
                >
                  Earn
                </Link>
                <Link
                  href="#tokenomics"
                  className="hover:text-accent transition text-white/50"
                >
                  Tokenomics
                </Link>
                <Link
                  href="#roadmap"
                  className="hover:text-accent transition text-white/50"
                >
                  Roadmap
                </Link>
                <Link
                  href="/blog"
                  className="hover:text-accent transition text-white/50"
                >
                  Blog
                </Link>
              </div>
            </div>

            {/* 🔹 NEWSLETTER */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Stay Updated
              </h4>

              <p className="text-sm text-white/50">
                Get updates on token stages, listings, and ecosystem growth.
              </p>

              <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <button className="ml-2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-black hover:opacity-90">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* 🔷 DIVIDER */}
          <div className="my-8 h-px bg-white/6" />

          {/* 🔷 BOTTOM BAR */}
          <div className="flex flex-col gap-4 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {tokenName}. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/lightchain-whitepaper.pdf"
                className="hover:text-accent transition"
              >
                Whitepaper
              </Link>
              <Link
                href={explorerUrl || "/"}
                className="hover:text-accent transition"
              >
                Explorer
              </Link>
              <Link href="/privacy" className="hover:text-accent transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent transition">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
