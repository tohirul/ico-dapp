"use client";

import { motion } from "framer-motion";

export default function page() {
  return (
    <div className=" relative h-screen flex items-center justify-center overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full top-[-100px] left-[10%]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full bottom-[-100px] right-[10%]" />
      </div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl w-full p-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-center"
      >
        {/* TITLE */}
        <h1 className="text-3xl font-semibold mb-3">NFT Marketplace</h1>

        {/* SUBTEXT */}
        <p className="text-muted-foreground text-sm mb-6">
          A fully integrated NFT experience is on the way. Manage, trade, and
          showcase your digital assets seamlessly.
        </p>

        {/* PREVIEW FEATURES */}
        <div className="space-y-3 text-sm text-left mb-6">
          <Feature text="View & manage owned NFTs" />
          <Feature text="Buy & sell on marketplace" />
          <Feature text="Transfer assets instantly" />
          <Feature text="Real-time price & rarity insights" />
        </div>

        {/* BADGE */}
        <div className="inline-block px-4 py-1 rounded-full text-xs bg-white/10 text-white">
          Coming Soon
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
      {text}
    </div>
  );
}
