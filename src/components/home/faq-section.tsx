import { SectionHeading } from "@/components/shared/section-heading";
import type { FaqItem } from "@/lib/site-config";

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <section id="faq" className="section-shell">
      <div className="grid gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-start lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Important context, answered plainly."
          description="The audit exposed a lot of ambiguity in the old repo. These answers make the current state and next steps explicit for anyone picking the project up."
        />

        <div className="space-y-4 lg:pt-10">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-[24px] border border-white/8 bg-white/[0.02] p-6 transition hover:border-white/12 sm:p-7"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-white">
                <span>{item.question}</span>
                <span className="text-2xl leading-none text-accent transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="section-divider mt-4" />
              <p className="mt-4 text-sm leading-7 text-white/64">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
