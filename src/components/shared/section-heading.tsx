interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-[35rem] space-y-5">
      <p className="eyebrow-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_18px_rgba(0,217,245,0.95)]" />
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl md:text-[3.25rem]">
        {title}
      </h2>
      <p className="max-w-[31rem] text-base leading-8 text-white/68 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
