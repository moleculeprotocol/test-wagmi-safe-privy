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

  //you can extend the public client here:
  //const { publicClient } = configureChainsConfig;
  // const myPublicClient = ({ chainId }: { chainId?: number | undefined }) => {
  //   const origClient = publicClient({ chainId });
  //   const fooClient = origClient.extend((client) => ({
  //     getTransaction: async ({ hash }: { hash: `0x${string}` }) => {
  //       console.log(`FOOO get transaction ${hash}`);
  //       return origClient.getTransaction({ hash });
  //     },
  //     waitForTransactionReceipt: async (
  //       params: WaitForTransactionReceiptParameters
  //     ) => {
  //       console.log("WAIT", origClient.account, params);
  //       return origClient.waitForTransactionReceipt(params);
  //     },
  //     // sendRawTransaction: async (args: SendRawTransactionParameters) => {
  //     //   console.log("raw transaction");
  //     //   return origClient.sendRawTransaction(args);
  //     // },
  //   }));
  //   return fooClient;
  //   // createClient({
  //   //   chain: origClient.chain,
  //   //   transport: origClient.transport as unknown as Transport,
  //   // });
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
          <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
            {children}
          </PrivyWagmiConnector>
        </PrivyProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
