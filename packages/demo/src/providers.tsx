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

  // const { publicClient } = configureChainsConfig;
  // const myPublicClient = ({ chainId }: { chainId?: number | undefined }) => {
  //   const origClient = publicClient({ chainId });
  //   const fooClient = origClient.extend((client) => ({
  //     getTransaction: async ({ hash }: { hash: `0x${string}` }) => {
  //       console.log(`FOOO get transaction ${hash}`);
  //       return origClient.getTransaction({ hash });
  //     },
  //     waitForTransactionReceipt: async (
  //       params: WaitForTransactionReceiptParameters & {
  //         address?: Address;
  //       }
  //     ) => {
  //       console.log("WAIT", origClient.account, params);
  //       return origClient.waitForTransactionReceipt(params);
  //     },
  //   }));
  //   // return createClient({
  //   //   chain: origClient.chain,
  //   //   transport: origClient.transport as unknown as Transport,
  //   // });
  //   return fooClient;
  // };

  return (
    <CacheProvider>
      <ChakraProvider>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
            loginMethods: ["wallet", "google", "email"], // "email", "google", "twitter"
            defaultChain: goerli,
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
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
          <PrivyWagmiConnector
            wagmiChainsConfig={{
              ...configureChainsConfig,
              //publicClient: myPublicClient,
            }}
          >
            {children}
          </PrivyWagmiConnector>
        </PrivyProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
