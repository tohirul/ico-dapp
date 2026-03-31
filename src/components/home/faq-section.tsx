"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import type { FaqItem } from "@/lib/site-config";
import Container from "../shared/container";

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section id="faq" className="section-shell">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Important context, answered plainly."
            description="The audit exposed a lot of ambiguity in the old repo. These answers clarify the current state and what comes next."
          />

          <div className="space-y-5 lg:pt-8">
            {items.map((item, i) => {
              const isOpen = activeIndex === i;

              return (
                <motion.div
                  layout
                  key={item.question}
                  animate={{
                    paddingTop: isOpen ? 28 : 20,
                    paddingBottom: isOpen ? 28 : 20,
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="group relative rounded-[26px] border border-white/10 bg-white/[0.03] px-6 sm:px-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {/* Glow */}
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-[26px] transition duration-500 ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-accent/10 via-transparent to-secondary/10 blur-xl" />
                  </div>

                  {/* HEADER */}
                  <button
                    onClick={() => toggle(i)}
                    className="relative z-10 flex w-full items-start justify-between gap-6 text-left"
                  >
                    <span className="text-base sm:text-lg font-semibold leading-snug text-white">
                      {item.question}
                    </span>

                    {/* ICON */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 bg-accent/10 border-accent/30 text-accent"
                          : "border-white/15 text-accent"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* CONTENT */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.4, ease: "easeInOut" },
                          opacity: { duration: 0.25 },
                        }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -8 }}
                          animate={{ y: 0 }}
                          exit={{ y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="mt-4 text-sm sm:text-[15px] leading-relaxed text-white/65 max-w-[90%]"
                        >
                          {item.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
