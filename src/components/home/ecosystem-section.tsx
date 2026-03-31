"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { partners } from "@/constants/partners";
import clsx from "clsx";

type Partner = {
  name: string;
  logo: string;
  href?: string;
};

export default function EcosystemPartners() {
  // TRUE LOOP
  const loop = [...partners, ...partners];

  return (
    <section className="section-shell py-24 overflow-hidden">
      {/* HEADER */}
      <div className="mb-16">
        <SectionHeading
          eyebrow="Partners"
          title="Trusted Across the Crypto Ecosystem"
          description="Integrated with leading exchanges, protocols, and infrastructure providers."
        />
      </div>

      {/* CAROUSEL */}
      <div className="relative">
        {/* GRADIENT MASK (Cleaner than overlays) */}
        <div className="pointer-events-none absolute inset-0 z-10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]" />

        <div className="space-y-8">
          <Marquee>
            {loop.map((p, i) => (
              <LogoItem key={`row1-${i}`} {...p} />
            ))}
          </Marquee>

          <Marquee reverse>
            {loop.map((p, i) => (
              <LogoItem key={`row2-${i}`} {...p} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
function Marquee({
  children,
  reverse,
  className,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden group py-4",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
      )}
    >
      <div
        className={clsx(
          "flex w-max gap-10 will-change-transform",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          "group-hover:[animation-play-state:paused]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function LogoItem({
  name,
  logo,
  href,
  priority,
}: Partner & { priority?: boolean }) {
  const content = (
    <div
      className={clsx(
        "group/logo relative flex items-center justify-center",
        "w-[56px] h-[56px] rounded-xl",
        "bg-accent/20 border border-white/[0.06]",
        "backdrop-blur-md",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.08] hover:-translate-y-[2px]",
        "hover:bg-white/[0.05]",
        "hover:border-white/20",
        "hover:shadow-[0_0_24px_rgba(0,255,200,0.15)]",
      )}
    >
      <div className="relative w-[28px] h-[28px] opacity-80 group-hover/logo:opacity-100 transition">
        <Image
          src={logo}
          alt={name}
          fill
          sizes="28px"
          className="object-contain"
          loading={priority ? "eager" : "lazy"}
          quality={80}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${name}`}
      >
        {content}
      </a>
    );
  }

  return content;
}
