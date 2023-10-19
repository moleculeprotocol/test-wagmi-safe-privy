"use client";
import { WagmiConfig, createConfig, Config } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { useEffect, useState } from "react";
import { Chain, foundry, goerli, localhost, mainnet } from "viem/chains";
import { AuthProvider } from "./AuthContext";

// const config = createConfig(
//   getDefaultConfig({
//     infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
//     appName: "Plain wagmi demo",
//   })
// );

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<any & Config>();

  useEffect(() => {
    const config = createConfig(
      getDefaultConfig({
        appName: "IP NFT",
        alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
        infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        autoConnect: true,
        chains: [goerli, mainnet],
      })
    );
    setConfig(config);
  }, []);

  if (!config) {
    return <p>initializing</p>;
  }

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <AuthProvider>{children}</AuthProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
