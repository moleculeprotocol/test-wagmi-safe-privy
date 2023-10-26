"use client";
import { LitProvider } from "@/context/LitContext";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { goerli, mainnet } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";
import { AuthProvider } from "../context/AuthContext";

const _config = createConfig(
  getDefaultConfig({
    appName: "IP NFT",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    autoConnect: true,
    chains: [goerli, mainnet],
  })
);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={_config}>
      <ConnectKitProvider>
        <AuthProvider>
          <LitProvider>{children}</LitProvider>
        </AuthProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
