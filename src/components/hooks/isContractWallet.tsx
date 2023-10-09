import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";

export const useIsContractWallet = () => {
  const publicClient = usePublicClient();
  const [isContractWallet, setIsContractWallet] = useState<boolean>();
  const { wallet: activeWallet } = usePrivyWagmi();

  useEffect(() => {
    if (!activeWallet || !publicClient) return;

    console.log(activeWallet, publicClient);

    //maybe check -> if (activeWallet.connectorType.startsWith("wallet_connect"))

    publicClient
      .getBytecode({ address: activeWallet.address as Address })
      .then((b) => {
        setIsContractWallet((b?.length || 0) > 0);
      });
  }, [activeWallet, publicClient]);

  return isContractWallet;
};
