import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { isContractWallet } from "../../utils/safe";

export const useIsContractWallet = (address?: Address) => {
  const publicClient = usePublicClient();
  const [_isContractWallet, setIsContractWallet] = useState<
    Awaited<ReturnType<typeof isContractWallet>>
  >({});

  useEffect(() => {
    if (!address || !publicClient) return;

    isContractWallet(publicClient, address).then(setIsContractWallet);
  }, [address, publicClient]);

  return _isContractWallet;
};

/* try to check whether our connector *can* actually be a safe,  this is privy specific,
    // if (!activeWallet.connectorType.startsWith("wallet_connect")) {
    //   setIsSafeWallet(false);
    //   return;
    // }
*/
