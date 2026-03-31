"use client";

import { motion } from "framer-motion";

import Image from "next/image";
import Container from "../shared/container";
import { CtaBand } from "./cta-band";

// ================= DATA (RICH) =================

const categories = ["All", "Tokenomics", "Guides", "Design", "Updates"];

const posts = [
  {
    id: 1,
    title: "OGT Token Flywheel Explained",
    excerpt:
      "A deep dive into buybacks, burns, and how value compounds across the ecosystem.",
    image: "/blog/1.jpg",
    category: "Tokenomics",
    readTime: "8 min",
    author: "OGT Labs",
    date: "Mar 2026",
    views: "12.4k",
    featured: true,
  },
  {
    id: 2,
    title: "Staking Strategy Alpha",
    excerpt: "Advanced staking strategies to maximize long-term yield.",
    image: "/blog/2.jpg",
    category: "Guides",
    readTime: "6 min",
    author: "Core Team",
    date: "Feb 2026",
    views: "8.1k",
  },
  {
    id: 3,
    title: "UX in Web3",
    excerpt: "Designing frictionless decentralized interfaces.",
    image: "/blog/3.jpg",
    category: "Design",
    readTime: "5 min",
    author: "Design Lead",
    date: "Jan 2026",
    views: "6.9k",
  },
  {
    id: 4,
    title: "OGT Roadmap Breakdown",
    excerpt: "Everything coming next in the ecosystem.",
    image: "/blog/4.jpg",
    category: "Updates",
    readTime: "4 min",
    author: "OGT Labs",
    date: "Mar 2026",
    views: "9.3k",
  },
];

// ================= MAIN =================

export default function BlogSection() {
  return (
    <section className="py-10" id="blog">
      <Container>
        <div>
          <Header />
          <FeaturedHero />
          {/*  <Trending /> */}
          {/* <EditorialGrid /> */}
          {/*  <Newsletter /> */}
          <CtaBand />
        </div>
      </Container>
    </section>
  );
}

// ================= HEADER + FILTER =================

function Header() {
  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold mb-3">Insights & Research</h2>
          <p className="text-white/60 max-w-xl">
            Tokenomics, product evolution, and deep Web3 insights.
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 hover:border-accent/40 transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= FEATURED HERO =================

function FeaturedHero() {
  const post = posts.find((p) => p.featured)!;

  return (
    <motion.div
      className="mb-20 relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      {/* BG IMAGE */}
      <div className="absolute inset-0">
        <Image
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-40"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CONTENT */}
      <div className="relative p-10 md:p-16 max-w-2xl">
        <span className="text-accent text-sm">Featured • {post.category}</span>

        <h3 className="text-3xl md:text-4xl font-semibold mt-3 mb-4">
          {post.title}
        </h3>

        <p className="text-white/70 mb-6">{post.excerpt}</p>

        <div className="flex items-center gap-6 text-sm text-white/50 mb-6">
          <span>{post.author}</span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
          <span>{post.views} views</span>
        </div>

        <button className="px-6 py-3 rounded-full bg-accent text-black font-medium hover:opacity-90 transition">
          Read Full Article →
        </button>
      </div>
    </motion.div>
  );
}

// // ================= TRENDING STRIP =================

// function Trending() {
//   return (
//     <div className="mb-20">
//       <h4 className="text-lg font-semibold mb-6">Trending</h4>

//       <div className="flex gap-6 overflow-x-auto pb-2">
//         {posts.map((post) => (
//           <div
//             key={post.id}
//             className="min-w-[260px] glass-card p-4 rounded-xl border border-white/10"
//           >
//             <p className="text-xs text-accent mb-2">{post.category}</p>

//             <h5 className="font-medium mb-2">{post.title}</h5>

//             <p className="text-xs text-white/40">{post.views} views</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ================= EDITORIAL GRID =================

// function EditorialGrid() {
//   return (
//     <div className="grid md:grid-cols-3 gap-8">
//       {posts.map((post, i) => (
//         <motion.div
//           key={post.id}
//           whileHover={{ y: -6 }}
//           className={clsx(
//             "group relative",
//             i === 0 && "md:col-span-2 md:row-span-2",
//           )}
//         >
//           {/* Glow */}
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
//             <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-xl" />
//           </div>

//           <div className="glass-card rounded-xl overflow-hidden border border-white/10 h-full">
//             <img src={post.image} className="w-full h-48 object-cover" />

//             <div className="p-5">
//               <div className="flex justify-between text-xs mb-2">
//                 <span className="text-accent">{post.category}</span>
//                 <span className="text-white/40">{post.readTime}</span>
//               </div>

//               <h4 className="font-semibold mb-2">{post.title}</h4>

//               <p className="text-sm text-white/60 mb-3">{post.excerpt}</p>

//               <div className="text-xs text-white/40 flex justify-between">
//                 <span>{post.author}</span>
//                 <span>{post.views}</span>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

// // ================= NEWSLETTER =================

// function Newsletter() {
//   return (
//     <div className="mt-28">
//       <div className="relative glass-card p-12 rounded-2xl border border-white/10 text-center overflow-hidden">
//         {/* animated glow */}
//         <div className="absolute inset-0 opacity-30">
//           <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
//         </div>

//         <h3 className="text-2xl font-semibold mb-4">
//           Get Alpha Before Everyone Else
//         </h3>

//         <p className="text-white/60 mb-8 max-w-lg mx-auto">
//           Weekly insights on tokenomics, strategy, and ecosystem updates.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
//           <input
//             placeholder="Enter your email"
//             className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-1 focus:ring-accent/40"
//           />

//           <button className="px-6 py-3 rounded-lg bg-accent text-black font-medium">
//             Subscribe
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
