"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useDisconnect,
  useEnsName,
  useConnect,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

import { User, Mail, Shield, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/library/button";

// ----------------------
// Wagmi Config (v2 Correct)
// ----------------------

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
});

// ----------------------
// Zustand Store (Persisted)
// ----------------------

type SettingsState = {
  name: string;
  email: string;
  setProfile: (name: string, email: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      setProfile: (name, email) => set({ name, email }),
    }),
    { name: "settings-store" },
  ),
);

// ----------------------
// Mock API
// ----------------------

async function updateProfileAPI() {
  await new Promise((r) => setTimeout(r, 800));
  return { success: true };
}

// ----------------------
// UI Components
// ----------------------

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-4"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </motion.div>
  );
}

function Input({
  icon,
  ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08]">
      {icon}
      <input
        {...props}
        className="bg-transparent outline-none w-full text-sm"
      />
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="p-1 hover:bg-white/10 rounded"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

// ----------------------
// Main Settings Content
// ----------------------

function SettingsContent() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  const { data: ens } = useEnsName({ address });

  const { name, email, setProfile } = useSettingsStore();

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfileAPI();
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
    setLoading(false);
  };

  const handleConnect = () => {
    if (!connectors.length) return;
    connect({ connector: connectors[0] });
  };

  return (
    <div className="p-6 space-y-8">
      <Toaster richColors position="top-right" />

      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground/70">
          Manage your account and Web3 preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          <Card title="Profile">
            <Input
              icon={<User size={16} />}
              placeholder="Full name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProfile(e.target.value, email)
              }
            />

            <Input
              icon={<Mail size={16} />}
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProfile(name, e.target.value)
              }
            />

            <Button
              onClick={handleSave}
              disabled={loading}
              variant="neon"
              radius="full"
              size="full"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Card>

          <Card title="Security">
            <div className="flex items-center gap-3">
              <Shield className="text-green-400" />
              <div>
                <p className="text-sm font-medium">Security Level: High</p>
                <p className="text-xs text-muted-foreground">
                  Wallet Auth Active
                </p>
              </div>
            </div>

            <button className="w-full py-2 bg-white/10 rounded-lg">
              Manage Security
            </button>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Card title="Wallet">
            {isConnected ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {ens || "Connected Wallet"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                  <CopyButton value={address!} />
                </div>

                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  className="flex items-center gap-2 text-xs text-blue-400"
                >
                  View on Explorer <ExternalLink size={12} />
                </a>

                <button
                  onClick={() => disconnect()}
                  className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg"
              >
                Connect Wallet
              </button>
            )}
          </Card>

          <Card title="Danger Zone">
            <button
              onClick={() => toast.error("Not implemented")}
              className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg"
            >
              Delete Account
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ----------------------
// Root Wrapper (IMPORTANT)
// ----------------------
const queryClient = new QueryClient();
export default function SettingsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <SettingsContent />
      </WagmiProvider>
    </QueryClientProvider>
  );
}
