"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/library/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ================= CONFIG ================= */

const DEMO_USERS = [
  { email: "alice@ogt.com", password: "123456", name: "Alice", role: "user" },
  { email: "bob@ogt.com", password: "123456", name: "Bob", role: "user" },
  {
    email: "charlie@ogt.com",
    password: "123456",
    name: "Charlie",
    role: "user",
  },
  { email: "jhonnt@ogt.com", password: "123456", name: "jhonny", role: "user" },
];

/* ================= PAGE ================= */

export default function SignInPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientGlow />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="grid lg:grid-cols-[1.1fr_0.9fr] min-h-screen"
      >
        <LeftPanel />
        <RightPanel />
      </motion.div>
    </div>
  );
}

/* ================= LEFT ================= */

function LeftPanel() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="hidden lg:flex flex-col justify-between section border-r border-border"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="container-shell section-stack"
        >
          {/* 🔥 BACK BUTTON */}
          <MotionItem>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
          </MotionItem>

          {/* HEADER */}
          <MotionItem>
            <h1 className="font-display text-5xl leading-tight">
              <span className="aurora-text">Earn yield.</span>
              <br />
              Own liquidity.
              <br />
              Control your layer.
            </h1>
          </MotionItem>

          <MotionItem>
            <p className="text-muted-foreground max-w-lg">
              Unified DeFi infrastructure for staking, presale access, and
              sustainable yield mechanics.
            </p>
          </MotionItem>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Staking Engine", "Auto yield generation"],
              ["Presale Access", "Early allocations"],
              ["Burn Model", "Deflationary token"],
              ["DAO Governance", "Community control"],
            ].map(([title, desc], i) => (
              <MotionItem key={i}>
                <FeatureCard title={title} desc={desc} />
              </MotionItem>
            ))}
          </div>
        </motion.div>
        <div className="container-shell flex mt-12 gap-8 text-sm text-muted-foreground">
          <Stat label="TVL" value="$2.4M+" />
          <Stat label="Users" value="18K+" />
          <Stat label="APY" value="Up to 32%" />
        </div>
      </motion.div>
    </div>
  );
}
/* ================= RIGHT ================= */

function RightPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function fill(user: (typeof DEMO_USERS)[0]) {
    setEmail(user.email);
    setPassword(user.password);
  }

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const loggedUser = await login(email, password);
    if (loggedUser) {
      // successful login – redirect based on role
      if (loggedUser.role === "admin") {
        // admin gets sent to /admin
        router.replace("/admin");
      } else {
        // regular user goes to /users (or /dashboard)
        router.replace("/dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="flex items-center justify-center section-tight"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute -inset-1 glow-ring rounded-2xl" />

        <div className="glass-card rounded-2xl p-8 relative">
          <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>

          <p className="text-sm text-muted-foreground mb-6">
            Sign in to access your dashboard
          </p>

          {/* DEMO USERS */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {DEMO_USERS.map((u) => (
              <button
                key={u.email}
                onClick={() => fill(u)}
                className="text-sm px-3 py-2 rounded-lg border border-border bg-muted hover:bg-white/5 transition-smooth"
              >
                {u.name}
              </button>
            ))}

            <button
              onClick={() => {
                setEmail("admin@ogt.com");
                setPassword("admin");
              }}
              className="col-span-2 text-sm px-3 py-2 rounded-lg border border-accent/40 text-accent hover:bg-accent/10 transition-smooth"
            >
              Admin Login
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={email} onChange={setEmail} placeholder="Email" />

            <Input
              value={password}
              onChange={setPassword}
              placeholder="Password"
              type="password"
            />
            <div className="w-full flex justify-center items-center">
              <Button
                variant="neon"
                size="lg"
                radius="lg"
                className="mx-auto w-sm"
              >
                Sign In
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don’t have an account? Create one
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================= AMBIENT ================= */

function AmbientGlow() {
  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ================= UI ================= */

function MotionItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="relative group rounded-xl overflow-hidden"
    >
      {/* glow layer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/20 via-secondary/10 to-transparent blur-xl" />
      </div>

      {/* card */}
      <div className="relative glass-card rounded-xl px-4 py-4 border border-border/60">
        <p className="text-sm font-medium text-foreground">{title}</p>

        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative group">
      {/* subtle glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth">
        <div className="absolute inset-0 bg-accent/5 blur-lg" />
      </div>

      <div className="relative flex flex-col">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          {value}
        </p>

        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full px-4 py-3 rounded-lg 
        bg-muted border border-border
        focus:outline-none focus:ring-1 focus:ring-ring
        transition-smooth
      "
    />
  );
}
