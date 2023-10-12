import { useIsContractWallet } from "@/components/hooks/isContractWallet";
import { resolveSafeTx } from "@/utils/safe";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { WriteContractResult } from "wagmi/actions";

export const useSafeWaitForTransaction = (
  writeResult: WriteContractResult | undefined
) => {
  const { address } = useAccount();

  const isContractWallet = useIsContractWallet(address);
  const { chain } = useNetwork();

  const [safeResult, setSafeResult] = useState<
    WriteContractResult | undefined
  >();

  const waitResponse = useWaitForTransaction(safeResult);

  useEffect(() => {
    console.log(isContractWallet, chain);
    if (!writeResult || !chain || isContractWallet === undefined) {
      return;
    }

    if (isContractWallet) {
      //try to resolve the underlying transaction
      resolveSafeTx(chain.id, writeResult.hash).then((resolvedTx) => {
        if (!resolvedTx) throw new Error("couldnt resolve safe tx");
        setSafeResult({ hash: resolvedTx });
      });
    } else {
      setSafeResult(writeResult);
    }
  }, [chain, isContractWallet, writeResult]);

  return waitResponse;
};
