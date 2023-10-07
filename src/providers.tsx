"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import React from "react";
import { configureChains } from "wagmi";

import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
} from "@wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  // https://wagmi.sh/react/providers/configuring-chains
  const configureChainsConfig = configureChains(
    [goerli],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY! })]
  );

  return (
    <CacheProvider>
      <ChakraProvider>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
            loginMethods: ["wallet"], // "email", "google", "twitter"
            defaultChain: goerli,
            supportedChains: [
              base,
              baseGoerli,
              mainnet,
              goerli,
              polygon,
              polygonMumbai,
            ],
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              showWalletLoginFirst: true,
            },
          }}
        >
          <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
            {children}
          </PrivyWagmiConnector>
        </PrivyProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
