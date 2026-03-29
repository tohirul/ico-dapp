import Image from "next/image";

import type { LogoItem } from "@/lib/site-config";

interface BrandStripProps {
  logos: LogoItem[];
}

export function BrandStrip({ logos }: BrandStripProps) {
  return (
    <section className="section-shell-tight">
      <div className="content-shell">
        <div className="mb-5 flex items-center gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
            Ecosystem surface
          </p>
          <div className="section-divider flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex min-h-20 items-center justify-center rounded-[20px] border border-white/7 bg-white/[0.03] px-4 py-4"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={110}
                height={44}
                className="h-7 w-auto object-contain opacity-65 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
