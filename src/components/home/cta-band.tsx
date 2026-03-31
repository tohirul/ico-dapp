import Link from "next/link";
import { Button } from "../library/button";

export function CtaBand() {
  return (
    <section className="section-shell-tight pt-8">
      <div className="glass-panel relative overflow-hidden rounded-[36px] px-6 py-11 text-white sm:px-8 lg:px-10 lg:py-14">
        {/* === Simple Background Blobs (Original Style) === */}
        <div className="absolute -left-12 top-10 h-48 w-48 rounded-full bg-secondary/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-accent/12 blur-3xl" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          {/* LEFT CONTENT */}
          <div className="max-w-[40rem] space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Next Step
            </p>

            <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-white sm:text-4xl">
              Ready to activate presale infrastructure?
            </h2>

            <p className="max-w-[34rem] text-sm leading-7 text-white/66 sm:text-base">
              The interface is production-ready. What remains is integrating
              contract reads, wallet interactions, and executing launch
              operations on a stable, extensible foundation.
            </p>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* PRIMARY CTA */}
            <Button>
              <Link href="/presale" className="flex items-center gap-2">
                View Presale Dashboard
                <span className="text-lg leading-none">→</span>
              </Link>
            </Button>

            {/* SECONDARY CTA */}
            <Button variant="outline">
              <Link href="/docs" className="flex items-center gap-2">
                Read Documentation
                <span className="text-lg leading-none">→</span>
              </Link>
            </Button>

            {/* OPTIONAL */}
            <Button variant="ghost">
              <Link href="/contact" className="flex items-center gap-2">
                Contact Us
                <span className="text-lg leading-none">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
