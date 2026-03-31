"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/shared/container";

const faqs = [
  {
    q: "How does staking work?",
    a: "You lock your tokens into a pool to earn rewards over time. Rewards vary based on pool APR and duration.",
  },
  {
    q: "How long does withdrawal take?",
    a: "Unstaking typically takes 24–72 hours depending on network conditions.",
  },
  {
    q: "Are there any fees?",
    a: "Yes, network gas fees apply. Platform fees depend on the transaction type.",
  },
  {
    q: "Can I track my rewards?",
    a: "Yes, all rewards are visible in your Rewards History and Portfolio sections.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Container className="py-12 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Support Center</h1>
        <p className="text-sm text-muted-foreground">
          Find answers, contact support, or explore documentation.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ SECTION */}
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/10">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">FAQs</h2>

            <div className="space-y-3">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-white/[0.03]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`transition-transform ${
                        openIndex === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-sm text-muted-foreground"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CONTACT FORM */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Contact Support</h2>

            <form className="space-y-3">
              <Input placeholder="Your Email" />
              <Textarea placeholder="Describe your issue..." />

              <Button className="w-full">Submit Ticket</Button>
            </form>

            <div className="text-xs text-muted-foreground">
              Avg response time: 12–24 hours
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DOCUMENTATION LINKS */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Documentation & Guides</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Getting Started", "Staking Guide", "Security Tips"].map(
              (doc, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-white/10 hover:bg-white/[0.03] cursor-pointer"
                >
                  <div className="font-medium">{doc}</div>
                  <div className="text-xs text-muted-foreground">
                    Learn more →
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
