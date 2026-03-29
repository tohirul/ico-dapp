import Link from "next/link";

interface CtaBandProps {
  primaryHref: string;
  secondaryHref: string;
}

export function CtaBand({ primaryHref, secondaryHref }: CtaBandProps) {
  return (
    <section className="section-shell-tight pt-8 lg:pt-12">
      <div className="glass-panel relative overflow-hidden rounded-[36px] px-6 py-11 text-white sm:px-8 lg:px-10 lg:py-14">
        <div className="absolute -left-12 top-10 h-48 w-48 rounded-full bg-secondary/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-accent/12 blur-3xl" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-[40rem] space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Next step
            </p>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-white sm:text-4xl">
              Finish the provider wiring and this foundation is ready for real presale actions.
            </h2>
            <p className="max-w-[34rem] text-sm leading-7 text-white/66 sm:text-base">
              The UI is no longer the blocker. What comes next is contract reads, wallet writes,
              and launch operations on top of a codebase that is finally safe to extend.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#DEF9FA_0%,#5CE1E6_36%,#33BBCF_72%,#1AE5BE_100%)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Review dashboard
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/4 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              Open whitepaper
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
