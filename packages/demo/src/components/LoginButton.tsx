"use client";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useCallback } from "react";
import { Address, useDisconnect } from "wagmi";

export const LoginButton = () => {
  const { wallet: activeWallet, ready, setActiveWallet } = usePrivyWagmi();
  const { connectWallet, authenticated, logout, login } = usePrivy();
  const isContractWallet = useIsContractWallet(
    activeWallet?.address as Address | undefined
  );

  const { disconnect } = useDisconnect();

  const { wallets } = useWallets();

  const unlink = useCallback(() => {
    disconnect();
    try {
      logout();
      if (activeWallet) activeWallet.disconnect();
    } catch (e: any) {
      console.warn("cant disconnect wallet");
    }
  }, [activeWallet, disconnect, logout]);

  if (wallets && wallets.length > 0) {
    return (
      <Flex>
        <VStack>
          {wallets.map((wallet) => (
            <Flex key={wallet.address}>
              {wallet.address === activeWallet?.address ? (
                <Text onClick={() => setActiveWallet(wallet)}>
                  {wallet.address} {isContractWallet ? "AA" : "EOA"}
                </Text>
              ) : (
                <Button onClick={() => setActiveWallet(wallet)}>
                  Activate {wallet.address}
                </Button>
              )}
            </Flex>
          ))}
        </VStack>
        <Button onClick={unlink}>Logout</Button>
      </Flex>
    );
  }

  //use "login" for the full privy flow
  return (
    <Button onClick={() => login()} colorScheme="orange">
      Login
    </Button>
  );
};
