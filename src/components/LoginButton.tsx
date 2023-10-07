"use client";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useDisconnect } from "wagmi";

export const LoginButton = () => {
  const { wallet } = usePrivyWagmi();
  const { connectWallet, ready, authenticated } = usePrivy();
  const { logout } = useLogout();
  const { disconnect } = useDisconnect();

  //const { wallets } = useWallets();

  if (wallet) {
    return (
      <Flex>
        <Text>{wallet.address}</Text>
        <Button
          onClick={() => {
            logout();
            disconnect();
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
