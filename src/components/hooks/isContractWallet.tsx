import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";

//Gnosis Safe Proxy
const PROXY_BYTECODE =
  "0x608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033";

export const useIsContractWallet = (address?: Address) => {
  const publicClient = usePublicClient();

  const [isContractWallet, setIsContractWallet] = useState<boolean>();

  useEffect(() => {
    if (!address || !publicClient) return;

    publicClient.getBytecode({ address }).then((b) => {
      if (b?.length == 0) {
        setIsContractWallet(false);
      } else {
        //todo: Safes *can* be deployed without a proxy
        setIsContractWallet(PROXY_BYTECODE === b);
      }
    });
  }, [address, publicClient]);

  return isContractWallet;
};

/* try to check whether our connector *can* actually be a safe,  this is privy specific,
    // if (!activeWallet.connectorType.startsWith("wallet_connect")) {
    //   setIsContractWallet(false);
    //   return;
    // }
*/
