"use client";
import { WagmiConfig, createConfig, Config } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { useEffect, useState } from "react";
import { Chain, foundry, goerli, localhost, mainnet } from "viem/chains";
import { AuthProvider } from "../context/AuthContext";
import { LitProvider } from "@/context/LitContext";
//import { AuthProvider } from "./AuthContext";

// const config = createConfig(
//   getDefaultConfig({
//     infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
//     appName: "Plain wagmi demo",
//   })
// );
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
