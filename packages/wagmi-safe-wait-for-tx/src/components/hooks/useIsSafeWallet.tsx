import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { isSafeWallet } from "../../utils/safe";

export const useIsSafeWallet = (address?: Address) => {
  const publicClient = usePublicClient();
  const [_isSafeWallet, setIsSafeWallet] = useState<boolean>();

  useEffect(() => {
    if (!address || !publicClient) return;

    isSafeWallet(publicClient, address).then(setIsSafeWallet);
  }, [address, publicClient]);

  return _isSafeWallet;
};

/* try to check whether our connector *can* actually be a safe,  this is privy specific,
    // if (!activeWallet.connectorType.startsWith("wallet_connect")) {
    //   setIsSafeWallet(false);
    //   return;
    // }
*/
