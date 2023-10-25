import { useAuth } from "@/context/AuthContext";
import { useLit } from "@/context/LitContext";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useCallback, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

const accessControlConditions = {
  contractAddress: "",
  standardContractType: "",
  chain: "ethereum",
  method: "eth_getBalance",
  parameters: [":userAddress", "latest"],
  returnValueTest: {
    comparator: ">=",
    value: "1000000000000", // 0.000001 ETH
  },
};
export const LitActions = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { isContract: isContractWallet } = useIsContractWallet(address);
  const { lit } = useLit();
  const { authSig } = useAuth();

  const [encrypted, setEncrypted] = useState<{ key: string; message: Blob }>();

  const encrypt = useCallback(async () => {
    if (!lit || !chain) return;

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      "this is a secret message"
    );

    const encryptedSymmetricKey = await lit.saveEncryptionKey({
      accessControlConditions: [
        {
          ...accessControlConditions,
          chain: chain.network,
        },
      ],
      symmetricKey,
      authSig,
      chain: chain.network,
    });

    setEncrypted({
      key: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
      message: encryptedString,
    });
  }, [authSig, chain, lit]);

  const decrypt = useCallback(async () => {
    if (!lit || !chain || !encrypted) return;

    const decryptedKey = await lit.getEncryptionKey({
      accessControlConditions: [
        {
          ...accessControlConditions,
          chain: chain.network,
        },
      ],
      toDecrypt: encrypted.key,
      authSig,
      chain: chain.network,
    });

    const decryptedString = await LitJsSdk.decryptString(
      encrypted.message,
      decryptedKey
    );

    console.log(decryptedString);
  }, [authSig, chain, encrypted, lit]);

  if (!lit || !authSig) return <></>;
  return (
    <div>
      <button onClick={encrypt}>encrypt</button>
      {encrypted && <button onClick={decrypt}>decrypt</button>}
    </div>
  );
};
