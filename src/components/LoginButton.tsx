"use client";
import { Button, Flex, Text } from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useDisconnect } from "wagmi";

export const LoginButton = () => {
  const { wallet: activeWallet } = usePrivyWagmi();
  const { connectWallet, ready, authenticated, logout } = usePrivy();

  const { disconnect } = useDisconnect();

  //const { wallets } = useWallets();

  if (activeWallet) {
    return (
      <Flex>
        <Text>{activeWallet.address}</Text>
        <Button
          onClick={() => {
            disconnect();
            try {
              logout();
              activeWallet.disconnect();
            } catch (e: any) {
              console.warn("cant disconnect wallet");
            }
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Button onClick={connectWallet} colorScheme="orange">
      Login
    </Button>
  );
};
